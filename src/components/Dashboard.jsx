import React, { useEffect, useState, useRef } from 'react';
import NavBar from './NavBar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const patient = {
  name: "Saksham Patil",
  photo: "https://media.cnn.com/api/v1/images/stellar/prod/gettyimages-1481568169-20250514205647120.jpg?c=16x9&q=h_833,w_1480,c_fill",
  lastUpdated: "Just now",
  address: "123 Maple Street, Portland, OR 97205",
  locationStatus: "At Home",
  safeZone: true,
  lastLocationUpdate: "09:15 PM",
};





const Dashboard = () => {
  const [fallEvents, setFallEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [pulseData, setPulseData] = useState([]);
  const [markedFalls, setMarkedFalls] = useState([]);
  const pulseInterval = useRef(null);
  const [mapInstance, setMapInstance] = useState(null); // State to hold the map instance

  // Fetch fall events, update live
  useEffect(() => {
    const fetchFalls = () => {
      fetch("/api/fall-events")
        .then((res) => res.json())
        .then((data) => {
          setFallEvents(data.fall_events || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };
    fetchFalls();
    const interval = setInterval(fetchFalls, 3000);
    return () => clearInterval(interval);
  }, []);

  // Fetch pulse data, update live
  useEffect(() => {
    const fetchPulse = () => {
      fetch("/api/pulse-data")
        .then((res) => res.json())
        .then((data) => {
          setPulseData(data.pulse_data || []);
        });
    };
    fetchPulse();
    pulseInterval.current = setInterval(fetchPulse, 3000);
    return () => clearInterval(pulseInterval.current);
  }, []);

  // Custom marker icon for leaflet (to avoid missing icon issue)
  const markerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    shadowSize: [41, 41]
  });

  // Number of notifications to show by default
  const DEFAULT_COUNT = 3;
  // Filter out marked as read falls
  const visibleEvents = (showAll ? fallEvents : fallEvents.slice(0, DEFAULT_COUNT)).filter(
    (e) => !markedFalls.includes(e._id)
  );

  // Mark as read handler
  const handleMarkAsRead = (id) => {
    setMarkedFalls((prev) => [...prev, id]);
  };

  // Prepare pulse data for graph (last 20 points, most recent last)
  const pulseGraphData = pulseData.slice(0, 20).reverse();

  // For pulse range 50-250
  const minPulse = 50;
  const maxPulse = 250;
  const yLabels = [50, 75, 100, 125, 150, 175, 200];

  // Latest pulse value for status
  const latestPulse = pulseGraphData.length > 0 ? pulseGraphData[pulseGraphData.length - 1].pulse : null;
  let pulseStatus = "";
  if (latestPulse !== null) {
    if (latestPulse < 60) pulseStatus = "BPM low";
    else if (latestPulse < 100) pulseStatus = "BPM normal";
    else if (latestPulse < 150) pulseStatus = "BPM high";
    else pulseStatus = "BPM too high";
  }

  const firstFallEventWithLocation = fallEvents.find(event => event.location?.lat != null && event.location?.lon != null);

  // Effect to invalidate map size when map instance is ready or view changes
  useEffect(() => {
    if (mapInstance) {
      // Delay slightly to ensure the container has its final dimensions
      const timer = setTimeout(() => {
        mapInstance.invalidateSize();
      }, 150); // Adjust delay if necessary
      return () => clearTimeout(timer);
    }
  }, [mapInstance, firstFallEventWithLocation]); // Re-run if map instance or key data changes

  return (
    <>
      <NavBar />
      <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Pulse Graph Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Changed sm:items-center to sm:items-start for consistent top alignment */}
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Patient Profile Info */}
              {/* Added sm:ml-4 to move profile slightly right on sm screens and up */}
              <div className="flex-shrink-0 flex flex-col items-center sm:items-start sm:ml-4">
                <img
                  src={patient.photo}
                  alt={patient.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-gray-200 shadow-md"
                />
                <h3 className="mt-3 text-lg font-semibold text-gray-700 text-center sm:text-left">{patient.name}</h3>
                <p className="text-xs text-gray-500">Last update: {patient.lastUpdated}</p>
              </div>

              {/* BPM Graph Container */}
                      {/* This div aligns its children (title and graph-wrapper) to start on sm screens */}
                      <div className="flex-1 w-full flex flex-col items-center sm:items-start">
                      {/* Title: always centered */}
                      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 text-center w-full">BPM Graph</h2>
                      {/* Graph wrapper: This div should always center its content (the SVG/message) */}
                      <div 
                        style={{ background: "#fff", borderRadius: "0.5rem", padding: "1rem", width: "100%" }}
                        className="flex flex-col items-center" // Ensures content (SVG/message) is always centered
                      >
                        {pulseGraphData.length === 0 ? (
                        // Text alignment for "No data" message
                        <div className="text-gray-500 text-center">No pulse data available.</div>
                        ) : (
                        <div style={{ position: "relative", width: "100%", maxWidth: 420 }}>
                          <svg width="100%" height="120" viewBox="0 0 400 120">
                          {/* Y axis grid and labels */}
                        {yLabels.map((label) => {
                          const y = 110 - ((label - minPulse) / (maxPulse - minPulse)) * 90;
                          return (
                            <g key={label}>
                              <line x1="40" x2="390" y1={y} y2={y} stroke="#eee" strokeWidth="1" />
                              <text x="5" y={y + 4} fontSize="11" fill="#888">{label}</text>
                            </g>
                          );
                        })}
                        {/* X/Y axis */}
                        <polyline
                          fill="none"
                          stroke="#ccc" // Lighter axis color
                          strokeWidth="1"
                          points={`40,110 390,110`}
                        />
                        {/* Pulse line */}
                        <polyline
                          fill="none"
                          stroke="#e53e3e" // Red-500
                          strokeWidth="2"
                          points={
                            pulseGraphData
                              .map((d, i) => {
                                const x = ((i / (pulseGraphData.length - 1 || 1)) * 340) + 40;
                                const y = 110 - ((d.pulse - minPulse) / (maxPulse - minPulse)) * 90;
                                return `${x},${y}`;
                              })
                              .join(" ")
                          }
                        />
                        {/* Dots */}
                        {pulseGraphData.map((d, i) => {
                          const x = ((i / (pulseGraphData.length - 1 || 1)) * 340) + 40;
                          const y = 110 - ((d.pulse - minPulse) / (maxPulse - minPulse)) * 90;
                          return (
                            <circle key={i} cx={x} cy={y} r="3" fill="#e53e3e" />
                          );
                        })}
                      </svg>
                      {/* Pulse status below graph, right aligned */}
                      {latestPulse !== null && (
                        <div className="text-right text-sm font-medium text-red-600 mt-2 pr-2"> {/* Adjusted styling */}
                          {pulseStatus} ({latestPulse} BPM)
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main content grid: Notifications and Map */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Fall notifications list - takes 1/3 width on large screens */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">Fall Notifications</h2>
              {loading ? (
                <div className="text-gray-500">Loading fall events...</div>
              ) : visibleEvents.length === 0 ? (
                <div className="bg-green-50 text-green-700 px-4 py-3 rounded-md text-sm">No new falls detected.</div>
              ) : (
                <>
                  <ul className="space-y-4">
                    {visibleEvents.map((e) => (
                      <li key={e._id} className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                        <span className="material-icons text-red-600 text-2xl hidden sm:block">warning</span>
                        <div className="flex-1">
                          <div className="flex items-center">
                            <span className="material-icons text-red-600 text-xl sm:hidden mr-2">warning</span>
                            <span className="font-semibold text-red-700">Fall detected!</span>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            <span className="font-medium">Time:</span> {e.timestamp}
                          </div>
                          <div className="text-xs text-gray-600">
                            <span className="font-medium">Location:</span> Lat: {e.location?.lat}, Lon: {e.location?.lon}
                          </div>
                          {e.features && e.features.length > 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                              Features: {e.features.join(", ")}
                            </div>
                          )}
                        </div>
                        <button
                          className="ml-auto mt-2 sm:mt-0 px-3 py-1.5 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-md text-xs font-medium focus:outline-none focus:ring-2 focus:ring-gray-400"
                          onClick={() => handleMarkAsRead(e._id)}
                        >
                          Mark as Read
                        </button>
                      </li>
                    ))}
                  </ul>
                  {fallEvents.length > DEFAULT_COUNT && !loading && (
                    <button
                      className="mt-6 w-full text-sm text-indigo-600 hover:text-indigo-800 font-medium py-2 px-4 rounded-md border border-indigo-600 hover:bg-indigo-50 transition-colors"
                      onClick={() => setShowAll((prev) => !prev)}
                    >
                      {showAll ? "Show Less" : `Show All (${fallEvents.length - markedFalls.filter(id => fallEvents.find(fe => fe._id === id)).length} unread)`}
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Map showing fall locations - takes 2/3 width on large screens */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">Fall Locations Map</h2>
              {/* Adjusted height classes for stability */}
              <div className="h-96 md:h-[28rem] lg:h-[30rem] w-full rounded-lg overflow-hidden border border-gray-200"> {/* h-96 (384px), md:h-[28rem] (448px), lg:h-[30rem] (480px) */}
                <MapContainer
                  whenCreated={setMapInstance} // Get map instance
                  center={
                    firstFallEventWithLocation
                      ? [firstFallEventWithLocation.location.lat, firstFallEventWithLocation.location.lon]
                      : [20.9042, 74.7740] // Default center set to Dhule
                  }
                  zoom={
                    firstFallEventWithLocation
                      ? 15 // Zoom in for a specific event
                      : 12 // Default zoom level, slightly more zoomed out
                  }
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {fallEvents.map((e) =>
                    e.location?.lat && e.location?.lon ? (
                      <Marker
                        key={e._id}
                        position={[e.location.lat, e.location.lon]}
                        icon={markerIcon}
                      >
                        <Popup>
                          <div className="text-sm">
                            <div className="font-semibold">Fall Event</div>
                            <div><strong>Time:</strong> {e.timestamp}</div>
                            <div><strong>Lat:</strong> {e.location.lat.toFixed(4)}</div>
                            <div><strong>Lon:</strong> {e.location.lon.toFixed(4)}</div>
                            {e.features && e.features.length > 0 && (
                              <div><strong>Features:</strong> {e.features.join(", ")}</div>
                            )}
                          </div>
                        </Popup>
                      </Marker>
                    ) : null
                  )}
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
