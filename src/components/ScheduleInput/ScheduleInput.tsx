
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
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-primary-900 mb-2">📋 USTA Schedule Text</h3>
        <div className="text-primary-600 text-left max-w-2xl mx-auto">
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Go to tennislink.usta.com and login</li>
            <li>Select the appropriate team you are registered for</li>
            <li>Click the Match Schedule tab</li>
            <li>Highlight the data in the table including the header (starting with 'Match ID' and ending with the last row / last column)</li>
            <li>Copy</li>
            <li>Paste in the text box below</li>
          </ol>
        </div>
      </div>
      
      <div className="flex gap-6">
        {/* Text Input Area */}
        <div className="w-4/5">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/30">
            <textarea
              id="schedule-input"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || defaultPlaceholder}
              className="w-full h-80 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-primary-200 text-primary-900 placeholder-primary-500 resize-none focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-300"
              rows={20}
            />
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
                {/* Enhanced Video Thumbnail */}
                <div className="w-16 h-12 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 border-2 border-indigo-200 group-hover:border-indigo-300 group-hover:scale-105">
                  <img 
                    src="/thumbnail_video.png" 
                    alt="Video tutorial thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Play button overlay */}
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