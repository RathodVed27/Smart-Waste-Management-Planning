import { useNavigate, useParams } from 'react-router-dom';
import { LockKeyhole, Truck, MapPinned, ShieldCheck } from 'lucide-react';
import { useAuth, type StaffRole } from '../data/AuthContext';

const labels: Record<StaffRole, { title: string; destination: string; icon: typeof Truck }> = {
  driver: { title: 'Driver sign in', destination: '/driver', icon: Truck },
  'ward-admin': { title: 'Ward Admin sign in', destination: '/ward-admin', icon: MapPinned },
  'super-admin': { title: 'Municipal Head sign in', destination: '/super-admin', icon: ShieldCheck },
};
const StaffLogin = () => {
  const { role: roleParam } = useParams(); const role = roleParam as StaffRole; const navigate = useNavigate(); const { signIn } = useAuth();
  const config = labels[role];
  if (!config) { navigate('/citizen'); return null; }
  const Icon = config.icon;
  return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-5"><div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
    <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center mb-6"><Icon size={28} /></div>
    <p className="text-sm font-semibold text-primary">Staff access only</p><h1 className="text-3xl font-bold text-slate-900 mt-1">{config.title}</h1>
    <p className="text-slate-500 mt-3 text-sm">Use the demo staff credentials to access your assigned operational module. Citizen reporting never requires sign-in.</p>
    <label className="block text-sm font-semibold text-slate-700 mt-7 mb-2">Staff ID</label><input defaultValue={role === 'driver' ? 'DRV-4321' : role === 'ward-admin' ? 'WARD-42' : 'MUNICIPAL-HQ'} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-primary" />
    <label className="block text-sm font-semibold text-slate-700 mt-4 mb-2">Password</label><input type="password" defaultValue="demo123" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-primary" />
    <button onClick={() => { signIn(role); navigate(config.destination); }} className="mt-6 w-full bg-primary text-white rounded-xl py-3.5 font-bold flex items-center justify-center gap-2"><LockKeyhole size={18} /> Sign in securely</button>
    <button onClick={() => navigate('/citizen')} className="mt-4 w-full text-sm text-slate-500 hover:text-primary">Continue as citizen</button>
  </div></div>;
};
export default StaffLogin;
