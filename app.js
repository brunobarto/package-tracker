// --- INITIALISATION MAPLIBRE ---
const map = new maplibregl.Map({
  container: 'map',
  style: 'https://demotiles.maplibre.org/style.json',
  center: [2.3522, 48.8566], // Paris
  zoom: 5
});

// --- CAMION SVG MODERNE ---
const truckSVG = `
<svg width="40" height="22" viewBox="0 0 40 22" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="6" width="26" height="10" rx="2" fill="#222"/>
  <rect x="26" y="8" width="10" height="8" rx="1" fill="#555"/>
  <circle cx="8" cy="18" r="4" fill="#000"/>
  <circle cx="22" cy="18" r="4" fill="#000"/>
  <circle cx="32" cy="18" r="4" fill="#000"/>
</svg>
`;

const truckIcon = document.createElement("div");
truckIcon.innerHTML = truckSVG;
truckIcon.style.transform = "translate(-20px, -11px)";

const marker = new maplibregl.Marker({
  element: truckIcon
}).setLngLat([2.3522, 48.8566]).addTo(map);

// --- ROUTE FRANCE ---
const route = [
  [2.3522, 48.8566],   // Paris
  [-1.5536, 47.2184],  // Nantes
  [4.8357, 45.7640],   // Lyon
  [5.3698, 43.2965]    // Marseille
];

let segment = 0;
let progress = 0;

// interpolation
function lerp(a, b, t) {
  return a + (b - a) * t;
}

// timeline
function updateTimeline(i) {
  document.querySelectorAll("#timeline li").forEach((li, idx) => {
    li.classList.toggle("active", idx <= i);
  });
}

// animation camion
function animateTruck() {
  if (segment >= route.length - 1) return;

  const [lon1, lat1] = route[segment];
  const [lon2, lat2] = route[segment + 1];

  progress += 0.005;

  if (progress >= 1) {
    progress = 0;
    segment++;
    updateTimeline(segment);
    if (segment >= route.length - 1) return;
  }

  const lon = lerp(lon1, lon2, progress);
  const lat = lerp(lat1, lat2, progress);

  marker.setLngLat([lon, lat]);
  map.easeTo({ center: [lon, lat], duration: 500 });

  requestAnimationFrame(animateTruck);
}

// bouton Track
document.getElementById("trackBtn").addEventListener("click", () => {
  segment = 0;
  progress = 0;
  updateTimeline(0);
  marker.setLngLat(route[0]);
  map.jumpTo({ center: route[0], zoom: 6 });
  requestAnimationFrame(animateTruck);
});
