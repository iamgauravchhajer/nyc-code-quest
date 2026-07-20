import { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Plus } from 'lucide-react';

export const SearchableSelect = ({ 
  options = [], 
  value, 
  onChange, 
  placeholder = 'Select option...', 
  onCreateNew, 
  createNewText = 'Create New' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options based on search query
  const filteredOptions = options.filter(opt => 
    opt.label?.toLowerCase().includes(search.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative w-full font-sans" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-left text-gray-700 cursor-pointer"
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu Popover */}
      {isOpen && (
        <div className="absolute left-0 right-0 z-40 mt-1.5 bg-white border border-gray-150 rounded-2xl shadow-xl animate-fade-down overflow-hidden">
          {/* Search Box inside dropdown */}
          <div className="relative p-2.5 border-b border-gray-100 bg-slate-50/50">
            <Search className="absolute left-5.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search options..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-250 rounded-lg text-xs focus:outline-none focus:border-indigo-500 transition-all font-medium"
              onClick={(e) => e.stopPropagation()} // Prevent closing dropdown on input click
            />
          </div>

          {/* Options List */}
          <div className="max-h-[160px] overflow-y-auto py-1 scroll-hide">
            {filteredOptions.map(opt => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-all hover:bg-slate-50 flex items-center justify-between cursor-pointer ${
                    isSelected ? 'text-indigo-600 bg-indigo-50/30' : 'text-gray-600'
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                </button>
              );
            })}

            {filteredOptions.length === 0 && (
              <p className="text-[11px] text-gray-400 text-center py-3 font-semibold">No options found</p>
            )}
          </div>

          {/* Create New Option Button */}
          {onCreateNew && (
            <button
              type="button"
              onClick={() => {
                onCreateNew();
                setIsOpen(false);
                setSearch('');
              }}
              className="w-full py-2.5 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border-t border-indigo-100 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              {createNewText}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
