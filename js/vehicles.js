function updateVehiclePositions(vehicleCollection)
{
    var balloonIconColours = ["red", "blue", "cyan", "green", "orange", "purple", "yellow"]

    function getBalloonIconStyle()
    {
        var colour = balloonIconColours[Math.floor(Math.random() * balloonIconColours.length)];

        return new ol.style.Style({
            image: new ol.style.Icon({
              anchor: [23,168],
              anchorXUnits: 'pixels',
              anchorYUnits: 'pixels',
              src: "https://tracker.habhub.org/img/markers/balloon-" + colour + ".png",
              scale: 0.5,
            }),
          });
    }
    
    var iconFeature = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([-0.127758, 51.507351])),
    name: 'LONDON',
    });

    iconFeature.setStyle(getBalloonIconStyle());

    var iconFeatureTwo = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([-0.508780, 51.435020])),
    name: 'SURREY',
    });

    iconFeatureTwo.setStyle(getBalloonIconStyle());
    
    vehicleCollection.push(iconFeature);
    vehicleCollection.push(iconFeatureTwo);
}