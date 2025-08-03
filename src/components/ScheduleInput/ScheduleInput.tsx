
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
    // Open video in a new window (not fullscreen) so users remember to return
    window.open('/full demo - usta scheduler.mp4', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
  };

  return (
    <div className="w-full">
      <label htmlFor="schedule-input" className="block text-sm font-medium text-gray-700 mb-2">
        USTA Schedule Text
      </label>
      
      <div className="flex gap-4">
        {/* Text Input Area */}
        <div className="w-4/5">
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

        {/* Video Tutorial - Small and to the right */}
        <div className="w-1/5 flex justify-center">
          <button
            onClick={handleVideoClick}
            className="flex flex-col items-center text-blue-600 hover:text-blue-700 transition-colors group"
            type="button"
          >
            <div className="relative mb-2">
              {/* Small Video Thumbnail */}
              <div className="w-12 h-8 rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                <img 
                  src="/thumbnail_video.png" 
                  alt="Video tutorial thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all">
                <div className="w-3 h-3 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-1.5 h-1.5 text-blue-600 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="text-center text-xs">
              <div className="font-medium">What data do I copy?</div>
              <div className="text-gray-500">Watch tutorial</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}