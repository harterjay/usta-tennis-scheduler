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

      <div>
        {/* Image Upload Area */}
        <div className="w-full">
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
      </div>
    </div>
  );
}