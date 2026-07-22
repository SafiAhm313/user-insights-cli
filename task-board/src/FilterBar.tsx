import type { Filter } from './types';

interface FilterBarProps {
  currentFilter: Filter;
  onFilterChange: (filter: Filter) => void;
}

function FilterBar({ currentFilter, onFilterChange }: FilterBarProps) {
  return (
    <div className="filter-bar">
      <button
        className={currentFilter === 'all' ? 'active' : ''}
        onClick={() => onFilterChange('all')}
      >
        All
      </button>
      <button
        className={currentFilter === 'active' ? 'active' : ''}
        onClick={() => onFilterChange('active')}
      >
        Active
      </button>
      <button
        className={currentFilter === 'completed' ? 'active' : ''}
        onClick={() => onFilterChange('completed')}
      >
        Completed
      </button>
    </div>
  );
}

export default FilterBar;