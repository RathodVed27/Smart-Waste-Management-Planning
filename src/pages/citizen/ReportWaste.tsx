import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, CheckCircle2, ChevronLeft, UploadCloud, Map as MapIcon, Loader2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useWasteContext } from '../../data/WasteContext';

// Fix for default Leaflet marker in React
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Helper component to auto-pan map when location changes
const RecenterMap = ({ position }: { position: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [position, map]);
  return null;
};

const ReportWaste = () => {
  const navigate = useNavigate();
  const { addReport, trucks } = useWasteContext();
  const [step, setStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form State
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [locationDetected, setLocationDetected] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [ward, setWard] = useState('');
  const [showLiveMap, setShowLiveMap] = useState(false);
  
  const [position, setPosition] = useState<[number, number]>([23.2186, 72.6429]); // Gandhinagar demo fallback
  
  const [submittedReportId, setSubmittedReportId] = useState<string | null>(null);

  // Trigger GPS detection when reaching Step 2
  useEffect(() => {
    if (step === 2 && !locationDetected && !isDetectingLocation) {
      detectRealLocation();
    }
  }, [step]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCapturedImage(imageUrl);
      setTimeout(() => setStep(2), 800);
    }
  };

  const detectRealLocation = () => {
    setIsDetectingLocation(true);
    setLocationError('');
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setPosition(Math.hypot(lat - 23.2191, lng - 72.6418) < 0.08 ? [lat, lng] : [23.2186, 72.6429]);
          setLocationDetected(true);
          setIsDetectingLocation(false);
          
          // Simple mock logic for ward assignment based on coordinates
          setWard('Ward 21 - Gandhinagar');
          setShowLiveMap(true); 
          
        },
        (err) => {
          console.error('Geolocation error:', err);
          setLocationError('GPS permission was unavailable. A demo location is selected; drag the marker in a production build.');
          setWard('Ward 21 - Gandhinagar');
          setLocationDetected(true);
          setShowLiveMap(true);
          setIsDetectingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocationError('GPS is not supported. A demo location is selected.');
      setWard('Ward 21 - Gandhinagar');
      setLocationDetected(true);
      setShowLiveMap(true);
      setIsDetectingLocation(false);
    }
  };

  const submitReport = () => {
    const id = addReport({
      category,
      description: description.trim() || undefined,
      location: position,
      ward,
      photoUrl: capturedImage || undefined
    });
    setSubmittedReportId(id);
    setStep(4); // Success step
  };

  return (
    <div className="max-w-3xl mx-auto bg-white min-h-[calc(100vh-64px)] md:min-h-0 md:rounded-3xl md:shadow-xl md:border md:border-slate-100 md:my-8 pb-20 md:pb-8 overflow-hidden">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-slate-100 flex items-center gap-3 sticky top-0 bg-white/80 backdrop-blur-md z-[100]">
        <button onClick={() => step > 1 && step < 4 ? setStep(step - 1) : navigate('/citizen')} className="p-2 hover:bg-slate-100 rounded-full">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-slate-800">Report Issue</h1>
      </div>

      <div className="p-4 md:p-8">
        {/* Step Indicator */}
        {step < 4 && (
          <div className="flex gap-2 mb-8">
            <div className={`h-2 flex-1 rounded-full transition-colors duration-500 ${step >= 1 ? 'bg-primary' : 'bg-slate-100'}`} />
            <div className={`h-2 flex-1 rounded-full transition-colors duration-500 ${step >= 2 ? 'bg-primary' : 'bg-slate-100'}`} />
            <div className={`h-2 flex-1 rounded-full transition-colors duration-500 ${step >= 3 ? 'bg-primary' : 'bg-slate-100'}`} />
          </div>
        )}

        {/* Step 1: Photo */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Take a Photo</h2>
              <p className="text-slate-500 text-sm">Upload a real photo of the waste issue to proceed.</p>
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
              className={`border-2 rounded-3xl h-64 flex flex-col items-center justify-center gap-4 transition-all relative overflow-hidden cursor-pointer ${
                capturedImage ? 'border-emerald-500 bg-black' : 'border-dashed border-slate-300 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:border-primary'
              }`}
            >
              {capturedImage ? (
                <>
                  <img src={capturedImage} alt="Captured waste" className="absolute inset-0 w-full h-full object-cover opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <div className="bg-emerald-500/90 text-white px-4 py-2 rounded-full font-semibold flex items-center gap-2 backdrop-blur-sm">
                      <CheckCircle2 size={20} />
                      Photo Captured
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Camera size={48} className="text-slate-400" />
                  <div className="text-center">
                    <span className="font-semibold block text-slate-700">Tap to capture or upload</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Location & Category */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Details</h2>
              <p className="text-slate-500 text-sm">Where is this and what type of issue is it?</p>
            </div>

            {/* Location Section */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${locationDetected ? 'bg-emerald-100 text-emerald-600' : locationError ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600 animate-pulse'}`}>
                    {isDetectingLocation ? <Loader2 size={20} className="animate-spin" /> : <MapPin size={20} />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {isDetectingLocation ? 'Finding your location...' : locationDetected ? 'Location Detected' : 'Location Required'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {locationDetected ? `Lat: ${position[0].toFixed(4)}, Lng: ${position[1].toFixed(4)}` : locationError ? 'Please enable GPS' : 'Using real GPS...'}
                    </p>
                  </div>
                </div>
                
                {(!locationDetected || locationError) && !isDetectingLocation && (
                  <button 
                    onClick={detectRealLocation}
                    className="px-3 py-1 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-blue-800 transition-colors"
                  >
                    Retry
                  </button>
                )}
                
                {locationDetected && !showLiveMap && (
                  <button 
                    onClick={() => setShowLiveMap(true)}
                    className="p-2 bg-white rounded-lg border border-slate-200 text-slate-600 shadow-sm hover:text-primary hover:border-primary transition-colors"
                    title="Show Map"
                  >
                    <MapIcon size={20} />
                  </button>
                )}
              </div>

              {locationError && (
                <div className="mb-3 text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-100">
                  {locationError}
                </div>
              )}
              
              {/* Map Preview */}
              {showLiveMap && locationDetected && (
                <div className="h-48 rounded-xl overflow-hidden mb-3 border border-slate-200 shadow-inner relative z-0">
                  <MapContainer center={position} zoom={16} scrollWheelZoom={true} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <RecenterMap position={position} />
                    <Marker position={position} icon={customIcon} />
                  </MapContainer>
                  <div className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur text-xs px-2 py-1 rounded font-medium text-slate-700 shadow border border-slate-200">
                    Live Map
                  </div>
                </div>
              )}
              
              {ward && locationDetected && (
                <div className="bg-white px-3 py-2 rounded-lg text-sm font-medium text-slate-700 border border-slate-200 shadow-sm flex justify-between items-center">
                  <span>Assigned Zone:</span>
                  <span className="text-primary">{ward}</span>
                </div>
              )}
            </div>

            {/* Category Section */}
            {locationDetected && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <h3 className="font-semibold text-slate-800 mb-3">Select Category</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['Overflow', 'Illegal dumping', 'Missed pickup', 'Damaged bin'].map(cat => (
                    <div 
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        category === cat ? 'border-primary bg-blue-50 text-primary font-semibold shadow-sm' : 'border-slate-100 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-sm block text-center">{cat}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5"><label className="font-semibold text-slate-800 block mb-2">Description <span className="font-normal text-slate-400">(optional)</span></label><textarea value={description} onChange={event => setDescription(event.target.value)} rows={3} maxLength={240} placeholder="Add landmark, access issue, or waste details..." className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-primary resize-none" /><p className="text-right text-xs text-slate-400">{description.length}/240</p></div>
                <button disabled={!category} onClick={() => setStep(3)} className="mt-5 w-full bg-primary disabled:bg-slate-200 text-white rounded-xl py-3 font-bold">Continue to review</button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Review</h2>
              <p className="text-slate-500 text-sm">Confirm your real report details before submitting.</p>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <span className="text-slate-500 text-sm">Category</span>
                <span className="font-semibold text-slate-800">{category}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <span className="text-slate-500 text-sm">GPS Location</span>
                <span className="font-semibold text-slate-800 text-right text-xs">
                  {position[0].toFixed(5)}, {position[1].toFixed(5)}
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <span className="text-slate-500 text-sm">Ward</span>
                <span className="font-semibold text-primary">{ward}</span>
              </div>
              {description && <div className="pb-4 border-b border-slate-200 text-sm"><span className="text-slate-500">Description</span><p className="font-medium text-slate-700 mt-1">{description}</p></div>}
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm">Photo</span>
                {capturedImage && (
                  <img src={capturedImage} alt="Thumbnail" className="h-16 w-16 rounded-lg object-cover shadow-sm border border-slate-200" />
                )}
              </div>
            </div>

            <button 
              onClick={submitReport}
              className="w-full bg-primary text-white p-4 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-800 transition-colors flex justify-center items-center gap-2 mt-8 active:scale-95"
            >
              <UploadCloud size={24} />
              Submit Report
            </button>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="space-y-6 text-center py-12 animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner relative">
              <CheckCircle2 size={48} />
              <div className="absolute inset-0 border-4 border-emerald-400 rounded-full animate-ping opacity-20"></div>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Reported!</h2>
            <p className="text-slate-600 max-w-[250px] mx-auto leading-relaxed">
              Your issue is assigned to <span className="font-semibold text-slate-800">{trucks.find(t => t.assignedReports.includes(submittedReportId || ''))?.vehicleNumber}</span>. Its active route and hotspot prediction were updated.
            </p>
            
            <div className="pt-8">
              <button 
                onClick={() => navigate('/citizen/reports')}
                className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold hover:bg-slate-800 transition-colors mb-3"
              >
                Track Status
              </button>
              <button 
                onClick={() => navigate('/citizen')}
                className="w-full bg-white text-slate-700 border border-slate-200 p-4 rounded-xl font-bold hover:bg-slate-50 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportWaste;
