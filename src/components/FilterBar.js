import React from 'react';
import { jobFilters } from '../utils/jobUtils';

const FilterBar = ({ 
  jobs, 
  filters, 
  onFilterChange, 
  onSortChange, 
  resultsCount 
}) => {
  const filterOptions = jobFilters.getFilterOptions(jobs);

  const handleFilterChange = (filterType, value) => {
    onFilterChange(filterType, value === `All ${filterType === 'locations' ? 'Locations' : filterType === 'modes' ? 'Modes' : filterType === 'experiences' ? 'Experience Levels' : 'Sources'}` ? '' : value);
  };

  return (
    <div className="filter-bar">
      <div className="filter-row">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search jobs by title or company..."
            value={filters.keyword}
            onChange={(e) => onFilterChange('keyword', e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <select
            value={filters.location}
            onChange={(e) => handleFilterChange('locations', e.target.value)}
            className="filter-select"
          >
            {filterOptions.locations.map(location => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <select
            value={filters.mode}
            onChange={(e) => handleFilterChange('modes', e.target.value)}
            className="filter-select"
          >
            {filterOptions.modes.map(mode => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="filter-row">
        <div className="filter-group">
          <select
            value={filters.experience}
            onChange={(e) => handleFilterChange('experiences', e.target.value)}
            className="filter-select"
          >
            {filterOptions.experiences.map(experience => (
              <option key={experience} value={experience}>
                {experience}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <select
            value={filters.source}
            onChange={(e) => handleFilterChange('sources', e.target.value)}
            className="filter-select"
          >
            {filterOptions.sources.map(source => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <select
            value={filters.sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="filter-select"
          >
            {filterOptions.sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="results-count">
        {resultsCount} job{resultsCount !== 1 ? 's' : ''} found
      </div>
    </div>
  );
};

export default FilterBar;