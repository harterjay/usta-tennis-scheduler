import { useState, useCallback } from 'react';

interface ImageUploadProps {
  onImageSelect: () => void;
  onImageAnalyze: (file: File) => Promise<void>;
  isAnalyzing: boolean;
}

export default function ImageUpload({ onImageSelect, onImageAnalyze, isAnalyzing }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, []);

  const handleFile = useCallback((file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, etc.)');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image file size must be less than 10MB');
      return;
    }

    setSelectedImage(file);
    onImageSelect();

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [onImageSelect]);

  const handleAnalyze = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Analyze button clicked', { selectedImage, isAnalyzing });
    
    if (selectedImage && !isAnalyzing) {
      try {
        await onImageAnalyze(selectedImage);
      } catch (error) {
        console.error('Error in handleAnalyze:', error);
      }
    }
  };

  const handleVideoClick = () => {
    // Open video in a new window for tutorial
    window.open('/full demo - usta scheduler.mp4', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-primary-900 mb-2">📸 Upload Schedule Image</h3>
        <div className="text-primary-600 text-left max-w-2xl mx-auto">
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Go to tennislink.usta.com and login</li>
            <li>Navigate to your team's Match Schedule</li>
            <li>Take a screenshot of the schedule table (including headers)</li>
            <li>Upload the screenshot below</li>
            <li>Click "Analyze Schedule" to extract match data</li>
          </ol>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Image Upload Area */}
        <div className="w-4/5">
          <div 
            className={`relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-dashed transition-all duration-300 ${
              dragActive 
                ? 'border-accent-500 bg-accent-50/50' 
                : 'border-primary-300 hover:border-primary-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {!selectedImage && (
              <input
                type="file"
                id="image-upload"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleChange}
                accept="image/*"
                disabled={isAnalyzing}
              />
            )}
            
            {!selectedImage ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 text-primary-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 48 48" aria-hidden="true">
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="text-lg font-medium text-primary-900 mb-2">
                  Drop your schedule image here
                </p>
                <p className="text-sm text-primary-600 mb-4">
                  or click to browse files
                </p>
                <p className="text-xs text-primary-500">
                  Supports PNG, JPG, GIF up to 10MB
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {previewUrl && (
                  <div className="relative">
                    <img 
                      src={previewUrl} 
                      alt="Schedule preview" 
                      className="max-w-full max-h-64 mx-auto rounded-lg shadow-md object-contain"
                    />
                    <button
                      onClick={() => {
                        setSelectedImage(null);
                        setPreviewUrl(null);
                        if (previewUrl) URL.revokeObjectURL(previewUrl);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                      disabled={isAnalyzing}
                    >
                      ✕
                    </button>
                  </div>
                )}
                
                <div className="text-center">
                  <p className="text-sm text-primary-700 mb-3">
                    Image ready: {selectedImage.name}
                  </p>
                  
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                        isAnalyzing
                          ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                          : 'bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                      }`}
                      type="button"
                    >
                      {isAnalyzing ? (
                        <>
                          <span className="inline-block animate-spin mr-2">⏳</span>
                          Analyzing Schedule...
                        </>
                      ) : (
                        '🔍 Analyze Schedule'
                      )}
                    </button>
                    
                    <label 
                      htmlFor="file-replace"
                      className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-colors cursor-pointer"
                    >
                      📁 Change Image
                    </label>
                    <input
                      id="file-replace" 
                      type="file"
                      className="hidden"
                      onChange={handleChange}
                      accept="image/*"
                      disabled={isAnalyzing}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Video Tutorial - Small and to the right */}
        <div className="w-1/5 flex justify-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/30 h-fit">
            <button
              onClick={handleVideoClick}
              className="w-full flex flex-col items-center text-indigo-600 hover:text-indigo-700 transition-all duration-300 group"
              type="button"
            >
              <div className="relative mb-3">
                <div className="w-16 h-12 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 border-2 border-indigo-200 group-hover:border-indigo-300 group-hover:scale-105">
                  <img 
                    src="/thumbnail_video.png" 
                    alt="Video tutorial thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-all rounded-xl">
                  <div className="w-4 h-4 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-2 h-2 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="text-center text-xs">
                <div className="font-bold text-slate-900 mb-1">Need Help?</div>
                <div className="text-indigo-600 bg-indigo-100/80 backdrop-blur-sm px-2 py-1 rounded-lg font-medium border border-indigo-200/50">
                  Watch Tutorial
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}