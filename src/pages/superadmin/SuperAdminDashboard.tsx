import { useWasteContext } from '../../data/WasteContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Activity, Droplets, Map, CheckCircle2, AlertTriangle, TrendingDown } from 'lucide-react';

const wardHealthData = [
  { name: 'W42-Downtown', healthScore: 85, openIssues: 12 },
  { name: 'W12-North', healthScore: 92, openIssues: 4 },
  { name: 'W08-South', healthScore: 68, openIssues: 28 },
  { name: 'W15-East', healthScore: 78, openIssues: 19 },
  { name: 'W33-West', healthScore: 88, openIssues: 8 },
];

const fuelSavingsData = [
  { day: 'Mon', unoptimized: 120, optimized: 85 },
  { day: 'Tue', unoptimized: 110, optimized: 80 },
  { day: 'Wed', unoptimized: 130, optimized: 95 },
  { day: 'Thu', unoptimized: 105, optimized: 75 },
  { day: 'Fri', unoptimized: 140, optimized: 90 },
  { day: 'Sat', unoptimized: 115, optimized: 80 },
  { day: 'Sun', unoptimized: 95, optimized: 65 },
];

const SuperAdminDashboard = () => {
  const { reports } = useWasteContext();

  const totalReports = reports.length + 1240; // Adding mock baseline
  const resolvedReports = reports.filter(r => r.status === 'Resolved').length + 1150;
  const resolutionRate = Math.round((resolvedReports / totalReports) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Municipal Head Dashboard</h1>
          <p className="text-slate-500">City-wide Analytics & Impact Metrics</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">City Level</div>
          <div className="text-xs font-semibold text-slate-500 uppercase">Super Admin</div>
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
            <Activity size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">{totalReports.toLocaleString()}</div>
            <div className="text-sm font-medium text-slate-500">Total Reports (YTD)</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">{resolutionRate}%</div>
            <div className="text-sm font-medium text-slate-500">Resolution Rate</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-xl">
            <TrendingDown size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">28.4%</div>
            <div className="text-sm font-medium text-slate-500">Fuel & Distance Saved</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-amber-50 text-amber-600 rounded-xl">
            <AlertTriangle size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">W08-South</div>
            <div className="text-sm font-medium text-slate-500">Highest Risk Zone</div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Ward Health Score Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Map size={20} className="text-primary" />
              Ward Health Scores
            </h2>
            <p className="text-sm text-slate-500">Composite metric combining resolution time, repeat incidents, and open complaints.</p>
          </div>
          
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wardHealthData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="healthScore" name="Health Score (0-100)" fill="#1e3a8a" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fuel & Distance Savings Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Droplets size={20} className="text-emerald-600" />
              Route Optimization Impact (Fuel km)
            </h2>
            <p className="text-sm text-slate-500">Comparison of optimized routes vs traditional static routing over 7 days.</p>
          </div>
          
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fuelSavingsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="unoptimized" name="Unoptimized (km)" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" />
                <Line type="monotone" dataKey="optimized" name="AI Optimized (km)" stroke="#059669" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SuperAdminDashboard;
