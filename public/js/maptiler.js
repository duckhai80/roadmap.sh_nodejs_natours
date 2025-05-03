maptilersdk.config.apiKey = 'GguqZN9e3AleW9ssYzHs';

const map = new maptilersdk.Map({
  container: 'map', // container's id or the HTML element in which the SDK will render the map
  style: maptilersdk.MapStyle.STREETS,
  zoom: 5, // starting zoom
  interactive: false,
  geolocateControl: false,
  scrollZoom: false,
});

const locations = JSON.parse(document.getElementById('map').dataset.locations);

// Center these bounds in the viewport
const bounds = new maptilersdk.LngLatBounds();

locations.forEach((location) => {
  const el = document.createElement('div');

  el.className = 'marker';

  // Create marker
  new maptilersdk.Marker({
    element: el,
    anchor: 'bottom',
  })
    .setLngLat(location.coordinates)
    .addTo(map);

  // Create popup of marker
  new maptilersdk.Popup({
    offset: 30,
  })
    .setLngLat(location.coordinates)
    .setHTML(`<p>Day ${location.day}: ${location.description}</p>`)
    .addTo(map);

  // Extend the bounds that include given coordinates
  bounds.extend(location.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 200,
    left: 100,
    right: 100,
  },
});
