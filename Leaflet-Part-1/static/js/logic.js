// Store the url for earthquakes worldwide over the last 7 days
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
//Call the API and create markers for each earthquake
d3.json(url).then(function (data){
    createFeatures(data.features);
});

//Construct a function that will create a marker at each feature with radius 
//dependent on magnitude and color dependent on depth
function createFeatures(features){
    //Loop through each feature
    for (i = 0; i<features.length;i++){
        let feature = features[i];
        depth = feature.geometry.coordinates[2]
        //Set color conditional upon depth
        if (depth < 10){
            colorVar = "#ffffb2"
        }
        else if (depth < 30){
            colorVar = "#fed976"
        }
        else if (depth < 50){
            colorVar = "#feb24c"
        }
        else if (depth < 70){
            colorVar = "#fd8d3c"
        }
        else if (depth < 90){
            colorVar = "#f03b20"
        }
        else{
            colorVar = "#bd0026"
        };
    //Create each circle and bind a pop-up with info    
    L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
        radius: 20000*feature.properties.mag,
        color: colorVar, 
        opacity: 0.0,
        fillOpacity: 0.8
    }).bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Depth:${feature.geometry.coordinates[2]} km</p><hr><p>Magnitude:${feature.properties.mag}</p>`).addTo(myMap);
}};

//Create our base street and topographical layers
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

//Create the class of basemaps for layer control
let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
};

//Initialize the map
let myMap = L.map("map", {
    center: [
    37.09, -95.71
    ],
    zoom: 4,
    layers: [street]
});

//Add layer controls
L.control.layers(baseMaps).addTo(myMap);

//Tell the html where to store the legend, then add a legend-class container to the HTML
let info = L.control({
    position: "bottomright"
});

info.onAdd = function() {
    let div = L.DomUtil.create("div", "legend");
    return div;
};

info.addTo(myMap)

//Update the legend to include the desired color squares and information
document.querySelector(".legend").innerHTML = [
    "<p> Depth of Epicenter</p>",
    "<div class='input-color'><input type='text' value='<10 km' /><div class='color-box' style='background-color: #ffffb2;'></div></div>",
    "<div class='input-color'><input type='text' value='11-30 km' /><div class='color-box' style='background-color: #fed976;'></div></div>",
    "<div class='input-color'><input type='text' value='31-50 km' /><div class='color-box' style='background-color: #feb24c;'></div></div>",
    "<div class='input-color'><input type='text' value='51-70 km' /><div class='color-box' style='background-color: #fd8d3c;'></div></div>",
    "<div class='input-color'><input type='text' value='71-90 km' /><div class='color-box' style='background-color: #f03b20;'></div></div>",
    "<div class='input-color'><input type='text' value='90+ km' /><div class='color-box' style='background-color: #bd0026;'></div></div>"
  ].join("")


