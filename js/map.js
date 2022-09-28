//Initialise map
var map = L.map('map').setView([7.0, -1.09], 7);


//Add Osm tile layer to map
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);


var googleStreets = L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

var googleHybrid = L.tileLayer('http://{s}.google.com/vt?lyrs=s,h&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

var googleSat = L.tileLayer('http://{s}.google.com/vt?lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
})
//.addTo(map)


var googleTerrain = L.tileLayer('http://{s}.google.com/vt?lyrs=p&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});




//var marker = L.marker([7,-1.09]).addTo(map);


// Region Layer Style
var regionStyle = {
     color :"red",
     opacity: 0.3,
     weight:1
     
}

// Health Facilities Style
var healthfacilitiesStyle={
   radius:8,
   fillColor:"red",
   color: "green",
   weight:1,

}

// Railway Style
var railwaysStyle ={
    color:"brown",
    weight:1.5,
    opacity:0.7, 
}



//Add Geojson layers
var regionlayer = L.geoJson(region,{
    style:regionStyle,
    onEachFeature:function (feature, layer) {
        
        area =(turf.area(feature)/1000000).toFixed(3)
        center_lng = turf.center(feature).geometry.coordinates[0].toFixed(2)
        center_lat = turf.center(feature).geometry.coordinates[1].toFixed(2)

       label= `Name: ${feature.properties.region}<br>` 
       label+= `Area: ${area}<br>`
       label+= `Center:Lng : ${center_lng}, Lat : ${center_lat} <br>`


       layer.bindPopup(label)

    }

 
}).addTo(map);


var healthsitelayer = L.geoJson(healthfacilities,{
    pointToLayer:function(feature, latlng)
    
     {
    return L.circleMarker(latlng,healthfacilitiesStyle);

},
  onEachFeature:function (feature, layer) {
        layer.bindPopup(feature.properties.name)
    }


})
//.addTo(map);

var railwaylayer = L.geoJson(railways,{style:railwaysStyle,
onEachFeature:function (feature, layer) {
        layer.bindPopup(feature.properties.NAME)
    }

})
//.addTo(map);


// ADDING WMS LAYERS
//river
var riverWMS = L.tileLayer.wms("http://localhost:8080/geoserver/geospatial/wms", {
    layers: 'geospatial:Rivers',
    format: 'image/png',
    transparent: true,
    attribution: ""
})
//.addTo(map)

//treecover
var  treeCoverWMS= L.tileLayer.wms("http://localhost:8080/geoserver/geospatial/wms", {
    layers: 'geospatial:Treecover',
    format: 'image/png',
    transparent: true,
    attribution: ""
})
//.addTo(map)

// Airports
var  airportsWMS= L.tileLayer.wms("http://localhost:8080/geoserver/geospatial/wms", {
    layers: 'geospatial:Airports',
    format: 'image/png',
    transparent: true,
    attribution: ""
})
//.addTo(map)



//Basemaps

var baseLayers = {
    "OpenStreetMap": osm,
    "Google Street Map": googleStreets,
    "Google Hybrid": googleHybrid,
    "Google Satellite": googleSat,
    "Google Terrain": googleTerrain, 
};

var overlays = {
   // "Marker": marker,
    //"Roads": roadsLayer
    "Railways":railwaylayer,
    "Health Facilities":healthsitelayer,
    "Region":regionlayer,
    "Rivers":riverWMS,
    "Tree Cover": treeCoverWMS,
    "Airports": airportsWMS



};

//Add leaflet browser print control to map

L.control.browserPrint({position: 'topleft'}).addTo(map);



//Add layer control to map
L.control.layers(baseLayers, overlays,{collapsed:true}).addTo(map);



//Add mouse hover coordinate
map.on("mousemove",function(e){
	
	$("#coordinate").html(`Lat:${e.latlng.lat.toFixed(3)}, Lng:${e.latlng.lng.toFixed(3)}`)
})




// Add scale to map
L.control.scale().addTo(map);

