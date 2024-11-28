let dataTable; // Global variable to store the DataTable instance

function loadJsonData() {
  $.ajax({
    url: '../changes.json',
    dataType: 'text',
    success: function(rawData) {
      try {
        const data = JSON.parse(rawData.replace(/:\s*NaN\s*,/g, ': null,'));
        const addedData = data.added || [];
        initializeTable(addedData);
        setupTimeFilter(addedData);
        const filteredData = filterDataByTime(addedData, 'daily');
        dataTable.clear();
        dataTable.rows.add(filteredData);
        dataTable.draw();
      } catch (e) {
        console.error('Error parsing JSON:', e);
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.error('Error loading JSON data:', textStatus, errorThrown);
    }
  });
}

function initializeTable(data) {
  if (typeof data !== "undefined") {
    $("div").removeClass("loading-overlay");
    dataTable = $('#example').DataTable({
      search: { return: true },
      responsive: {
        details: {
          type: 'column',
          target: 0,
          renderer: function(api, rowIdx, columns) {
            var data = $.map(columns, function(col, i) {
              return col.hidden
                ? '<tr data-dt-row="' + col.rowIndex + '" data-dt-column="' + col.columnIndex + '">' +
                    '<td>' + col.title + ':</td> ' +
                    '<td>' + col.data + '</td>' +
                  '</tr>'
                : '';
            }).join('');

            return data ? $('<table/>').append(data) : false;
          }
        }
      },
      data: data,
      processing: true,
      bDestroy: true,
      scrollX: true,
      lengthMenu: [[25,50, 100, 250, 500], [25,50, 100, 250, 500]],
      columns: [
        { 
          "data": "Organisation Name",
          "orderable": true,
          "className": 'dtr-control all'
        },
        { 
          "data": "insertion_time",
          "orderable": true,
          "className": 'all'
        },
        { 
          "data": "Town/City",
          "orderable": false,
          "className": 'none'
        },
        { 
          "data": "County",
          "orderable": false,
          "className": 'none'
        },
        { 
          "data": "Type & Rating",
          "orderable": false,
          "className": 'none'
        },
        { 
          "data": "Route",
          "orderable": false,
          "className": 'none'
        }
      ],
      initComplete: function() {
        $("#example").show();
      }
    });
  }
}

function setupTimeFilter(fullData) {
  $('#timeFilter').on('change', function() {
    const selectedValue = $(this).val();
    const filteredData = filterDataByTime(fullData, selectedValue);
    
    // Clear and reload the table with filtered data
    dataTable.clear();
    dataTable.rows.add(filteredData);
    dataTable.draw();
  });
}

function filterDataByTime(data, timeRange = 'daily') {
  const now = new Date();
  now.setHours(0, 0, 0, 0);  // Set to start of today
  
  return data.filter(item => {
    const insertionDate = new Date(item.insertion_time);
    insertionDate.setHours(0, 0, 0, 0);  // Set to start of insertion day
    
    const diffTime = now - insertionDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    switch(timeRange) {
      case 'daily':
        return diffDays === 0;  // Today
      case 'weekly':
        return diffDays <= 7;   // Last 7 days
      case 'monthly':
        return diffDays <= 30;  // Last 30 days
      default:
        return diffDays === 0;  // Default to today
    }
  });
}

// Initialize when document is ready
$(document).ready(function() {
  loadJsonData();
});