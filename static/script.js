let polyline, marker, playbackInterval;
let points = [];
let currentIndex = 0;
let speedMultiplier = 1;

// Initialize map
let map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

var customIcon = L.icon({
    iconUrl: '/static/assets/carMarker.png', // Path to your custom marker image
    iconSize: [32, 32], // Size of the icon [width, height]
    iconAnchor: [16, 16], // Point of the icon that will correspond to marker's location (center bottom)
});

// Fetch data and initialize
function loadRoute(route) {
    if (polyline) {
        map.removeLayer(polyline);
    }



    currentIndex = 0;
    document.getElementById('timeSlider').value = 0;
    document.getElementById('currentTimestamp').textContent = `Timestamp: N/A`;

    // Fetch route data
    fetch(`/api/${route}`)
        .then(response => response.json())
        .then(data => {
            points = data.points;  // Store points globally
            const coordinates = points.map(point => [point.coordinate[1], point.coordinate[0]]); // Convert to [lat, lon]

            // Draw polyline
            polyline = L.polyline(coordinates, { color: 'blue' }).addTo(map);
            map.fitBounds(polyline.getBounds());

            
            document.getElementById('timeSlider').max = points.length - 1;

            
            if (marker) {
                marker.setLatLng(coordinates[0], { icon: customIcon });
            } else {
                marker = L.marker(coordinates[0], { icon: customIcon }).addTo(map);
            }

            updateLabel(0);
        })
        .catch(error => console.error('Error fetching route:', error));
}

function updateLabel(index) {
    const point = points[index];
    const timestamp = new Date(point.timestamp);
    document.getElementById('currentTimestamp').textContent = `Timestamp: ${timestamp.toISOString()}`;

    marker.setLatLng([point.coordinate[1], point.coordinate[0]], { icon: customIcon });
}


document.getElementById('timeSlider').addEventListener('input', function () {
    currentIndex = parseInt(this.value);
    updateLabel(currentIndex);
});


document.querySelectorAll('input[name="speed"]').forEach(radio => {
    radio.addEventListener('change', function () {
        speedMultiplier = parseInt(this.value);
        clearInterval(playbackInterval);
        startPlayback();
    });
});


function startPlayback() {
    playbackInterval = setInterval(() => {
        if (currentIndex < points.length - 1) {
            currentIndex += 1;
            updateLabel(currentIndex);
            document.getElementById('timeSlider').value = currentIndex;  
        } else {
            clearInterval(playbackInterval);
        }
    }, 1000 / speedMultiplier); 
}


document.getElementById('routes').addEventListener('change', function () {
    const selectedRoute = this.value;
    loadRoute(selectedRoute);
});

// Start playback on load
document.addEventListener('DOMContentLoaded', () => {
    loadRoute('route1'); 
    startPlayback();
});
