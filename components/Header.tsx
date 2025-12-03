import React from 'react';
import { AppMode } from '../types';
import { RefreshCcw, Calendar, Palette, Globe } from 'lucide-react';

interface HeaderProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentMode, onModeChange }) => {
  const tabs = [
    { id: AppMode.REVERSE, label: 'Reverse', icon: RefreshCcw },
    { id: AppMode.AGE, label: 'Age', icon: Calendar },
    { id: AppMode.STYLE, label: 'Style', icon: Palette },
    { id: AppMode.COUNTRY, label: 'Country', icon: Globe },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center font-bold text-white text-xl">
              R
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">REVERSE</span>
          </div>

          <nav className="flex items-center space-x-2 bg-gray-900/50 p-1.5 rounded-full border border-white/5 overflow-x-auto scrollbar-hide max-w-[60vw] sm:max-w-none">
            {tabs.map((tab) => {
              const isActive = currentMode === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onModeChange(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap
                    ${isActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}
                  `}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full shadow-lg opacity-90 -z-10" />
                  )}
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="w-10"></div> {/* Spacer for balance */}
        </div>
      </div>
    </header>
  );
};