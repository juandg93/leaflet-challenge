// Fetching data
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

fetch(url)
  .then(response => response.json())
  .then(data => {
  })
  .catch(error => console.error('Error fetching data:', error));

// Initialize the map
var map = L.map('map').setView([39.8283, -98.5795], 4); // US-centered view

// Add OpenStreetMap tiles and attributions
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Function to determine the marker size based on magnitude
function getMarkerSize(magnitude) {
  return magnitude * 20000; 
}

// Function to determine the marker color based on depth
function getMarkerColor(depth) {
  if (depth < -10) return '#3399FF'; // Below -10 - Light Blue
  else if (depth < 10) return '#00CC00'; // 10 to 30 - Green
  else if (depth < 30) return '#FFFF00'; // 10 to 30 - Yellow
  else if (depth < 50) return '#FF9900'; // 30 to 50 - Orange
  else if (depth < 70) return '#FF6600'; // 50 to 70 - Dark Orange
  else if (depth < 90) return '#FF3300'; // 70 to 90 - Red
  return '#FF0000'; // 90+ - Dark Red
}

// Adding earthquake data
fetch(url)
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        return L.circle(latlng, {
          radius: getMarkerSize(feature.properties.mag),
          fillColor: getMarkerColor(feature.geometry.coordinates[2]),
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        }).bindPopup(`Location: ${feature.properties.place}<br>Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]} km`);
      }
    }).addTo(map);
  })
  .catch(error => console.error('Error adding data to map:', error));

// Adding a legend and color boxes
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function(map) {
  var div = L.DomUtil.create('div', 'info legend'),
    depths = [-10, 10, 30, 50, 70, 90],
    labels = [],
    from, to;

  for (var i = 0; i < depths.length; i++) {
    from = depths[i];
    to = depths[i + 1];

    labels.push(
      '<i style="background:' + getMarkerColor(from + (from < 0 ? 0 : 1)) + '; width: 18px; height: 18px; float: left; margin-right: 8px; opacity: 0.7;"></i> ' +
      (from < 0 ? '< ' : '') + from + (to ? '&ndash;' + to : '+')
    );
  }

  div.innerHTML = labels.join('<br>');
  return div;
};

legend.addTo(map);

