import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const MapComponent = () => {
  const mapRef = useRef(null); // Reference for the map container
  const mapInstanceRef = useRef(null); // Keep track of the MapLibre map instance
  const [radius, setRadius] = useState(1000); // Default radius in meters
  const [locations, setLocations] = useState([]); // Dynamic locations from API
  const drawRadiusCircle = (map, center, radius) => {
    const radiusInMeters = radius;

    const circleData = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              createCircle(center[0], center[1], radiusInMeters, 64),
            ],
          },
        },
      ],
    };

    if (map.getSource("radius-circle")) {
      map.getSource("radius-circle").setData(circleData);
    } else {
      map.addSource("radius-circle", {
        type: "geojson",
        data: circleData,
      });

      map.addLayer({
        id: "radius-circle",
        type: "fill",
        source: "radius-circle",
        paint: {
          "fill-color": "#00bf60",
          "fill-opacity": 0.3,
        },
      });
    }
  };

  const createCircle = (lng, lat, radiusInMeters, points) => {
    const coordinates = [];
    const distanceX = radiusInMeters / (111.32 * 1000);
    const distanceY = radiusInMeters / (111.32 * 1000);
    const centerX = lng;
    const centerY = lat;

    for (let i = 0; i < points; i++) {
      const angle = (i * 360) / points;
      const x = centerX + distanceX * Math.cos((angle * Math.PI) / 180);
      const y = centerY + distanceY * Math.sin((angle * Math.PI) / 180);
      coordinates.push([x, y]);
    }
    coordinates.push(coordinates[0]);
    return coordinates;
  };

  const fetchShops = async (userLat, userLng) => {
    try {
      const response = await fetch("/api/users/Getshops", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude: userLat,
          longitude: userLng,
          maxDistance: radius,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch shops");
      }

      const data = await response.json();
      setLocations(
        data.map((shop) => ({
          id: shop._id,
          lat: shop.latitude,
          lng: shop.longitude,
          title: shop.fullName,
          description: shop.description || "No description available",
          img: shop.profilePic || "https://via.placeholder.com/100",
        }))
      );
    } catch (error) {
      console.error("Error fetching shops: ", error.message);
    }
  };

  useEffect(() => {
    if (mapInstanceRef.current) return;
  
    const map = new maplibregl.Map({
      container: mapRef.current,
      style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      center: [83.2111287, 17.8177412],
      zoom: 13,
    });
  
    mapInstanceRef.current = map;
  
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
  
        // Add current location marker with a zoom-in transition
        const currentLocationMarker = new maplibregl.Marker({ color: "red" })
          .setLngLat([userLng, userLat])
          .setPopup(new maplibregl.Popup().setText("Your Location"))
          .addTo(map);
  
        map.once('load', () => {
          map.flyTo({
            center: [userLng, userLat],
            zoom: 14,
            speed: 1.5, // Adjust speed as necessary
            curve: 1, // Smooth curve
            essential: true // Ensure animation is always present
          });
        });
  
        drawRadiusCircle(map, [userLng, userLat], radius);
        fetchShops(userLat, userLng);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  
    map.addControl(new maplibregl.NavigationControl(), "bottom-right");
    map.addControl(new maplibregl.FullscreenControl(), "bottom-right");
    map.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
        container: document.getElementById('geolocate-control-container') // Adjusting container position
      }),
      'bottom-right' // Position control to avoid overlapping
    );
    
  
    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);
  

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        drawRadiusCircle(mapInstanceRef.current, [userLng, userLat], radius);
        fetchShops(userLat, userLng);
      });
    }
  }, [radius]);

  useEffect(() => {
    if (!mapInstanceRef.current || locations.length === 0) return;
  
    const map = mapInstanceRef.current;
  
    locations.forEach((location) => {
      const marker = new maplibregl.Marker({ color: "blue" })
        .setLngLat([location.lng, location.lat])
        .setPopup(
          new maplibregl.Popup().setHTML(`
            <div class="px-3 z-50 text-black items-center flex flex-col">
              <img class="object-cover" src="${location.img}" alt="Shop Image" style="width: 500px; height: 200px; border-radius: 8px; margin-bottom: 8px;" />
              <h3 class="font-bold text-2xl w-full">${location.title}</h3>
              <p class="w-full">${location.description}</p>
              <a href="/chat?id=${location.id}" class="bg-blue-500 px-5 py-2 my-3 font-bold text-white">Order Shop</a>
            </div>
          `)
        )
        .addTo(map);
  
      marker.getElement().addEventListener('click', () => {
        map.flyTo({
          center: [location.lng, location.lat],
          zoom: 14,
          speed: 1.5,
          curve: 1,
          essential: true
        });
      });
    });
  }, [locations]);
  

  return (
    <div className="w-full h-full relative">
      <div
        id="map geolocate-control-container"
        ref={mapRef}
        className="w-full h-full rounded-lg shadow-lg"
      ></div>
      <div
        className="absolute top-2 left-2 z-10 bg-white pl-2  rounded-lg shadow-md flex  sm:flex-row justify-center items-center gap-4"
        style={{ maxWidth: "400px" }}
      >
        <label className="text-sm font-medium whitespace-nowrap text-gray-700">
          Search Radius:
        </label>
        <input
          type="number"
          value={radius}
          onChange={(e) => setRadius(parseInt(e.target.value, 10))}
          placeholder="Enter radius"
          className="w-fit p-2 bg-white text-black border rounded-lg shadow focus:outline-none "
        />
      </div>
    </div>
  );
};

export default MapComponent;
