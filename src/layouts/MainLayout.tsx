import { Outlet, useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut } from 'lucide-react';
import { useAuth } from '../data/AuthContext';

const MainLayout = () => {
  const navigate = useNavigate();
  const { role, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(role ? '/roles' : '/citizen')}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
              title={role ? 'Change role' : 'Citizen home'}
            >
              <ArrowLeft size={20} />
            </button>
            <div className="font-semibold text-lg text-primary flex items-center gap-2">
              <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center text-sm font-bold">
                SW
              </div>
              Smart Waste
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {role && <button onClick={() => { signOut(); navigate('/citizen'); }} className="text-sm font-semibold text-slate-600 hover:text-primary flex items-center gap-1"><LogOut size={16} /> Sign out</button>}
            {/* Language Switcher Mock */}
            <select className="bg-slate-100 border-none text-sm rounded-md focus:ring-primary">
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="gu">ગુજરાતી</option>
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
