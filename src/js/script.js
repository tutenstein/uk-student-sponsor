
import '../css/style.css';

function loadJsonData() {
  // Tabloda yükleniyor göstergesini ekle
  $("#example").addClass("loading-overlay");
  
  return $.ajax({
    url: '../Worker_and_Temporary_Worker.json',
    dataType: 'json'
  }).then(function(data) {
    return loadTable(data);
  }).fail(function(jqXHR, textStatus, errorThrown) {
    console.error('Error loading JSON data:', textStatus, errorThrown);
    // Hata durumunda yükleniyor göstergesini kaldır
    $("#example").removeClass("loading-overlay");
  });
}

function loadTable(data) {
  if (!Array.isArray(data)) {
    console.error('Invalid data format');
    $("#example").removeClass("loading-overlay");
    return;
  }

  // Veriyi chunk'lara böl
  const chunkSize = 2000;
  const chunks = [];
  
  for (let i = 0; i < data.length; i += chunkSize) {
    chunks.push(data.slice(i, i + chunkSize));
  }

  // DataTable'ı initialize et
  const table = $('#example').DataTable({
    destroy: true,
    searching: true,
    responsive: true,
    processing: true,
    deferRender: true,
    orderClasses: false,
    lengthMenu: [[10, 20, 50, 100, 250, 500], [10, 20, 50, 100, 250, 500]],
    columns: [
      { data: "Organisation Name" },
      { data: "Town/City" },
      { data: "County" },
      { data: "Type & Rating" },
      { data: "Route" }
    ],
    initComplete: function() {
      // Yükleniyor göstergesini kaldır
      $("#example").removeClass("loading-overlay");
    }
  });

  // Chunk'ları sırayla ekle
  let currentChunk = 0;
  
  function addNextChunk() {
    if (currentChunk < chunks.length) {
      table.rows.add(chunks[currentChunk]).draw(false);
      currentChunk++;
      
      // Sonraki chunk'ı eklemek için setTimeout kullan
      setTimeout(addNextChunk, 50);
    }
  }

  // İlk chunk'ı ekle
  addNextChunk();
}

// Sayfa yüklendiğinde başlat
$(document).ready(function() {
  loadJsonData();
});