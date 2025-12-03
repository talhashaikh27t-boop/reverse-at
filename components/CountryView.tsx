import React, { useState } from 'react';
import { FileUpload } from './FileUpload';
import { transformImage } from '../services/geminiService';
import { Globe, ArrowDown, Download, RefreshCw, Loader2, Play, ChevronDown, Search } from 'lucide-react';

const COUNTRIES = [
  "Argentina", "Australia", "Austria", "Belgium", "Brazil", "Canada", "Chile", "China", 
  "Colombia", "Denmark", "Egypt", "Finland", "France", "Germany", "Greece", "India", 
  "Indonesia", "Ireland", "Italy", "Japan", "Kenya", "Malaysia", "Mexico", "Morocco", 
  "Netherlands", "New Zealand", "Nigeria", "Norway", "Pakistan", "Peru", "Philippines", 
  "Poland", "Portugal", "Russia", "Saudi Arabia", "Singapore", "South Africa", 
  "South Korea", "Spain", "Sweden", "Switzerland", "Thailand", "Turkey", 
  "United Arab Emirates", "United Kingdom", "United States", "Vietnam"
];

interface CountrySelectorProps {
  selected: string;
  onSelect: (country: string) => void;
  disabled: boolean;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({ selected, onSelect, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = COUNTRIES.filter(c => 
    c.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center gap-2 bg-gray-900 border border-gray-600 rounded-lg text-sm text-white px-3 py-1.5 focus:ring-2 focus:ring-neon-purple outline-none min-w-[160px] justify-between transition-colors hover:border-gray-500 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span className="truncate max-w-[120px]">{selected}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-64 max-h-80 bg-gray-800 border border-gray-600 rounded-xl shadow-xl z-50 flex flex-col overflow-hidden animate-fade-in">
            <div className="p-2 border-b border-gray-700 bg-gray-800 sticky top-0">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search country..."
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg py-1.5 pl-9 pr-3 text-sm text-white focus:ring-1 focus:ring-neon-purple outline-none placeholder-gray-500"
                  autoFocus
                />
              </div>
            </div>
            <div className="overflow-y-auto max-h-[240px] scrollbar-thin scrollbar-thumb-gray-600">
              {filtered.length > 0 ? (
                filtered.map(country => (
                  <button
                    key={country}
                    onClick={() => {
                      onSelect(country);
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors flex items-center justify-between
                      ${selected === country ? 'bg-neon-purple/10 text-neon-purple' : 'text-gray-200'}
                    `}
                  >
                    {country}
                    {selected === country && <div className="w-1.5 h-1.5 rounded-full bg-neon-purple" />}
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500 text-sm">No match found</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

interface CountryCardState {
  id: number;
  image: string | null;
  country: string;
  result: string | null;
  loading: boolean;
  error: string | null;
}

export const CountryView: React.FC = () => {
  const [cards, setCards] = useState<[CountryCardState, CountryCardState]>([
    { id: 1, image: null, country: "United States", result: null, loading: false, error: null },
    { id: 2, image: null, country: "Japan", result: null, loading: false, error: null }
  ]);

  const updateCard = (index: 0 | 1, updates: Partial<CountryCardState>) => {
    setCards(prev => {
      const newCards = [...prev] as [CountryCardState, CountryCardState];
      newCards[index] = { ...newCards[index], ...updates };
      return newCards;
    });
  };

  const generateImage = async (index: 0 | 1) => {
    const card = cards[index];
    if (!card.image) return;

    updateCard(index, { loading: true, error: null, result: null });
    
    const prompt = `Generate a photorealistic portrait of this person as if they were born and raised in ${card.country}. Adapt their clothing, styling, and background to reflect ${card.country} culture and heritage while maintaining their facial features and identity.`;

    try {
      const result = await transformImage(card.image, prompt);
      updateCard(index, { result, loading: false });
    } catch (err: any) {
      updateCard(index, { error: err.message || "Generation failed", loading: false });
    }
  };

  const handleGenerateAll = () => {
    if (cards[0].image) generateImage(0);
    if (cards[1].image) generateImage(1);
  };

  const handleDownload = (url: string, index: number) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `country-transform-${index + 1}-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full space-y-8 animate-fade-in">
      
      {/* Dual Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {cards.map((card, index) => (
          <div key={card.id} className="bg-gray-800/40 border border-gray-700 rounded-3xl p-6 flex flex-col gap-6 relative overflow-hidden group">
             {/* Card specific background glow */}
             <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] opacity-20 pointer-events-none transition-colors duration-500
                ${index === 0 ? 'bg-neon-blue' : 'bg-neon-pink'}`}></div>

             <div className="flex items-center justify-between z-10">
               <span className="text-gray-400 font-medium tracking-widest text-xs uppercase">Person {card.id}</span>
               <div className="flex items-center gap-2">
                 <Globe size={16} className="text-neon-purple" />
                 <CountrySelector
                   selected={card.country}
                   onSelect={(c) => updateCard(index as 0 | 1, { country: c })}
                   disabled={card.loading}
                 />
               </div>
             </div>

             {/* Input / Result Area */}
             <div className="flex-1 space-y-4">
                {!card.result && (
                  <div className="relative">
                    {card.image ? (
                      <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-gray-600">
                        <img src={card.image} alt="Upload" className="w-full h-full object-cover" />
                        <button 
                          onClick={() => updateCard(index as 0|1, { image: null })}
                          className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-red-500/80 rounded-full text-white transition-colors"
                        >
                          <RefreshCw size={16} />
                        </button>
                      </div>
                    ) : (
                      <FileUpload 
                        onImageSelect={(base64) => updateCard(index as 0|1, { image: base64 })} 
                        label="Upload Photo"
                      />
                    )}
                  </div>
                )}

                {/* Loading State */}
                {card.loading && (
                  <div className="absolute inset-0 z-20 bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-3xl">
                    <Loader2 size={48} className="text-neon-purple animate-spin mb-4" />
                    <p className="text-neon-purple font-medium animate-pulse">Traveling to {card.country}...</p>
                  </div>
                )}

                {/* Error State */}
                {card.error && (
                  <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm text-center">
                    {card.error}
                    <button 
                      onClick={() => generateImage(index as 0|1)}
                      className="block mx-auto mt-2 underline hover:text-white"
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {/* Result Display */}
                {card.result && (
                  <div className="animate-slide-up space-y-4">
                    <div className="flex justify-center text-neon-purple">
                      <ArrowDown className="animate-bounce" />
                    </div>
                    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border-2 border-neon-purple shadow-lg shadow-neon-purple/20">
                      <img src={card.result} alt="Result" className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 to-transparent flex justify-center gap-4">
                        <button 
                          onClick={() => handleDownload(card.result!, index)}
                          className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform shadow-lg"
                        >
                          <Download size={20} />
                        </button>
                        <button 
                          onClick={() => updateCard(index as 0|1, { result: null })}
                          className="p-3 bg-gray-800 text-white border border-gray-600 rounded-full hover:bg-gray-700 transition-colors"
                        >
                          <RefreshCw size={20} />
                        </button>
                      </div>
                    </div>
                    <p className="text-center text-sm text-gray-400">
                      Born in <span className="text-white font-medium">{card.country}</span>
                    </p>
                  </div>
                )}
             </div>

             {/* Action Button (Individual) */}
             {!card.result && !card.loading && (
               <button
                 onClick={() => generateImage(index as 0|1)}
                 disabled={!card.image}
                 className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2
                   ${card.image 
                     ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-lg shadow-neon-purple/25 hover:shadow-neon-purple/40 hover:-translate-y-1' 
                     : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
               >
                 <Play size={18} fill="currentColor" />
                 Generate {card.country} Version
               </button>
             )}
          </div>
        ))}
      </div>

      {/* Global Action */}
      <div className="flex justify-center pt-8 border-t border-white/5">
        <button
          onClick={handleGenerateAll}
          disabled={!cards[0].image && !cards[1].image}
          className={`px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center gap-3
            ${(cards[0].image || cards[1].image)
              ? 'bg-white text-black hover:bg-gray-200 hover:scale-105 shadow-xl shadow-white/10'
              : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
        >
          <Globe size={24} />
          Transform Both Images
        </button>
      </div>
    </div>
  );
};