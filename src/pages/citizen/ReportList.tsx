import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, MapPin, ThumbsUp } from 'lucide-react';
import { useWasteContext } from '../../data/WasteContext';

const ReportList = () => {
  const navigate = useNavigate();
  const { reports, confirmReport } = useWasteContext();

  return (
    <div className="max-w-7xl mx-auto bg-slate-50 min-h-[calc(100vh-64px)] md:bg-transparent md:my-8 pb-20">
      <div className="bg-white p-4 md:p-6 md:rounded-3xl border-b md:border border-slate-200 md:shadow-sm flex items-center justify-between gap-3 sticky top-0 md:static z-10 mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/citizen')} className="p-2 hover:bg-slate-100 rounded-full">
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">My Reports</h1>
        </div>
      </div>

      <div className="p-4 md:p-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div 
            key={report.id}
            onClick={() => navigate(`/citizen/report/${report.id}`)}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-primary/30 cursor-pointer transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{report.id}</span>
                <h3 className="text-lg font-bold text-slate-800 mt-0.5">{report.category}</h3>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                report.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                report.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                {report.status}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin size={16} className="text-slate-400" />
                {report.ward}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Clock size={16} className="text-slate-400" />
                {new Date(report.date).toLocaleDateString()} {new Date(report.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-sm">
              <button onClick={(event) => { event.stopPropagation(); confirmReport(report.id); }} className="flex items-center gap-1.5 text-slate-500 hover:text-primary" title="Confirm this issue">
                <ThumbsUp size={16} />
                <span>{report.confirmations} confirmations</span>
              </button>
              <span className="text-primary font-medium group-hover:underline">View Pipeline &rarr;</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportList;
