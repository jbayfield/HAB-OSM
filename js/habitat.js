var vehicleQueryURL = "https://spacenear.us/tracker/datanew.php?mode=1day&type=positions&format=json&max_positions=0&position_id=0&vehicles=!RS_*%3B"
var vehicles = {};

function getBalloonIconStyle()
    {
        var balloonIconColours = ["red", "blue", "cyan", "green", "orange", "purple", "yellow"]
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
                    }
                }
                else
                {
                    vehicles[callsign] = {
                        "last_pid": parseInt(positionEntry["position_id"]),
                        "gps_time": positionEntry["gps_time"],
                        "gps_lat": positionEntry["gps_lat"],
                        "gps_lon": positionEntry["gps_lon"],
                        "gps_alt": positionEntry["gps_alt"],
                        "position_history": positionEntry["position_id"] + "," + positionEntry["gps_time"] + "," + positionEntry["gps_lat"] + "," + positionEntry["gps_lon"] + "," + positionEntry["gps_alt"] + ";",
                    }
                }

            });
            
            for (var callsign in vehicles) {
                var vehicle = vehicles[callsign];
        
                var vehicleFeature = new ol.Feature({
                  geometry: new ol.geom.Point(ol.proj.fromLonLat([vehicle.gps_lon, vehicle.gps_lat])),
                  name: callsign,
                });
                vehicleFeature.setStyle(getBalloonIconStyle());
        
                vehicleCollection.push(vehicleFeature);
            }

        }
    }
    
}