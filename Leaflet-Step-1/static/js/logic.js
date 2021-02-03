/*Setting the map and attaching a zoom level  */
const myMap = L.map("map", {
    center: [19.53063660148283, -98.15812975179743],
    zoom: 3
});
const streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/dark-v10",
    accessToken: API_KEY
}).addTo(myMap);


let URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson"
d3.json(URL, function (data) {
    let earthquakes = data.features;
    //    console.log(earthquakes);
    // Sets up our color scheme for earthquakes
    let color = {
        level1: "#00FF80",
        level2: "#80FF00",
        level3: "#FFFF00",
        level4: "#FF0080",
        level5: "#FF8000",
        level6: "#FF0000"
    }

    // determining variables to D3 for reading the info

    for (let i = 0; i < earthquakes.length; i++) {
        let latitude = earthquakes[i].geometry.coordinates[1];
        let longitude = earthquakes[i].geometry.coordinates[0];
        let magnitude = earthquakes[i].properties.mag;
        let fillColor;
        if (magnitude > 5) {
            fillColor = color.level6;
        } else if (magnitude > 4) {
            fillColor = color.level5;
        } else if (magnitude > 3) {
            fillColor = color.level4;
        } else if (magnitude > 2) {
            fillColor = color.level3;
        } else if (magnitude > 1) {
            fillColor = color.level2;
        } else {
            fillColor = color.level1;
        }

        /* The radius of each circle will be determined on an exponential scale based on the size of the magnitude.
         I chose to use exponential so that larger earthquakes will have a much higher radius than smaller earthquakes */
        let epicenter = L.circleMarker([latitude, longitude], {
            radius: magnitude ** 2,
            color: "black",
            fillColor: fillColor,
            fillOpacity: 1,
            weight: 1
        });
        epicenter.addTo(myMap);


        /* Set up labels as a pop-up when we use the mouse to point to one of the circles */

        epicenter.bindPopup("<h3> " + new Date(earthquakes[i].properties.time) + "</h3><h4>Magnitude: " + magnitude +
            "<br>Location: " + earthquakes[i].properties.place + "</h4><br>");

    }

    /* Setting the legend to appear in the bottom right of our chart */
    var legend = L.control({
        position: 'bottomright'
    });

    /* Adding on the legend based off the color scheme we have */
    legend.onAdd = function (color) {
        var div = L.DomUtil.create('div', 'info legend');
        var levels = ['>1', '1-2', '2-3', '3-4', '4-5', '5+'];
        var colors = ['#00FF80', '#80FF00', '#FFFF00', '#FF0080', '#FF8000', '#FF0000']
        for (var i = 0; i < levels.length; i++) {
            div.innerHTML += '<i style="background:' + colors[i] + '"></i>' + levels[i] + '<br>';
        }
        return div;
    }
    legend.addTo(myMap);
})