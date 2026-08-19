import { useNavigate } from 'react-router-dom';
import { User, Truck, Map, Shield } from 'lucide-react';

const Entry = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Smart Waste Management
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A closed-loop platform that enables citizens to report waste issues, tracks collection vehicles, predicts waste generation hotspots, and optimizes collection routes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Citizen Role */}
          <div 
            onClick={() => navigate('/citizen')}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-primary/20 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <User size={24} />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Citizen</h2>
            <p className="text-sm text-slate-500">Report waste, track status, and view nearby collection points.</p>
          </div>

          {/* Driver Role */}
          <div 
            onClick={() => navigate('/login/driver')}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-primary/20 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Truck size={24} />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Driver Worker</h2>
            <p className="text-sm text-slate-500">View prioritized routes, mark stops complete, and report issues.</p>
          </div>

          {/* Ward Admin Role */}
          <div 
            onClick={() => navigate('/login/ward-admin')}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-primary/20 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Map size={24} />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Ward Admin</h2>
            <p className="text-sm text-slate-500">Monitor live map, priority queue, and manage complaints in your zone.</p>
          </div>

          {/* Municipal Head Role */}
          <div 
            onClick={() => navigate('/login/super-admin')}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-primary/20 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Shield size={24} />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Municipal Head</h2>
            <p className="text-sm text-slate-500">City-wide analytics, ward health scores, and hotspot predictions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Entry;
