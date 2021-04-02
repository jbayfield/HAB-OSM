var vehicleQueryURL = "https://spacenear.us/tracker/datanew.php?mode=1day&type=positions&format=json&max_positions=0&position_id=0&vehicles=!RS_*%3B"

function getVehiclePositions()
{
    var vehicles = {};

    const Http = new XMLHttpRequest();
    Http.open("GET", vehicleQueryURL);
    Http.send();

    Http.onreadystatechange = function(){
        console.log(this.readyState)
        if(this.readyState == 4 && this.status == 200)
        {
            var positionEntries = JSON.parse(Http.responseText);
            for(positionEntry in vehicles["positions"]["position"])
            {
                var callsign = positionEntry["vehicle"];
                if(callsign in vehicles){

                }
                else
                {
    
                }
            }
        }
    }
}