import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface FileUploadProps {
  onImageSelect: (base64: string) => void;
  label?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onImageSelect, label = "Upload Image" }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageSelect(result);
    };
    reader.readAsDataURL(file);
  }, [onImageSelect]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={`relative group cursor-pointer w-full h-64 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center
        ${isDragging 
          ? 'border-neon-purple bg-neon-purple/10' 
          : 'border-gray-600 hover:border-neon-purple hover:bg-gray-800/50 bg-dark-card'
        }`}
    >
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files && e.target.files[0] && handleFile(e.target.files[0])}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      
      <div className="flex flex-col items-center space-y-4 text-gray-400 group-hover:text-neon-purple transition-colors">
        <div className={`p-4 rounded-full bg-gray-800 group-hover:bg-neon-purple/20 transition-all ${isDragging ? 'scale-110' : ''}`}>
          {isDragging ? <ImageIcon size={32} /> : <Upload size={32} />}
        </div>
        <div className="text-center">
          <p className="text-lg font-medium">{label}</p>
          <p className="text-sm opacity-70 mt-1">Drag & drop or click to browse</p>
        </div>
      </div>
    </div>
  );
};
