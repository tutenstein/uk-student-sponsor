#import functions_framework
#from firebase_admin import initialize_app
import requests
from datetime import datetime
import os
from bs4 import BeautifulSoup
import pandas as pd
from io import StringIO
#from firebase_admin import credentials
import json
from collections import defaultdict

#cred = credentials.Certificate(r"C:\Users\Salih\Downloads\uk-tier2-workers-firebase-adminsdk-61qj6-220d3c87bd.json")
# Initialize Firebase Admin
#initialize_app(cred)
print('initialized app') 
#@functions_framework.cloud_event
def scheduled_scraper(cloud_event):
  try:
      # Read existing JSON file if it exists
      existing_data = []
      if os.path.exists('public/Worker_and_Temporary_Worker.json'):
          with open('public/Worker_and_Temporary_Worker.json', 'r', encoding='utf-8') as f:
              existing_data = pd.read_json(f).to_dict('records')

      # Your scraping logic here
      page_url = "https://www.gov.uk/government/publications/register-of-licensed-sponsors-workers"
      response = requests.get(page_url)
      response.raise_for_status()   # Adjust based on your scraping logic
      soup = BeautifulSoup(response.content, 'html.parser')
      link_tag = soup.find('a', class_='govuk-link gem-c-attachment__link', href=True)
      if link_tag:
        csv_url = link_tag['href']
        if not csv_url.startswith('http'):
            csv_url = 'https://www.gov.uk' + csv_url  # Ensure the URL is absolute

        csv_response = requests.get(csv_url)
        csv_response.raise_for_status()
        csv_content = StringIO(csv_response.text)
        df = pd.read_csv(csv_content)
        output_path = 'public/Worker_and_Temporary_Worker.json'
        df.to_json(output_path, orient='records', force_ascii=False)
        print(f"Scraped data saved to {output_path}")
      # Deploy to Firebase Hosting
      #os.system('firebase deploy --only hosting')
      
      # Convert new data to records
      new_data = df.to_dict('records')

      # Track changes
      changes = {
          'added': [],
          'removed': [],
          'timestamp': datetime.now().isoformat()
      }

      # Create dictionaries for easier comparison
      existing_dict = {f"{record.get('Organisation Name', '')}-{record.get('Town/City', '')}": record 
                      for record in existing_data}
      new_dict = {f"{record.get('Organisation Name', '')}-{record.get('Town/City', '')}": record 
                 for record in new_data}

      current_time = datetime.now().strftime("%Y-%m-%d")
      
      # Find added and modified records
      for key, new_record in new_dict.items():
          if key not in existing_dict:
              new_record['insertion_time'] = current_time
              changes['added'].append(new_record)


      # Find removed records
      for key in existing_dict:
          if key not in new_dict:
              removed_record = existing_dict[key].copy()
              removed_record['deletion_time'] = current_time
              changes['removed'].append(removed_record)

      # After calculating changes
      print(f"Found {len(changes['added'])} new records")
      print(f"Found {len(changes['removed'])} removed records")

      # Let's also verify the data types
      print(f"Existing data type: {type(existing_data)}")
      print(f"New data type: {type(new_data)}")
      
      # Sample of the first record if available
      if existing_data:
          print(f"Sample existing record: {list(existing_dict.keys())[0]}")
      if new_data:
          print(f"Sample new record: {list(new_dict.keys())[0]}")

      # Load existing changes if the file exists
      changes_path = 'public/changes.json'
      if os.path.exists(changes_path):
          with open(changes_path, 'r', encoding='utf-8') as f:
              existing_changes = json.load(f)
      else:
          existing_changes = defaultdict(list)

      # Update changes
      existing_changes['added'].extend(changes['added'])
      existing_changes['removed'].extend(changes['removed'])
      existing_changes['timestamp'] = datetime.now().isoformat()

      # Save updated changes to the JSON file
      with open(changes_path, 'w', encoding='utf-8') as f:
          json.dump(existing_changes, f, indent=2, ensure_ascii=False)
      print(f"Updated changes saved to {changes_path}")

      # Save the new data as before
      df.to_json('public/Worker_and_Temporary_Worker.json', orient='records', force_ascii=False)
      print(f"Updated data saved to public/Worker_and_Temporary_Worker.json")

      # Deploy to Firebase Hosting
      #os.system('firebase deploy --only hosting')
      
      return {'success': True, 'timestamp': datetime.now().isoformat(), 'changes': existing_changes}
  
  except Exception as e:
      return {'success': False, 'error': str(e)}

if __name__ == '__main__':
    scheduled_scraper(None) 