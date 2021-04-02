var vehicleCollection = new ol.Collection();
var trackerCollection = new ol.Collection();
var map = null;

function initMap(){  
      var vectorSource = new ol.source.Vector({
        features: vehicleCollection
      })
    
      var vectorLayer = new ol.layer.Vector({
        source: vectorSource,
      });
      
      map = new ol.Map({
        target: document.getElementById('map'),
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          }),
          vectorLayer
        ],
        view: new ol.View({
          center: ol.proj.fromLonLat([-0.127758, 51.507351]),
          zoom: 8
        })
      });
    
      var element = document.getElementById('popup');
      var popup = new ol.Overlay({
        element: element,
        positioning: 'bottom-center',
        stopEvent: false,
        offset: [0, -50],
      });
      map.addOverlay(popup);
      
      // display popup on click
      map.on('click', function (evt) {
        var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
          return feature;
        });
        if (feature) {
          var coordinates = feature.getGeometry().getCoordinates();
          popup.setPosition(coordinates);
          $(element).popover({
            placement: 'top',
            html: true,
            content: feature.get('name'),
          });
          $(element).popover('show');
        } else {
          $(element).popover('dispose');
        }
      });
    
      // change mouse cursor when over marker
      map.on('pointermove', function (e) {
        if (e.dragging) {
          $(element).popover('dispose');
          return;
        }
        var pixel = map.getEventPixel(e.originalEvent);
        var hit = map.hasFeatureAtPixel(pixel);
        map.getTarget().style.cursor = hit ? 'pointer' : '';
      });
}