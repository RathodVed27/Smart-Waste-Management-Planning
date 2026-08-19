import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, AlertTriangle, CheckCircle, ArrowRight, Clock3, Gauge, ThumbsUp } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { useWasteContext, routeDistanceKm } from '../../data/WasteContext';
import { RoadPolyline, useRoadRoute } from '../../components/RoadRoute';

const formatKm = (dist: number) => dist.toFixed(2);

const DriverHome = () => {
  const navigate = useNavigate();
  const { trucks, reports } = useWasteContext();
  const [showComparison, setShowComparison] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<'route' | 'reports'>('route');

  // Bind to Truck 1 for Driver View
  const truck = trucks.find(t => t.id === 'T1');
  const roadPoints = truck ? [truck.currentLocation, ...truck.optimizedRoute.filter(stop => !stop.completed).map(stop => stop.location)] : [];
  const roadRoute = useRoadRoute(roadPoints);

  if (!truck) return <div className="p-8 text-center">Truck not found</div>;

  const originalRoute = truck.originalRoute;
  const optimizedRoute = truck.optimizedRoute;

  // Calculate mock distances
  const origDist = routeDistanceKm(originalRoute);
  const optDist = routeDistanceKm(optimizedRoute);
  const diffDist = optDist - origDist;

  // Find added stops
  const originalIds = new Set(originalRoute.map(s => s.id));
  const newStops = optimizedRoute.filter(s => !originalIds.has(s.id));

  // Determine current active stop
  const activeStopIndex = optimizedRoute.findIndex(s => !s.completed);
  const truckArrow = L.divIcon({ className: 'truck-navigation-arrow', html: '<div>▲</div>', iconSize: [34, 34], iconAnchor: [17, 17] });

  return (
    <div className="max-w-7xl mx-auto bg-slate-50 min-h-[calc(100vh-64px)] pb-24 relative md:bg-transparent md:my-8 md:pb-0">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Info & Comparison */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-emerald-600 text-white p-6 md:p-8 md:rounded-3xl shadow-md rounded-b-3xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Vehicle {truck.vehicleNumber}</h1>
                <p className="text-emerald-100 text-sm mt-1">Central Delhi • {truck.speedKmph} km/h • Route Opt-A7</p>
              </div>
              <div className="bg-emerald-500/50 px-3 py-1 rounded-full text-xs font-bold border border-emerald-400">
                {truck.status}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-sm bg-black/10 rounded-2xl p-4">
              <div>
                <span className="block font-bold text-xl">{optimizedRoute.length}</span>
                <span className="text-emerald-100 text-xs">Total Stops</span>
              </div>
              <div>
                <span className="block font-bold text-xl">{optimizedRoute.filter(s => s.completed).length}</span>
                <span className="text-emerald-100 text-xs">Completed</span>
              </div>
              <div>
                <span className="block font-bold text-xl">{formatKm(optDist)}km</span>
                <span className="text-emerald-100 text-xs">Est. Dist</span>
              </div>
            </div>
          </div>

          {/* Map showing route */}
          <div className="mx-4 md:mx-0 bg-white rounded-3xl shadow-md border border-slate-100 overflow-hidden h-[560px] flex flex-col">
            <div className="bg-slate-50 border-b border-slate-100 px-4 py-2 flex justify-between items-center">
              <span className="font-bold text-slate-700 text-sm flex items-center gap-2">
                <MapPin size={16} className="text-emerald-500" /> Live Route Map
              </span>
            </div>
            <div className="flex-1 relative z-0">
              <MapContainer center={truck.currentLocation} zoom={15} style={{ height: '100%', width: '100%', zIndex: 0 }} scrollWheelZoom>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

                {/* Draw Route Line */}
                <RoadPolyline points={roadPoints} />
                <Polyline positions={optimizedRoute.filter(s => s.completed).map(s => s.location)} color="#94a3b8" weight={4} />

                {/* Draw Stops */}
                {optimizedRoute.map((stop, i) => (
                  <Marker
                    key={stop.id}
                    position={stop.location}
                    icon={new L.Icon({
                      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                      iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34]
                    })}
                  >
                    <Popup>{i + 1}. {stop.label}</Popup>
                  </Marker>
                ))}
                {/* Current Truck Location */}
                <Marker
                  position={truck.currentLocation}
                  icon={truckArrow}
                >
                  <Popup>Current location · {truck.speedKmph} km/h</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
          <div className="mx-4 md:mx-0 bg-white rounded-2xl border border-blue-100 p-4 shadow-sm">
            <div className="flex items-center justify-between"><span className="font-bold text-slate-800">Navigation to {optimizedRoute[activeStopIndex]?.label || 'Depot'}</span><span className="text-blue-700 font-bold text-sm">{roadRoute ? `${roadRoute.distanceKm.toFixed(1)} km` : `${formatKm(optDist)} km`}</span></div>
            <div className="flex gap-5 mt-3 text-sm text-slate-600"><span className="flex items-center gap-1"><Clock3 size={15} /> {roadRoute?.durationMinutes || Math.max(1, Math.round(optDist / truck.speedKmph * 60))} min ETA</span><span className="flex items-center gap-1"><Gauge size={15} /> {truck.speedKmph} km/h</span></div>
            {roadRoute?.instructions.slice(0, 2).map((instruction, index) => <p key={index} className="text-xs text-slate-500 mt-2">{index + 1}. {instruction}</p>)}
          </div>

          {/* Route Comparison Panel */}
          {newStops.length > 0 && (
            <div className="mx-4 md:mx-0 bg-white border border-blue-200 shadow-lg shadow-blue-900/5 rounded-3xl overflow-hidden">
              <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex justify-between items-center cursor-pointer" onClick={() => setShowComparison(!showComparison)}>
                <h3 className="font-bold text-blue-900 flex items-center gap-2">
                  <Navigation size={18} />
                  Route Updated dynamically
                </h3>
                <span className="text-xs font-bold bg-blue-200 text-blue-800 px-2 py-1 rounded-md">New Report</span>
              </div>

              {showComparison && (
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Original Route</span>
                    <span className="font-bold text-slate-700">{formatKm(origDist)} km</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">New Optimized Route</span>
                    <span className="font-bold text-blue-700">{formatKm(optDist)} km</span>
                  </div>

                  <div className="h-px bg-slate-100 my-2"></div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Difference</span>
                    <span className={`font-bold ${diffDist > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                      {diffDist > 0 ? '+' : ''}{formatKm(diffDist)} km
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-slate-500 font-medium">Est. Fuel Impact</span>
                    <span className={`font-bold ${diffDist > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                      {diffDist > 0 ? '+' : ''}{(diffDist * 0.15).toFixed(2)} Liters
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-slate-500 font-medium">Stops (original → updated)</span>
                    <span className="font-bold text-slate-700">{originalRoute.length} → {optimizedRoute.length}</span>
                  </div>

                  <div className="mt-4 bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs text-slate-600">
                    <span className="block font-bold text-slate-800 mb-1">Newly Added Points:</span>
                    {newStops.map(s => (
                      <div key={s.id} className="flex gap-2 items-center mt-1">
                        <MapPin size={12} className="text-blue-500" />
                        {s.label} ({s.id})
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Route Queue & User Reports */}
        <div className="lg:col-span-2 px-4 md:px-0">
          <div className="bg-white md:rounded-3xl md:border md:border-slate-100 md:shadow-sm md:p-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 border-b border-slate-100 pb-4">
              <div className="flex gap-6">
                <button
                  onClick={() => setActiveSubTab('route')}
                  type="button"
                  className={`text-lg md:text-xl font-bold pb-2 border-b-2 transition-all relative ${activeSubTab === 'route'
                      ? 'text-emerald-600 border-emerald-500'
                      : 'text-slate-400 border-transparent hover:text-slate-600'
                    }`}
                >
                  Current Route
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${activeSubTab === 'route' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                    {optimizedRoute.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveSubTab('reports')}
                  type="button"
                  className={`text-lg md:text-xl font-bold pb-2 border-b-2 transition-all relative ${activeSubTab === 'reports'
                      ? 'text-emerald-600 border-emerald-500'
                      : 'text-slate-400 border-transparent hover:text-slate-600'
                    }`}
                >
                  Citizen Reports
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${activeSubTab === 'reports' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                    {reports.filter(r => r.assignedTruckId === truck.id).length}
                  </span>
                </button>
              </div>
              <span className="text-xs md:text-sm text-emerald-600 font-semibold bg-emerald-50 px-3 py-1 rounded-full w-fit self-start sm:self-auto">
                Vehicle Active · {truck.status}
              </span>
            </div>

            {activeSubTab === 'route' ? (
              <>
                <div className="space-y-3">
                  {optimizedRoute.map((stop, index) => {
                    const isNext = index === activeStopIndex;
                    const isNew = newStops.some(n => n.id === stop.id);

                    return (
                      <div
                        key={stop.id}
                        onClick={() => isNext && stop.type === 'Report' && navigate(`/driver/stop/${stop.id}`)}
                        className={`bg-white p-4 md:p-5 rounded-2xl shadow-sm border-l-4 transition-all ${isNext ? 'border-emerald-500 cursor-pointer hover:shadow-md ring-2 ring-emerald-500/20' :
                            stop.completed ? 'border-slate-200 opacity-60 bg-slate-50' : 'border-amber-400 border border-slate-100'
                          }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm ${stop.completed ? 'bg-slate-400' : isNew ? 'bg-blue-500' : 'bg-slate-800'
                              }`}>
                              {index + 1}
                            </div>
                            <h3 className={`font-bold text-lg ${stop.completed ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                              {stop.label}
                            </h3>
                            {isNew && !stop.completed && <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">NEW</span>}
                          </div>
                          {stop.completed && <CheckCircle size={24} className="text-emerald-500" />}
                        </div>

                        <div className="flex justify-between items-center ml-11 text-sm">
                          <div className="space-y-1">
                            <span className="text-slate-500 block text-xs">{stop.id} - Type: {stop.type}</span>
                          </div>

                          {isNext && stop.type === 'Report' && (
                            <button className="text-emerald-650 text-emerald-600 font-bold flex items-center gap-1 hover:underline bg-emerald-50 px-3 py-1.5 rounded-lg">
                              Clear <Navigation size={14} />
                            </button>
                          )}
                          {isNext && stop.type !== 'Report' && (
                            <span className="text-amber-600 font-bold text-xs bg-amber-50 px-3 py-1.5 rounded-lg flex items-center gap-1">
                              Moving <ArrowRight size={14} className="animate-pulse" />
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Render the Old Route optionally for visual comparison if new stops exist */}
                {newStops.length > 0 && (
                  <div className="mt-12">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-px bg-slate-200 flex-1"></div>
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Original Route</h3>
                      <div className="h-px bg-slate-200 flex-1"></div>
                    </div>

                    <div className="opacity-50 grayscale space-y-2">
                      {originalRoute.map((stop, index) => (
                        <div key={`orig-${stop.id}-${index}`} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-500 flex items-center justify-center text-xs font-bold">{index + 1}</div>
                          <span className="font-semibold text-slate-600">{stop.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4">
                {reports.filter(r => r.assignedTruckId === truck.id).length === 0 ? (
                  <div className="text-center py-10 text-slate-400 font-medium">No citizen reports assigned to this vehicle.</div>
                ) : (
                  reports
                    .filter(r => r.assignedTruckId === truck.id)
                    .sort((a, b) => {
                      if (a.status === 'Resolved' && b.status !== 'Resolved') return 1;
                      if (a.status !== 'Resolved' && b.status === 'Resolved') return -1;
                      return b.priorityScore - a.priorityScore;
                    })
                    .map((report) => (
                      <div
                        key={report.id}
                        className={`bg-white p-5 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md ${report.status === 'Resolved' ? 'opacity-75 bg-slate-50' : 'border-l-4 border-l-emerald-500'
                          }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{report.id}</span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${report.priority === 'High' ? 'bg-red-50 text-red-650 text-red-600' :
                                  report.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                                }`}>
                                {report.priority} Priority
                              </span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mt-1">{report.category}</h3>
                          </div>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${report.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              report.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                report.status === 'Acknowledged' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                  'bg-slate-50 text-slate-700 border-slate-200'
                            }`}>
                            {report.status}
                          </span>
                        </div>

                        {report.description && (
                          <p className="text-slate-600 text-sm mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                            "{report.description}"
                          </p>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500 mb-4">
                          <div className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-slate-400" />
                            <span>{report.ward} · {report.location[0].toFixed(4)}, {report.location[1].toFixed(4)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock3 size={14} className="text-slate-400" />
                            <span>{new Date(report.date).toLocaleDateString()} {new Date(report.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-50 flex justify-between items-center text-sm">
                          <div className="flex items-center gap-1 text-slate-500">
                            <ThumbsUp size={15} />
                            <span>{report.confirmations} confirmations</span>
                          </div>
                          {report.status !== 'Resolved' ? (
                            <button
                              onClick={() => navigate(`/driver/stop/${report.id}`)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                            >
                              Clear Issue <Navigation size={14} />
                            </button>
                          ) : (
                            <span className="text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg flex items-center gap-1 text-xs">
                              Resolved <CheckCircle size={14} />
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate('/driver/issue')}
        className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 bg-red-50 text-red-600 border border-red-200 p-4 rounded-full shadow-lg hover:bg-red-100 transition-colors flex items-center gap-2 z-50 group"
      >
        <AlertTriangle size={24} />
        <span className="hidden md:inline font-bold pr-2 group-hover:block">Report Issue</span>
      </button>
    </div>
  );
};

export default DriverHome;
