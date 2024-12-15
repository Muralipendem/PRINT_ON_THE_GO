import React, { useEffect, useRef, useState } from "react";
import mapimg from "./map.svg";

const MapComponent = () => {
  const mapRef = useRef(null); // Reference for the map container
  const mapInstanceRef = useRef(null); // Keep track of the Leaflet map instance
  const [radius, setRadius] = useState(1000); // Default radius in meters

  // Hardcoded location points
  const locations = [
    {
      lat: 17.8177421,
      lng: 83.2111286,
      title: "Xerox Solutions",
      description: "This is location 1",
      img: "https://media.istockphoto.com/id/1148183399/photo/close-up-hands-choosing-school-stationery-in-the-supermarket.jpg?s=612x612&w=0&k=20&c=LFSn0LcVvX1tmh6LJNBcLJ6VbK2N3RX3gyyTM0Rt0wU=",
    },
    {
      lat: 17.8197412,
      lng: 83.2131287,
      title: "Xerox Solution 2",
      description: "This is location 2",
      img: "https://media.istockphoto.com/id/1148183399/photo/close-up-hands-choosing-school-stationery-in-the-supermarket.jpg?s=612x612&w=0&k=20&c=LFSn0LcVvX1tmh6LJNBcLJ6VbK2N3RX3gyyTM0Rt0wU=",
    },
  ];

  // Haversine formula to calculate the distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // Distance in meters
  };

  useEffect(() => {
    if (mapInstanceRef.current) return; // Prevent reinitialization of the map

    // Load Leaflet JS and CSS
    const leafletCSS = document.createElement("link");
    leafletCSS.rel = "stylesheet";
    leafletCSS.href = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css";
    document.head.appendChild(leafletCSS);

    const leafletJS = document.createElement("script");
    leafletJS.src = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.js";
    leafletJS.onload = () => {
      const map = L.map(mapRef.current).setView([17.8177412, 83.2111287], 13);
      mapInstanceRef.current = map;

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Custom user location icon
      const userIcon = L.icon({
        iconUrl: mapimg,
        iconSize: [35, 41],
        iconAnchor: [12, 41],
      });

      // Custom other locations icon
      const locationIcon = L.icon({
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });

      // Get user location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;

          const userMarker = L.marker([userLat, userLng], { icon: userIcon })
            .addTo(map)
            .bindPopup("Your Location")
            .openPopup();

          let rangeCircle;

          const updateMarkersAndCircle = () => {
            if (rangeCircle) map.removeLayer(rangeCircle);

            rangeCircle = L.circle([userLat, userLng], {
              color: "blue",
              fillColor: "blue",
              fillOpacity: 0.2,
              radius: radius,
            }).addTo(map);

            map.eachLayer((layer) => {
              if (layer instanceof L.Marker && layer !== userMarker) {
                map.removeLayer(layer);
              }
            });

            locations.forEach((location) => {
              const distance = calculateDistance(
                userLat,
                userLng,
                location.lat,
                location.lng
              );
              if (distance <= radius) {
                const marker = L.marker([location.lat, location.lng], {
                  icon: locationIcon,
                }).addTo(map);
                marker.bindPopup(`
                  <div class="flex flex-col items-center">
                    <img src=${location.img} class="w-20 h-20 object-cover rounded-full mb-2" />
                    <h3 class="text-lg font-bold">${location.title}</h3>
                    <p>${location.description}</p>
                    <p class="text-sm text-gray-600">Distance: ${distance.toFixed(
                      2
                    )} meters</p>
                  </div>`);
              }
            });
          };

          updateMarkersAndCircle();
        });
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    };

    document.body.appendChild(leafletJS);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      document.head.removeChild(leafletCSS);
      document.body.removeChild(leafletJS);
    };
  }, [radius]);

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold text-center text-blue-600 mb-4">
        Nearby Locations with Range Filter
      </h3>
      <div
        id="map"
        ref={mapRef}
        className="w-full h-96 sm:h-[70vh] rounded-lg shadow-lg"
      ></div>
      <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
        <label className="text-lg font-medium text-gray-700">
          Search Radius (meters):
        </label>
        <input
          type="number"
          value={radius}
          onChange={(e) => setRadius(parseInt(e.target.value, 10) || 1000)}
          placeholder="Enter radius"
          className="w-full sm:w-auto p-2 border rounded-lg shadow focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>
    </div>
  );
};

export default MapComponent;
