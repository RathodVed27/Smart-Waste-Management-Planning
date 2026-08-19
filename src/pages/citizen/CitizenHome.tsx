import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Clock, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { useWasteContext } from '../../data/WasteContext';

const CitizenHome = () => {
  const navigate = useNavigate();
  const { reports, trucks } = useWasteContext();
  const [citizenLocation, setCitizenLocation] = useState<[number, number]>([23.2186, 72.6429]);
  useEffect(() => { navigator.geolocation?.getCurrentPosition(position => { const { latitude, longitude } = position.coords; if (Math.hypot(latitude - 23.2191, longitude - 72.6418) < .08) setCitizenLocation([latitude, longitude]); }); }, []);
  const nearbyTrucks = [...trucks].sort((a, b) => Math.hypot(a.currentLocation[0] - citizenLocation[0], a.currentLocation[1] - citizenLocation[1]) - Math.hypot(b.currentLocation[0] - citizenLocation[0], b.currentLocation[1] - citizenLocation[1])).slice(0, 2);

  const recentReports = reports.slice(0, 4); // show more on desktop

  return (
    <div className="max-w-7xl mx-auto pb-20">
      {/* Header Profile Area */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm mb-6 border border-slate-100 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Hello, Citizen!</h1>
          <p className="text-slate-500 text-sm md:text-base mt-1">Ward 21 - Gandhinagar</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-8">
          {/* Primary Call to Action */}
          <button 
            onClick={() => navigate('/citizen/report')}
            className="w-full bg-primary text-white p-8 rounded-3xl shadow-lg shadow-blue-900/20 flex flex-col items-center justify-center gap-4 hover:bg-blue-800 transition-colors active:scale-95"
          >
            <div className="bg-white/20 p-5 rounded-full">
              <Camera size={40} />
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold block mb-1">Report Waste</span>
              <span className="text-blue-100">Takes under 30 seconds</span>
            </div>
          </button>

          {/* Live Nearby Trucks Map */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[300px]">
            <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Navigation size={16} className="text-blue-500" />
                Live Collection Trucks
              </h3>
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <div className="flex-1 relative z-0">
              <MapContainer center={[23.2191, 72.6418]} zoom={14} style={{ height: '100%', width: '100%', zIndex: 0 }} scrollWheelZoom={false}>
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                {nearbyTrucks.map(truck => (
                  (
                    <React.Fragment key={truck.id}>
                      <Polyline 
                        positions={[truck.currentLocation, ...truck.optimizedRoute.filter(s => !s.completed).map(s => s.location)]} 
                        color="#3b82f6" 
                        weight={3} 
                        dashArray="5, 10" 
                      />
                      <Marker 
                        position={truck.currentLocation} 
                        icon={new L.Icon({
                          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                          iconSize: [20, 32], iconAnchor: [10, 32], popupAnchor: [1, -24],
                          className: 'hue-rotate-180'
                        })}
                      >
                        <Popup>
                          <div className="font-bold text-xs mb-1">Vehicle {truck.vehicleNumber}</div>
                          <div className="text-[10px] text-slate-500">Status: {truck.status}</div>
                          <div className="text-[10px] text-slate-500">Speed: {truck.speedKmph} km/h</div>
                          <div className="text-[10px] text-slate-500">Live: {truck.currentLocation[0].toFixed(4)}, {truck.currentLocation[1].toFixed(4)}</div>
                        </Popup>
                      </Marker>
                    </React.Fragment>
                  )
                ))}
              </MapContainer>
            </div>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800">My Reports</h2>
            <button 
              onClick={() => navigate('/citizen/reports')}
              className="text-primary font-semibold hover:underline"
            >
              View All Pipeline &rarr;
            </button>
          </div>

          {recentReports.length === 0 ? (
            <div className="text-center py-12 text-slate-400 font-medium">You haven't reported anything yet.</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {recentReports.map(report => (
                <div key={report.id} onClick={() => navigate(`/citizen/report/${report.id}`)} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md hover:border-primary/20 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${report.status === 'Resolved' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                      <Clock size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">{report.category}</h3>
                      <p className="text-sm text-slate-500">{new Date(report.date).toLocaleDateString()} • {report.id}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                    report.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 
                    report.status === 'In Progress' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {report.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CitizenHome;
