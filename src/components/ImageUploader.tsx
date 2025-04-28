'use client'

import { RiUploadCloudFill } from "react-icons/ri";
import React, { useState, useCallback, ChangeEvent } from 'react';
import { FaTimes } from 'react-icons/fa';

interface ImageUploaderProps {
  onImageSelect: (file: File | null) => void;
  supportedFormats?: string[];
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelect,
  supportedFormats = ['JPEG', 'JPG', 'PNG'],
  className = ''
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    
    if (file) {
      // Validate file type
      const fileExtension = file.name.split('.').pop()?.toUpperCase();
      if (fileExtension && supportedFormats.map(f => f.toUpperCase()).includes(fileExtension)) {
        setSelectedImage(file);
        onImageSelect(file);
        
        // Create preview URL
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        alert(`Unsupported file format. Please upload one of: ${supportedFormats.join(', ')}`);
      }
    }
  }, [onImageSelect, supportedFormats]);

  const handleRemoveImage = useCallback(() => {
    setSelectedImage(null);
    setPreviewUrl(null);
    onImageSelect(null);
  }, [onImageSelect]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0] || null;
    if (file) {
      const event = {
        target: {
          files: [file]
        }
      } as unknown as ChangeEvent<HTMLInputElement>;
      handleFileChange(event);
    }
  }, [handleFileChange]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <div className={`pt-6 px-24 ${className}`}>
      <div 
        className="border-2 border-dashed border-camouflage-300 rounded-lg w-full h-48 cursor-pointer flex flex-col justify-center items-center font-afacad hover:opacity-80 relative"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {previewUrl ? (
          <>
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage();
              }}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 z-10"
            >
              <FaTimes className="text-red-500" />
            </button>
          </>
        ) : (
          <>
            <input
              type="file"
              id="image-upload"
              accept={supportedFormats.map(f => `.${f.toLowerCase()}`).join(',')}
              className="hidden"
              onChange={handleFileChange}
            />
            <label htmlFor="image-upload" className="flex flex-col items-center cursor-pointer">
              <RiUploadCloudFill size={64} className="text-camouflage-400" />
              <h1 className="text-sm">
                Drop your image here or{" "}
                <span className="text-camouflage-400">Browse</span>
              </h1>
              <h1 className="text-neutral-500 text-sm pt-2">
                Support: {supportedFormats.join(', ')}
              </h1>
            </label>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;