import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Check, Truck, UserCircle, MapPin, Camera } from 'lucide-react';
import { useWasteContext } from '../../data/WasteContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { RoadPolyline, useRoadRoute } from '../../components/RoadRoute';

const ReportStatus = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { reports, trucks, confirmReport } = useWasteContext();

  const report = reports.find(r => r.id === id);
  const assignedTruck = trucks.find(t => t.id === report?.assignedTruckId);
  const trackingPoints = assignedTruck ? [assignedTruck.currentLocation, ...assignedTruck.optimizedRoute.filter(stop => !stop.completed).map(stop => stop.location)] : [];
  const roadRoute = useRoadRoute(trackingPoints);

  if (!report) {
    return (
      <div className="max-w-md mx-auto bg-slate-50 min-h-[calc(100vh-64px)] p-8 text-center">
        <h2 className="text-xl font-bold text-slate-800">Report Not Found</h2>
        <button onClick={() => navigate(-1)} className="mt-4 text-primary hover:underline">Go Back</button>
      </div>
    );
  }

  const steps = [
    { title: 'Reported', time: new Date(report.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), completed: true, icon: UserCircle },
    { title: 'Acknowledged', time: 'Pending', desc: `Assigned to ${report.ward}`, completed: ['Acknowledged', 'In Progress', 'Resolved'].includes(report.status), icon: Check },
    { title: 'In Progress', time: 'Pending', desc: 'Vehicle Dispatched', completed: ['In Progress', 'Resolved'].includes(report.status), active: report.status === 'In Progress', icon: Truck },
    { title: 'Resolved', time: 'Pending', desc: 'Clearance completed', completed: report.status === 'Resolved', active: false, icon: Camera },
  ];

  return (
    <div className="max-w-3xl mx-auto bg-slate-50 md:bg-white min-h-[calc(100vh-64px)] md:min-h-0 md:rounded-3xl md:shadow-xl md:border md:border-slate-100 md:my-8 pb-20 md:pb-8 overflow-hidden">
      <div className="bg-white p-4 md:p-6 border-b border-slate-200 flex items-center gap-3 sticky top-0 md:static z-10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">Status Tracking</h1>
          <p className="text-xs md:text-sm font-semibold text-slate-500">{report.id}</p>
        </div>
      </div>

      <div className="p-4 md:p-8">
        {/* Info Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-slate-800">{report.category}</h2>
            <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-bold">
              {report.status === 'In Progress' && <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>}
              {report.status}
            </div>
          </div>
          
          <div className="space-y-3 bg-slate-50 p-3 rounded-xl mb-4 border border-slate-100 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Location</span>
              <span className="font-medium flex items-center gap-1 text-slate-700 text-right"><MapPin size={14}/> {report.location[0].toFixed(4)}, {report.location[1].toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Zone</span>
              <span className="font-medium text-slate-700">{report.ward}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Priority</span>
              <span className="font-medium text-primary">{report.priority} · {report.priorityScore}/100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Assigned vehicle</span>
              <span className="font-medium text-slate-700">{trucks.find(t => t.id === report.assignedTruckId)?.vehicleNumber || 'Dispatching'}</span>
            </div>
          </div>

          {report.description && <div className="mb-4 rounded-xl bg-slate-50 border border-slate-100 p-3 text-sm"><span className="font-semibold text-slate-700">Citizen description: </span><span className="text-slate-600">{report.description}</span></div>}

          {report.status !== 'Resolved' && <button onClick={() => confirmReport(report.id)} className="w-full mb-4 border border-primary/20 bg-blue-50 text-primary p-2 rounded-lg text-sm font-semibold">Confirm this issue ({report.confirmations})</button>}

          {assignedTruck && <div className="mb-4 rounded-xl border border-blue-100 overflow-hidden"><div className="p-3 bg-blue-50 flex justify-between text-sm"><span className="font-bold text-blue-900">Live truck tracking · {assignedTruck.vehicleNumber}</span><span className="text-blue-700">{assignedTruck.speedKmph} km/h</span></div><div className="h-52"><MapContainer center={assignedTruck.currentLocation} zoom={14} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}><TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" /><RoadPolyline points={trackingPoints} /><Marker position={assignedTruck.currentLocation} icon={L.divIcon({ className: 'truck-navigation-arrow', html: '<div>▲</div>', iconSize: [34, 34], iconAnchor: [17, 17] })}><Popup>{assignedTruck.status} · {assignedTruck.routeProgress}% complete</Popup></Marker></MapContainer></div><p className="p-3 text-xs text-slate-600">Active route · {roadRoute ? `${roadRoute.distanceKm.toFixed(1)} km, ${roadRoute.durationMinutes} min remaining` : 'Loading road route…'}</p></div>}

          <div className="h-32 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 overflow-hidden relative border border-slate-200">
             {report.clearancePhotoUrl || report.photoUrl ? (
                <img src={report.clearancePhotoUrl || report.photoUrl} alt="Waste report or clearance proof" className="w-full h-full object-cover" />
             ) : (
                <div className="absolute inset-0 bg-emerald-100 opacity-50 flex items-center justify-center">
                  <Camera size={32} className="text-emerald-500 opacity-40"/>
                </div>
             )}
             <span className="absolute bottom-2 right-2 text-[10px] font-bold text-white bg-black/50 px-2 py-1 rounded backdrop-blur">{report.clearancePhotoUrl ? 'Clearance proof' : 'Original photo'}</span>
          </div>
        </div>

        <h3 className="font-bold text-slate-800 mb-4 px-1">Pipeline Timeline</h3>

        {/* Timeline */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="relative pl-6 space-y-8 before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-200">
            
            {steps.map((step, index) => {
              return (
                <div key={index} className="relative flex items-start gap-4">
                  <div className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white ${
                    step.active ? 'bg-primary border-2 border-primary text-white shadow-[0_0_0_4px_rgba(30,58,138,0.2)]' : 
                    step.completed ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'
                  }`}>
                    {step.completed && !step.active ? <Check size={12} strokeWidth={4} /> : <div className={`w-2 h-2 rounded-full ${step.active ? 'bg-white' : 'bg-transparent'}`} />}
                  </div>
                  
                  <div className="-mt-1">
                    <h4 className={`font-bold ${step.active ? 'text-primary' : step.completed ? 'text-slate-800' : 'text-slate-400'}`}>
                      {step.title}
                    </h4>
                    {step.desc && (
                      <p className={`text-sm mt-0.5 ${step.active ? 'text-slate-600 font-medium' : 'text-slate-500'}`}>
                        {step.desc}
                      </p>
                    )}
                    <span className="text-xs text-slate-400 mt-1 block">{step.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportStatus;
