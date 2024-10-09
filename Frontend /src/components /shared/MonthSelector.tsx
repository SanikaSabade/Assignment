// src/components/shared/MonthSelector.tsx
import { Calendar } from 'lucide-react';

interface MonthSelectorProps {
  selectedMonth: string;
  onChange: (month: string) => void;
}

const MonthSelector = ({ selectedMonth, onChange }: MonthSelectorProps) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="flex items-center gap-2">
      <Calendar className="w-5 h-5 text-gray-500" />
      <select
        value={selectedMonth}
        onChange={(e) => onChange(e.target.value)}
        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 
          focus:ring-blue-500/20 focus:border-blue-500"
      >
        {months.map(month => (
          <option key={month} value={month}>{month}</option>
        ))}
      </select>
    </div>
  );
};

export default MonthSelector;