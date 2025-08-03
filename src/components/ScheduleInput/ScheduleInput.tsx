
interface ScheduleInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function ScheduleInput({ value, onChange, placeholder }: ScheduleInputProps) {
  const defaultPlaceholder = `Paste your USTA schedule here...

Expected format (copy directly from USTA website):
Match ID    Schedule Date    Schedule Time    Home Team    Captain/Phone    Visiting Team    Captain/Phone    Facility/Match Site
1011235997
6/14/2025    8:30 AM    Chestnut Oaks Mercurio 3.5    Robert Mercurio    Woodlake McCoy 3.5    Dave McCoy    Chestnut Oaks Recreation Association

Alternative legacy format also supported:
Date: Saturday, March 15, 2025
Time: 10:00 AM
Opponent: Springfield Tennis Club
Location: Westfield Courts, 123 Tennis Ave`;

  const handleVideoClick = () => {
    // Open video in a new tab/window or show in modal
    window.open('/copying usta schedule.mp4', '_blank');
  };

  return (
    <div className="w-full">
      <div className="flex items-start justify-between mb-2">
        <label htmlFor="schedule-input" className="block text-sm font-medium text-gray-700">
          USTA Schedule Text
        </label>
        
        {/* Video Tutorial Link */}
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={handleVideoClick}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors group"
            type="button"
          >
            <div className="relative">
              {/* Video Thumbnail */}
              <div className="w-20 h-12 rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                <img 
                  src="/thumbnail_video.png" 
                  alt="Video tutorial thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all">
                <div className="w-6 h-6 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-3 h-3 text-blue-600 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">What data do I copy?</div>
              <div className="text-xs text-gray-500">Watch tutorial video</div>
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Text Input Area */}
        <div className="lg:col-span-2">
          <textarea
            id="schedule-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || defaultPlaceholder}
            className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y font-mono text-sm"
            rows={12}
          />
          <div className="mt-2 flex justify-between items-center text-sm text-gray-500">
            <span>{value.length} characters</span>
            <button
              onClick={() => onChange('')}
              className="text-red-600 hover:text-red-700 font-medium"
              type="button"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Help Section */}
        <div className="lg:col-span-1">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-3">Need Help?</h3>
            
            {/* Video Tutorial */}
            <button
              onClick={handleVideoClick}
              className="w-full mb-4 p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors group"
              type="button"
            >
              <div className="flex items-center space-x-3">
                <div className="relative w-12 h-8 rounded overflow-hidden flex-shrink-0">
                  <img 
                    src="/thumbnail_video.png" 
                    alt="Video tutorial thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-blue-900 group-hover:text-blue-700">
                    What data do I copy?
                  </div>
                  <div className="text-xs text-blue-600">
                    Watch tutorial video
                  </div>
                </div>
              </div>
            </button>

            {/* Quick Tips */}
            <div className="text-xs text-blue-800 space-y-2">
              <p><span className="font-medium">✓ Copy from USTA website:</span> Include the header row and all match data</p>
              <p><span className="font-medium">✓ Multiple formats supported:</span> 2, 3, or 4-line entries work</p>
              <p><span className="font-medium">✓ Teams with/without levels:</span> Both "Team 3.5" and "Team Name" work</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}