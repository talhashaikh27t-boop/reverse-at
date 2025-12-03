import React from 'react';
import { Wand2 } from 'lucide-react';

interface StyleExample {
  id: string;
  title: string;
  prompt: string;
  imageUrl: string;
  color: string;
}

interface StyleExamplesProps {
  onSelect: (prompt: string) => void;
}

const EXAMPLES: StyleExample[] = [
  {
    id: 'cyberpunk',
    title: 'Cyberpunk',
    prompt: 'Make them wear a futuristic cyberpunk jacket with glowing neon accents, technological eyewear, and blue and purple lighting.',
    imageUrl: 'https://images.unsplash.com/photo-1615813967515-e1838c1c5116?w=400&q=80',
    color: 'from-blue-500 to-purple-500'
  },
  {
    id: 'fantasy',
    title: 'Ethereal Elf',
    prompt: 'Transform into a high fantasy elf with silver hair, pointed ears, glowing skin, and intricate silver armor in a magical forest.',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    color: 'from-emerald-400 to-teal-600'
  },
  {
    id: 'professional',
    title: 'Executive',
    prompt: 'Change clothing to a high-end navy business suit with a crisp white shirt. Professional studio lighting, confident expression.',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
    color: 'from-slate-700 to-slate-900'
  },
  {
    id: 'anime',
    title: 'Anime Style',
    prompt: 'Transform the image into a high-quality studio ghibli anime style illustration. Vibrant colors, cel shading.',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80',
    color: 'from-pink-500 to-orange-400'
  },
  {
    id: 'zombie',
    title: 'Zombie',
    prompt: 'Turn the person into a scary zombie with pale decaying skin, dark circles under eyes, and tattered clothes. Horror movie style.',
    imageUrl: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=400&q=80',
    color: 'from-green-900 to-gray-900'
  }
];

export const StyleExamples: React.FC<StyleExamplesProps> = ({ onSelect }) => {
  return (
    <div className="w-full mb-6">
      <div className="flex items-center gap-2 mb-3 text-gray-400 text-sm font-medium pl-1">
        <Wand2 size={16} className="text-neon-purple" />
        <span>Try a preset style</span>
      </div>
      
      <div className="flex overflow-x-auto gap-4 pb-4 snap-x scrollbar-hide -mx-2 px-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex.id}
            onClick={() => onSelect(ex.prompt)}
            className="group relative flex-shrink-0 w-32 h-40 rounded-xl overflow-hidden snap-start focus:outline-none focus:ring-2 focus:ring-neon-purple transition-transform hover:scale-105"
          >
            {/* Background Image */}
            <img 
              src={ex.imageUrl} 
              alt={ex.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-60 group-hover:opacity-40"
            />
            
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t ${ex.color} opacity-60 mix-blend-multiply`} />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90" />

            {/* Content */}
            <div className="absolute inset-0 p-3 flex flex-col justify-end text-left">
              <span className="text-white font-bold text-sm leading-tight group-hover:text-neon-purple transition-colors">
                {ex.title}
              </span>
              <span className="text-[10px] text-gray-300 line-clamp-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Click to apply
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};