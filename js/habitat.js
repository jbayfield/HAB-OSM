var vehicleQueryURL = "https://spacenear.us/tracker/datanew.php?mode=1day&type=positions&format=json&max_positions=0&position_id=0&vehicles=!RS_*%3B"
var vehicles = {};

function getBalloonIconStyle(vehicle, callsign)
{
    var marker = "balloon-cyan"

    if (callsign.includes("_chase"))
    {
        marker = "car-blue";
    }
    else
    {
        marker = "balloon-" + vehicle.display_colour;
    }

    var image_source = "https://tracker.habhub.org/img/markers/" + marker + ".png";

    return new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [46,160],
            anchorXUnits: 'pixels',
            anchorYUnits: 'pixels',
            src: image_source,
            scale: 0.5,
        }),
        text: new ol.style.Text({
            font: 'bold 15px Calibri,sans-serif',
            fill: new ol.style.Fill({ color: '#000' }),
            stroke: new ol.style.Stroke({
              color: '#fff', width: 2
            }),
            text: callsign,
            offsetY: -95,
        }),
    });
}

function parseLocationHistory(locationHistory)
{
    var locationsToReturn = [];

    var positionStrings = locationHistory.split(";");
    for (const positionEntry of positionStrings)
    {
        var positionValues = positionEntry.split(",");
        locationsToReturn.push([positionValues[3], positionValues[2]]);
    }

    console.log(locationsToReturn);
    return locationsToReturn;
}

function getVehiclePositions(vehicleCollection)
{
    const Http = new XMLHttpRequest();
    Http.open("GET", vehicleQueryURL);
    Http.send();

    Http.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200)
        {
            var positionEntries = JSON.parse(Http.responseText);
            positionEntries.positions.position.map(positionEntry => {
                console.log("Processing position " + parseInt(positionEntry.position_id))
                var callsign = positionEntry["vehicle"];
                if(callsign in vehicles){
                    vehicles[callsign]["position_history"] += positionEntry["position_id"] + "," + positionEntry["gps_time"] + "," + positionEntry["gps_lat"] + "," + positionEntry["gps_lon"] + "," + positionEntry["gps_alt"] + ";";
                    if(parseInt(positionEntry["last_pid"]) > vehicles[callsign]["last_pid"])
                    {
                        vehicles[callsign]["last_pid"] = parseInt(positionEntry["position_id"]);
                        vehicles[callsign]["gps_time"] = positionEntry["gps_time"];
                        vehicles[callsign]["gps_lat"] = positionEntry["gps_lat"];
                        vehicles[callsign]["gps_lon"] = positionEntry["gps_lon"];
                        vehicles[callsign]["gps_alt"] = positionEntry["gps_alt"];
                        vehicles[callsign]["position_history"] += positionEntry["position_id"] + "," + positionEntry["gps_time"] + "," + positionEntry["gps_lat"] + "," + positionEntry["gps_lon"] + "," + positionEntry["gps_alt"] + ";";
                    }
                }
                else
                {
                    var balloonIconColours = ["red", "blue", "cyan", "green", "orange", "purple", "yellow"]
                    var colour = balloonIconColours[Math.floor(Math.random() * balloonIconColours.length)];

                    vehicles[callsign] = {
                        "last_pid": parseInt(positionEntry["position_id"]),
                        "gps_time": positionEntry["gps_time"],
                        "gps_lat": positionEntry["gps_lat"],
                        "gps_lon": positionEntry["gps_lon"],
                        "gps_alt": positionEntry["gps_alt"],
                        "position_history": positionEntry["position_id"] + "," + positionEntry["gps_time"] + "," + positionEntry["gps_lat"] + "," + positionEntry["gps_lon"] + "," + positionEntry["gps_alt"] + ";",
                        "display_colour": colour,
                    }
                }

            });
            
            for (var callsign in vehicles) {
                var vehicle = vehicles[callsign];
        
                var vehicleFeature = new ol.Feature({
                  geometry: new ol.geom.Point(ol.proj.fromLonLat([vehicle.gps_lon, vehicle.gps_lat])),
                  name: callsign,
                });
                vehicleFeature.setStyle(getBalloonIconStyle(vehicle, callsign));

                var positionHistoryLineString = new ol.geom.LineString(parseLocationHistory(vehicle.position_history));
                positionHistoryLineString.transform('EPSG:4326', 'EPSG:3857');
                var positionHistoryFeature = new ol.Feature({
                    geometry: positionHistoryLineString,
                    name: 'Trajectory',
                });

                vehicleCollection.push(vehicleFeature);
                vehicleCollection.push(positionHistoryFeature);
            }

        }
    }
    
}