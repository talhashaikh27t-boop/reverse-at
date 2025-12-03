import React, { useState, useCallback } from 'react';
import { Intro } from './components/Intro';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { ResultView } from './components/ResultView';
import { StyleExamples } from './components/StyleExamples';
import { CountryView } from './components/CountryView';
import { transformImage } from './services/geminiService';
import { AppMode } from './types';
import { Wand2, Sparkles, Globe } from 'lucide-react';

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [mode, setMode] = useState<AppMode>(AppMode.REVERSE);
  
  // State for image processing (Single Mode: Reverse, Age, Style)
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inputs for specific modes
  const [age, setAge] = useState<string>('60');
  const [styleDescription, setStyleDescription] = useState<string>('Make them wear a cyberpunk jacket with glowing blue eyes.');

  const handleReset = useCallback(() => {
    setOriginalImage(null);
    setGeneratedImage(null);
    setError(null);
    setLoading(false);
  }, []);

  const handleModeChange = (newMode: AppMode) => {
    if (loading) return; // Prevent changing mode while loading
    setMode(newMode);
    handleReset();
  };

  const processImage = async (base64: string, currentMode: AppMode) => {
    setLoading(true);
    setError(null);
    setOriginalImage(base64);

    let prompt = "";
    
    switch (currentMode) {
      case AppMode.REVERSE:
        prompt = "Transform the person in this image to look like the opposite gender. Keep the same pose, background, and facial expression identity. Photorealistic.";
        break;
      case AppMode.AGE:
        prompt = `Generate a photorealistic version of this person at age ${age}. Maintain their identity, pose, and background.`;
        break;
      case AppMode.STYLE:
        prompt = `Edit this image based on the following description: ${styleDescription}. Maintain the original pose and composition. Photorealistic.`;
        break;
      // Country mode handles its own processing
      default:
        break;
    }

    try {
      const result = await transformImage(base64, prompt);
      setGeneratedImage(result);
    } catch (err: any) {
      setError(err.message || "Failed to generate image. Please try again.");
      setGeneratedImage(null);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (base64: string) => {
    if (loading) return;
    processImage(base64, mode);
  };

  const handleRetry = () => {
    if (originalImage) {
      processImage(originalImage, mode);
    }
  };

  if (showIntro) {
    return <Intro onComplete={() => setShowIntro(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg text-white font-sans selection:bg-neon-purple selection:text-white">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
         <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-neon-purple/20 rounded-full blur-[120px] opacity-40"></div>
         <div className="absolute top-[40%] right-[0%] w-[40%] h-[40%] bg-neon-blue/20 rounded-full blur-[120px] opacity-30"></div>
         <div className="absolute -bottom-[10%] left-[20%] w-[60%] h-[40%] bg-neon-pink/10 rounded-full blur-[100px] opacity-30"></div>
      </div>

      <Header currentMode={mode} onModeChange={handleModeChange} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* Mode Description */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            {mode === AppMode.REVERSE && <><Sparkles className="text-neon-purple" /> <span>Gender Swap</span></>}
            {mode === AppMode.AGE && <><Sparkles className="text-neon-blue" /> <span>Age Time Machine</span></>}
            {mode === AppMode.STYLE && <><Sparkles className="text-neon-pink" /> <span>Style Editor</span></>}
            {mode === AppMode.COUNTRY && <><Globe className="text-green-400" /> <span>Global Heritage</span></>}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            {mode === AppMode.REVERSE && "Upload a photo to see the opposite gender version instantly."}
            {mode === AppMode.AGE && "Travel through time. See yourself younger or older."}
            {mode === AppMode.STYLE && "Customize appearance. Change clothes, eye color, or skin tone with a prompt."}
            {mode === AppMode.COUNTRY && "Visualize yourself as a local in different countries. Generate two variations at once."}
          </p>
        </div>

        {/* --- COUNTRY MODE --- */}
        {mode === AppMode.COUNTRY ? (
          <CountryView />
        ) : (
          /* --- SINGLE IMAGE MODES (Reverse, Age, Style) --- */
          <>
            {/* Inputs (Before Upload) */}
            {!originalImage && (
               <div className="max-w-2xl mx-auto mb-8 space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                 
                 {mode === AppMode.AGE && (
                   <div className="glass p-6 rounded-2xl border border-white/10">
                     <label className="block text-sm font-medium text-gray-300 mb-2">Target Age: <span className="text-neon-blue text-lg font-bold">{age}</span></label>
                     <input 
                        type="range" 
                        min="5" 
                        max="100" 
                        value={age} 
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-blue hover:accent-neon-purple transition-all"
                     />
                     <div className="flex justify-between text-xs text-gray-500 mt-2">
                       <span>Child (5)</span>
                       <span>Adult (30)</span>
                       <span>Elder (80+)</span>
                     </div>
                   </div>
                 )}

                 {mode === AppMode.STYLE && (
                   <div className="glass p-6 rounded-2xl border border-white/10">
                     <StyleExamples onSelect={setStyleDescription} />
                     
                     <label className="block text-sm font-medium text-gray-300 mb-2">Description of changes</label>
                     <textarea
                       value={styleDescription}
                       onChange={(e) => setStyleDescription(e.target.value)}
                       className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-neon-pink focus:border-transparent outline-none resize-none h-32 transition-all placeholder-gray-500"
                       placeholder="E.g., Change hair to red, add glasses, wear a futuristic suit..."
                     />
                   </div>
                 )}

                 <FileUpload 
                   onImageSelect={handleImageSelect} 
                   label={mode === AppMode.STYLE ? "Upload Full Body/Portrait" : "Upload Portrait Photo"}
                 />
               </div>
            )}

            {/* Results Area */}
            {originalImage && (
              <ResultView 
                original={originalImage}
                generated={generatedImage}
                loading={loading}
                onReset={handleReset}
                error={error}
              />
            )}
            
            {/* Loading Hint */}
            {loading && (
               <div className="text-center mt-8 animate-pulse text-gray-500 text-sm">
                 <div className="flex items-center justify-center gap-2">
                   <Wand2 size={16} className="animate-spin" />
                   <span>AI is weaving reality...</span>
                 </div>
               </div>
            )}
          </>
        )}

      </main>

      <footer className="w-full py-6 text-center text-gray-600 text-sm relative z-10">
        <p>Powered by Gemini Nano Banana (Flash Image)</p>
      </footer>
    </div>
  );
};

export default App;