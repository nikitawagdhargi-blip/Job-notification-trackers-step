import React, { useState } from 'react';
import { jobUtils } from '../utils/jobUtils';

const FilterBar = ({ 
  onFilterChange, 
  showMatchesOnly, 
  onShowMatchesOnlyChange,
  statusFilter,
  onStatusFilterChange,
  statusFilterOptions
}) => {
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    mode: '',
    experience: '',
    source: '',
    sortBy: 'Latest'
  });

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleStatusFilterChange = (value) => {
    onStatusFilterChange(value);
  };

  const locations = jobUtils.getUniqueValues('location');
  const modes = ['Remote', 'Hybrid', 'Onsite'];
  const experiences = ['Fresher', '0-1 years', '1-3 years', '3-5 years', '5+ years'];
  const sources = ['LinkedIn', 'Naukri', 'Indeed', 'AngelList'];
  const sortByOptions = ['Latest', 'Match Score', 'Salary'];

  return (
    <div className="filter-bar">
      <div className="filter-row">
        <div className="filter-group">
          <label htmlFor="keyword-filter" className="filter-label">Keyword</label>
          <input
            id="keyword-filter"
            type="text"
            className="filter-input"
            placeholder="Search by title or company"
            value={filters.keyword}
            onChange={(e) => handleFilterChange('keyword', e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="location-filter" className="filter-label">Location</label>
          <select
            id="location-filter"
            className="filter-select"
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
          >
            <option value="">All Locations</option>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="mode-filter" className="filter-label">Mode</label>
          <select
            id="mode-filter"
            className="filter-select"
            value={filters.mode}
            onChange={(e) => handleFilterChange('mode', e.target.value)}
          >
            <option value="">All Modes</option>
            {modes.map(mode => (
              <option key={mode} value={mode}>{mode}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="experience-filter" className="filter-label">Experience</label>
          <select
            id="experience-filter"
            className="filter-select"
            value={filters.experience}
            onChange={(e) => handleFilterChange('experience', e.target.value)}
          >
            <option value="">All Levels</option>
            {experiences.map(exp => (
              <option key={exp} value={exp}>{exp}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="source-filter" className="filter-label">Source</label>
          <select
            id="source-filter"
            className="filter-select"
            value={filters.source}
            onChange={(e) => handleFilterChange('source', e.target.value)}
          >
            <option value="">All Sources</option>
            {sources.map(source => (
              <option key={source} value={source}>{source}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="sort-filter" className="filter-label">Sort By</label>
          <select
            id="sort-filter"
            className="filter-select"
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            {sortByOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        
        {/* Status Filter */}
        <div className="filter-group">
          <label htmlFor="status-filter" className="filter-label">Status</label>
          <select
            id="status-filter"
            className="filter-select"
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
          >
            {statusFilterOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="filter-actions">
        <label className="toggle-container">
          <input
            type="checkbox"
            checked={showMatchesOnly}
            onChange={(e) => onShowMatchesOnlyChange(e.target.checked)}
          />
          <span className="toggle-slider"></span>
          Show only matches
        </label>
      </div>
    </div>
  );
};

export default FilterBar;