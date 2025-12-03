import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface IntroProps {
  onComplete: () => void;
}

export const Intro: React.FC<IntroProps> = ({ onComplete }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onComplete, 800); // Wait for exit animation
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-dark-bg transition-transform duration-700 ease-in-out ${exiting ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <div className="text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-purple/20 rounded-full blur-[100px] animate-pulse"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="animate-float mb-6">
            <Sparkles size={64} className="text-neon-purple" />
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-4 animate-fade-in">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-neon-pink to-neon-purple bg-[length:200%_auto] animate-[gradient_3s_linear_infinite]">
              REVERSE
            </span>
          </h1>
          <p className="text-xl text-gray-400 tracking-widest uppercase animate-slide-up" style={{ animationDelay: '0.3s' }}>
            Transform Reality
          </p>
          
          <div className="mt-12 flex space-x-2 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="w-2 h-2 rounded-full bg-neon-purple animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 rounded-full bg-neon-purple animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 rounded-full bg-neon-purple animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
