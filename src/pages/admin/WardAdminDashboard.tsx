import React, { useState, useEffect } from 'react';
import { useWasteContext } from '../../data/WasteContext';
import { MapContainer, TileLayer, Marker, Popup, Circle, Tooltip, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, AlertTriangle, Flame, Filter, Loader2, Info } from 'lucide-react';

const truckIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  className: 'hue-rotate-180'
});

const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

const RecenterMap = ({ position }: { position: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [position, map]);
  return null;
};

const WardAdminDashboard = () => {
  const { reports, trucks, zones, wardHealthScore, updateReportStatus } = useWasteContext();
  const [activeTab, setActiveTab] = useState<'map' | 'heatmap'>('map');
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [selectedTruck, setSelectedTruck] = useState<string | null>('T1');
  
  const [centerPosition, setCenterPosition] = useState<[number, number]>([23.2191, 72.6418]);
  const [isLocating, setIsLocating] = useState(true);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (Math.hypot(pos.coords.latitude - 23.2191, pos.coords.longitude - 72.6418) < 0.08) setCenterPosition([pos.coords.latitude, pos.coords.longitude]);
          setIsLocating(false);
        },
        () => { setIsLocating(false); },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setIsLocating(false);
    }
  }, []);

  const openReports = reports.filter(r => r.status !== 'Resolved').sort((a, b) => b.priorityScore - a.priorityScore);

  const activeZone = zones.find(z => z.id === selectedZone);
  const activeTruck = trucks.find(t => t.id === selectedTruck);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Operations Center</h1>
          <p className="text-slate-500">Live Zone Overview</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{openReports.length}</div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Active Issues</div>
          </div>
          <div className="w-px bg-slate-200"></div>
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-600">{trucks.length}</div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Active Trucks</div>
          </div>
          <div className="w-px bg-slate-200"></div>
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-600">{wardHealthScore}</div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Ward Health</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Map & Heatmap */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[600px]">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                {activeTab === 'map' ? <MapPin size={20} className="text-primary"/> : <Flame size={20} className="text-red-500"/>}
                {activeTab === 'map' ? 'Live Vehicle & Issue Map' : '24-48h Predictive Hotspot Heatmap'}
                {isLocating && <Loader2 size={16} className="animate-spin text-slate-400" />}
              </h2>
              <div className="flex bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm p-1">
                <button 
                  onClick={() => setActiveTab('map')}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeTab === 'map' ? 'bg-slate-100 text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Live Tracking
                </button>
                <button 
                  onClick={() => setActiveTab('heatmap')}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeTab === 'heatmap' ? 'bg-red-50 text-red-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Risk Heatmap
                </button>
              </div>
            </div>
            
            <div className="flex-1 relative z-0">
              <MapContainer center={centerPosition} zoom={14} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                
                <RecenterMap position={centerPosition} />

                {activeTab === 'map' && (
                  <>
                    {openReports.map(report => (
                      <Marker key={report.id} position={report.location} icon={defaultIcon}>
                        <Popup>
                          <div className="font-semibold">{report.category}</div>
                          <div className="text-xs text-slate-500">{report.id} - Priority: {report.priority}</div>
                        </Popup>
                      </Marker>
                    ))}
                    {trucks.map(truck => (
                      (
                        <React.Fragment key={truck.id}>
                          <Polyline 
                            positions={[truck.currentLocation, ...truck.optimizedRoute.filter(s => !s.completed).map(s => s.location)]} 
                            color="#3b82f6" 
                            weight={3} 
                            dashArray="5, 10" 
                          />
                          <Marker position={truck.currentLocation} icon={truckIcon} eventHandlers={{ click: () => setSelectedTruck(truck.id) }}>
                            <Popup>
                              <div className="font-bold text-sm">Vehicle {truck.vehicleNumber}</div>
                              <div className="text-xs text-slate-500">{truck.driver} · {truck.status} · {truck.speedKmph} km/h · {truck.routeProgress}% complete</div>
                            </Popup>
                          </Marker>
                        </React.Fragment>
                      )
                    ))}
                  </>
                )}

                {activeTab === 'heatmap' && zones.map((zone) => {
                  const color = zone.riskLevel === 'High' ? '#ef4444' : zone.riskLevel === 'Medium' ? '#f59e0b' : '#22c55e';
                  return (
                    <Circle 
                      key={zone.id}
                      center={zone.center} 
                      radius={zone.radius}
                      pathOptions={{ color: 'transparent', fillColor: color, fillOpacity: 0.5 }}
                      eventHandlers={{ click: () => setSelectedZone(zone.id) }}
                    >
                      <Tooltip sticky>Predicted {zone.riskLevel} Risk Area (Next 24h)</Tooltip>
                    </Circle>
                  );
                })}
              </MapContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Panel based on Tab */}
        <div className="space-y-6">
          {activeTab === 'map' ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 h-[600px] flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                  <AlertTriangle size={20} className="text-amber-500" />
                  Smart Priority Queue
                </h2>
                <button className="text-slate-400 hover:text-primary transition-colors">
                  <Filter size={18} />
                </button>
              </div>

              <div className="overflow-y-auto pr-2 space-y-3 flex-1 custom-scrollbar">
                {openReports.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 font-medium">No active issues.</div>
                ) : (
                  openReports.map(report => (
                    <div key={report.id} className="border border-slate-100 rounded-xl p-4 hover:shadow-md transition-shadow group">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-slate-800 text-sm">{report.category}</h3>
                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${
                          report.priority === 'High' ? 'bg-red-50 text-red-600' : 
                          report.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {report.priority} Priority
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-3">{report.id} • {new Date(report.date).toLocaleDateString()}</p>
                      
                      <div className="flex gap-2">
                        <select 
                          value={report.status}
                          onChange={(e) => updateReportStatus(report.id, e.target.value as any)}
                          className="text-xs bg-slate-50 border border-slate-200 rounded p-1.5 flex-1 font-medium text-slate-700 outline-none focus:border-primary"
                        >
                          <option value="Reported">Reported</option>
                          <option value="Acknowledged">Acknowledged</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                        <button className="text-xs font-semibold bg-primary text-white px-3 py-1.5 rounded hover:bg-blue-800 transition-colors">
                          Assign
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {activeTruck && <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="font-bold text-slate-800 text-sm">{activeTruck.vehicleNumber} · {activeTruck.driver}</p>
                <p className="text-xs text-slate-500 mt-1">{activeTruck.status} · {activeTruck.speedKmph} km/h · route progress {activeTruck.routeProgress}%</p>
                <p className="text-xs text-slate-600 mt-2">Active route: {activeTruck.optimizedRoute.map(stop => stop.label).join(' → ')}</p>
                {activeTruck.routeHistory.length > 1 && <p className="text-xs text-blue-700 mt-2 font-semibold">Route history retained: {activeTruck.routeHistory.length} snapshots</p>}
              </div>}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 h-[600px] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                  <Flame size={20} className="text-red-500" />
                  Prediction Details
                </h2>
              </div>
              
              {!activeZone ? (
                <div className="text-center py-20 text-slate-400 font-medium px-4">
                  <Info size={40} className="mx-auto mb-3 opacity-50" />
                  Select a zone on the heatmap to view AI prediction factors.
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in zoom-in-95">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-1">{activeZone.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        activeZone.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
                        activeZone.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {activeZone.riskLevel} Risk
                      </span>
                      <span className="text-xs text-slate-500">Next 24-48 Hours</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-slate-700">Risk Score</span>
                      <span className="text-lg font-bold text-slate-900">{activeZone.currentRiskScore}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          activeZone.riskLevel === 'High' ? 'bg-red-500' :
                          activeZone.riskLevel === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} 
                        style={{ width: `${activeZone.currentRiskScore}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm mb-3">Why does this zone have a {activeZone.riskLevel.toLowerCase()} predicted risk?</h4>
                    <ul className="space-y-2">
                      {activeZone.factors.map((factor, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                          <span className="text-primary mt-0.5">•</span> {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WardAdminDashboard;
