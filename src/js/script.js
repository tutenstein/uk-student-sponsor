
import '../css/style.css';

function loadJsonData() {
  // Loading overlay'i göster
  $("div").addClass("loading-overlay");
  
  return $.ajax({
    url: '../Worker_and_Temporary_Worker.json',
    dataType: 'json'
  }).then(function(data) {
    return loadTable(data);
  }).fail(function(jqXHR, textStatus, errorThrown) {
    console.error('Error loading JSON data:', textStatus, errorThrown);
    $("div").removeClass("loading-overlay");
  });
}

function loadTable(data) {
  if (!Array.isArray(data)) {
    console.error('Invalid data format');
    return;
  }

  // Veriyi chunk'lara böl
  const chunkSize = 1000;
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
    deferRender: true,    // Önemli performans optimizasyonu
    orderClasses: false,  // Sıralama için CSS class'larını devre dışı bırak
    lengthMenu: [[50, 100, 250, 500], [50, 100, 250, 500]], // Sayfa başına gösterilecek kayıt sayısını sınırla
    columns: [
      { data: "Organisation Name" },
      { data: "Town/City" },
      { data: "County" },
      { data: "Type & Rating" },
      { data: "Route" }
    ],
    initComplete: function() {
      $("#example").show();
      $("div").removeClass("loading-overlay");
    }
  });

  // Chunk'ları sırayla ekle
  let currentChunk = 0;
  
  function addNextChunk() {
    if (currentChunk < chunks.length) {
      table.rows.add(chunks[currentChunk]).draw(false);
      currentChunk++;
      
      // Sonraki chunk'ı eklemek için setTimeout kullan
      setTimeout(addNextChunk, 100);
    }
  }

  // İlk chunk'ı ekle
  addNextChunk();
}

// Sayfa yüklendiğinde başlat
$(document).ready(function() {
  loadJsonData();
});