import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Camera, ChevronLeft, CheckCircle2, UploadCloud } from 'lucide-react';
import { useWasteContext } from '../../data/WasteContext';

const StopCompletion = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { clearStop } = useWasteContext();

  const [step, setStep] = useState(1);
  const [photoUploaded, setPhotoUploaded] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPhotoUploaded(imageUrl);
    }
  };

  const handleComplete = () => {
    if (id) {
      clearStop('T1', id, photoUploaded || undefined); // Stores proof and resolves the linked citizen report
    }
    setStep(2);
  };

  return (
    <div className="max-w-3xl mx-auto bg-slate-50 md:bg-white min-h-[calc(100vh-64px)] md:min-h-0 md:rounded-3xl md:shadow-xl md:border md:border-slate-100 md:my-8 pb-20 md:pb-8 overflow-hidden">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-slate-200 flex items-center gap-3 sticky top-0 md:static bg-white z-[100]">
        <button onClick={() => navigate('/driver')} className="p-2 hover:bg-slate-100 rounded-full">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">Clear Stop</h1>
          <p className="text-xs md:text-sm font-semibold text-slate-500">{id}</p>
        </div>
      </div>

      <div className="p-4 md:p-8">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Proof of Clearance</h2>
              <p className="text-slate-500 text-sm">Please upload a real photo showing the area has been cleared.</p>
            </div>

            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 rounded-3xl h-64 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all relative overflow-hidden ${photoUploaded ? 'border-emerald-500 bg-black text-emerald-600' : 'border-dashed border-slate-300 bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
            >
              {photoUploaded ? (
                <>
                  <img src={photoUploaded} alt="Clearance proof" className="absolute inset-0 w-full h-full object-cover opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
                    <div className="bg-emerald-500/90 text-white px-4 py-2 rounded-full font-semibold flex items-center gap-2 backdrop-blur-sm">
                      <CheckCircle2 size={20} />
                      Photo Captured
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Camera size={48} className="text-slate-400" />
                  <div className="text-center relative z-10">
                    <span className="font-semibold block text-slate-700">Tap to capture clearance photo</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPhotoUploaded("https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=400");
                      }}
                      className="mt-2 text-xs text-emerald-600 font-bold hover:underline bg-emerald-50 px-2 py-1 rounded relative z-[200]"
                    >
                      Mock Capture (For Testing)
                    </button>
                  </div>
                </>
              )}
            </div>

            <button
              disabled={!photoUploaded}
              onClick={handleComplete}
              className={`w-full p-4 rounded-xl font-bold text-lg transition-colors flex justify-center items-center gap-2 mt-8 ${photoUploaded ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
            >
              <UploadCloud size={24} />
              Mark as Completed
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 text-center py-12 animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Stop Cleared!</h2>
            <p className="text-slate-600 mx-auto leading-relaxed">
              Proof submitted successfully. The citizen will be notified.
            </p>

            <div className="pt-8">
              <button
                onClick={() => navigate('/driver')}
                className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold hover:bg-slate-800 transition-colors mb-3"
              >
                Continue Route
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StopCompletion;
