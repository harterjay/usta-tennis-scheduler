
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

  return (
    <div className="w-full">
      <label htmlFor="schedule-input" className="block text-sm font-medium text-gray-700 mb-2">
        USTA Schedule Text
      </label>
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
  );
}