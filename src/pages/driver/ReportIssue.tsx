import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, AlertTriangle, Send } from 'lucide-react';

const ReportIssue = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const step = submitted ? 2 : 1;

  return (
    <div className="max-w-3xl mx-auto bg-slate-50 md:bg-white min-h-[calc(100vh-64px)] md:min-h-0 md:rounded-3xl md:shadow-xl md:border md:border-slate-100 md:my-8 pb-20 md:pb-8 overflow-hidden">
      <div className="bg-white p-4 md:p-6 border-b border-slate-200 flex items-center gap-3 sticky top-0 md:static z-[100]">
        <button onClick={() => step === 1 ? navigate('/driver') : null} className="p-2 hover:bg-slate-100 rounded-full" disabled={step === 2}>
          <ChevronLeft size={20} className={step === 2 ? 'opacity-0' : ''} />
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-slate-800">Vehicle Issue</h1>
      </div>

      <div className="p-4 md:p-8">
        {!submitted ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-5 animate-in fade-in slide-in-from-bottom-4">
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Issue Type</label>
              <select className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-red-500 outline-none text-slate-700">
                <option>Flat Tire</option>
                <option>Engine Breakdown</option>
                <option>Full Capacity Reached Early</option>
                <option>Route Blocked</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
              <textarea 
                rows={4}
                className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-red-500 outline-none text-slate-700"
                placeholder="Briefly describe the issue..."
              ></textarea>
            </div>

            <button 
              onClick={() => setSubmitted(true)}
              className="w-full bg-red-600 text-white p-4 rounded-xl font-bold text-lg shadow-lg hover:bg-red-700 transition-colors flex justify-center items-center gap-2 mt-4"
            >
              <Send size={20} />
              Submit Report
            </button>
          </div>
        ) : (
          <div className="text-center py-16 animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <AlertTriangle size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Issue Reported</h2>
            <p className="text-slate-600 mb-8 max-w-[250px] mx-auto text-sm">
              Dispatch has been notified. They will contact you shortly and reroute pending stops.
            </p>
            
            <button 
              onClick={() => navigate('/driver')}
              className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold hover:bg-slate-800 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportIssue;
