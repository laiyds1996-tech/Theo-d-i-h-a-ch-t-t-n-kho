
import React from 'react';
import { ExportIcon } from './icons/ExportIcon';

interface SearchBarProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  filterDate: string;
  onFilterDateChange: (date: string) => void;
  onExportCSV: () => void;
  onExportPDF: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchTermChange,
  filterDate,
  onFilterDateChange,
  onExportCSV,
  onExportPDF,
}) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
      <div className="flex-grow w-full sm:w-auto">
        <input
          type="text"
          placeholder="Tìm theo tên..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex-grow w-full sm:w-auto">
        <input
          type="date"
          value={filterDate}
          onChange={(e) => onFilterDateChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          title="Lọc theo ngày hết hạn trước hoặc bằng..."
        />
      </div>
      <div className="flex gap-2">
        <button 
          onClick={onExportCSV} 
          className="flex items-center gap-2 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200"
        >
          <ExportIcon /> CSV
        </button>
        <button 
          onClick={onExportPDF}
          className="flex items-center gap-2 bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200"
        >
          <ExportIcon /> PDF
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
