
import '../css/style.css';

function loadJsonData() {
  $.ajax({
    url: '../Worker_and_Temporary_Worker.json', // Path to your local JSON file
    dataType: 'json',
    success: function(data) {
      loadTable(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.error('Error loading JSON data:', textStatus, errorThrown);
    }
  });
}

function loadTable(data) {
  console.log(data);
  if (typeof data !== "undefined") {
    $("div").removeClass("loading-overlay");
    $(document).ready(function() {
      $('#example').DataTable({
        search: {
          return: true,
        },
        responsive: true,
        data: data,
        processing: true,
        "bDestroy": true,
        columns: [
          { "data": "Organisation Name" },
          { "data": "Town/City" },
          { "data": "County" },
          { "data": "Type & Rating" },
          { "data": "Route" },
        ]
        ,"initComplete": function(){ 
          $("#example").show();
          }
      });
    });
  }
}


// Call the function to load JSON data
loadJsonData();