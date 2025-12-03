import React from 'react';
import { Download, RefreshCw, ArrowRight } from 'lucide-react';

interface ResultViewProps {
  original: string;
  generated: string | null;
  loading: boolean;
  onReset: () => void;
  error?: string | null;
}

export const ResultView: React.FC<ResultViewProps> = ({ original, generated, loading, onReset, error }) => {
  const handleDownload = () => {
    if (generated) {
      const link = document.createElement('a');
      link.href = generated;
      link.download = `reverse-ai-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        {/* Original */}
        <div className="w-full md:w-1/2 space-y-2">
          <p className="text-center text-sm font-medium text-gray-400 uppercase tracking-wider">Original</p>
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-gray-700 bg-gray-800">
            <img src={original} alt="Original" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Arrow / Loader */}
        <div className="flex items-center justify-center md:rotate-0 rotate-90 shrink-0">
          {loading ? (
             <div className="relative w-16 h-16">
               <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
               <div className="absolute inset-0 rounded-full border-4 border-t-neon-purple border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
             </div>
          ) : (
            <div className="p-3 rounded-full bg-gray-800 border border-gray-700 text-gray-400">
              <ArrowRight size={24} />
            </div>
          )}
        </div>

        {/* Generated */}
        <div className="w-full md:w-1/2 space-y-2">
          <p className="text-center text-sm font-medium text-neon-purple uppercase tracking-wider">Transformed</p>
          <div className={`relative aspect-square rounded-2xl overflow-hidden border ${generated ? 'border-neon-purple' : 'border-gray-700'} bg-gray-800 group`}>
            {generated ? (
              <>
                <img src={generated} alt="Generated" className="w-full h-full object-cover animate-fade-in" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button 
                    onClick={handleDownload}
                    className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform"
                    title="Download"
                  >
                    <Download size={24} />
                  </button>
                </div>
              </>
            ) : loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-gray-900/50 backdrop-blur-sm">
                <div className="text-neon-purple animate-pulse font-medium">Processing...</div>
                <p className="text-xs text-gray-400 px-6 text-center">This may take up to 20 seconds.</p>
              </div>
            ) : (
               <div className="w-full h-full flex items-center justify-center text-gray-600">
                 <p className="text-sm">Waiting for result...</p>
               </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-200 text-center">
          {error}
        </div>
      )}

      {/* Actions */}
      {!loading && generated && (
        <div className="flex justify-center pt-6">
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-all border border-gray-700"
          >
            <RefreshCw size={18} />
            <span>Start Over</span>
          </button>
        </div>
      )}
    </div>
  );
};
