import React, { useState, useEffect } from 'react';
import jobsData from '../data/jobsData';
import { jobStorage, jobFilters } from '../utils/jobUtils';
import { preferencesStorage, matchScoreEngine } from '../utils/preferences';
import FilterBar from '../components/FilterBar';
import JobCard from '../components/JobCard';
import JobModal from '../components/JobModal';

const Dashboard = () => {
  const [jobs] = useState(jobsData);
  const [filteredJobs, setFilteredJobs] = useState(jobsData);
  const [preferences, setPreferences] = useState(null);
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    mode: '',
    experience: '',
    source: '',
    sortBy: 'latest'
  });
  const [showOnlyMatches, setShowOnlyMatches] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load preferences on component mount
  useEffect(() => {
    const savedPreferences = preferencesStorage.getPreferences();
    setPreferences(savedPreferences);
  }, []);

  // Apply filters whenever filters, jobs, preferences, or showOnlyMatches change
  useEffect(() => {
    let result = [...jobs];
    
    // Apply all filters
    result = jobFilters.filterByKeyword(result, filters.keyword);
    result = jobFilters.filterByLocation(result, filters.location);
    result = jobFilters.filterByMode(result, filters.mode);
    result = jobFilters.filterByExperience(result, filters.experience);
    result = jobFilters.filterBySource(result, filters.source);
    
    // Apply match score filtering if enabled
    if (showOnlyMatches && preferences) {
      result = result.filter(job => {
        const score = matchScoreEngine.calculateMatchScore(job, preferences);
        return score >= preferences.minMatchScore;
      });
    }
    
    // Apply sorting
    if (filters.sortBy === 'match-score' && preferences) {
      // Sort by match score (descending)
      result = result.sort((a, b) => {
        const scoreA = matchScoreEngine.calculateMatchScore(a, preferences);
        const scoreB = matchScoreEngine.calculateMatchScore(b, preferences);
        return scoreB - scoreA;
      });
    } else {
      result = jobFilters.sortJobs(result, filters.sortBy);
    }
    
    setFilteredJobs(result);
  }, [jobs, filters, preferences, showOnlyMatches]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleSortChange = (sortBy) => {
    setFilters(prev => ({
      ...prev,
      sortBy
    }));
  };

  const handleSaveJob = (jobId) => {
    const isCurrentlySaved = jobStorage.isJobSaved(jobId);
    if (isCurrentlySaved) {
      jobStorage.unsaveJob(jobId);
    } else {
      jobStorage.saveJob(jobId);
    }
    // Force re-render by updating state
    setFilteredJobs([...filteredJobs]);
  };

  const handleViewJob = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleApplyJob = (applyUrl) => {
    window.open(applyUrl, '_blank');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const toggleShowOnlyMatches = () => {
    setShowOnlyMatches(!showOnlyMatches);
  };

  const noResults = filteredJobs.length === 0;
  const hasPreferences = !!preferences;

  // Calculate match scores for display
  const jobsWithScores = filteredJobs.map(job => ({
    ...job,
    matchScore: hasPreferences ? matchScoreEngine.calculateMatchScore(job, preferences) : undefined
  }));

  return (
    <div className="page-container">
      <div className="page-content">
        <h1 className="page-heading">Dashboard</h1>
        
        {!hasPreferences && (
          <div className="preferences-banner">
            <p>Set your preferences to activate intelligent matching.</p>
          </div>
        )}
        
        <div className="match-toggle-container">
          <label className="match-toggle-label">
            Show only jobs above my threshold
          </label>
          <label className="match-toggle">
            <input
              type="checkbox"
              checked={showOnlyMatches}
              onChange={toggleShowOnlyMatches}
              disabled={!hasPreferences}
            />
            <span className="match-toggle-slider"></span>
          </label>
        </div>
        
        <FilterBar
          jobs={jobs}
          filters={filters}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          resultsCount={filteredJobs.length}
        />
        
        {noResults ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h2 className="empty-state-title">No Jobs Found</h2>
            <p className="empty-state-message">
              {hasPreferences 
                ? "No roles match your criteria. Adjust filters or lower threshold."
                : "No jobs match your search criteria. Try adjusting your filters or search terms."
              }
            </p>
          </div>
        ) : (
          <div className="job-cards-container">
            {jobsWithScores.map(job => (
              <JobCard
                key={job.id}
                job={job}
                matchScore={job.matchScore}
                isSaved={jobStorage.isJobSaved(job.id)}
                onSaveJob={handleSaveJob}
                onViewJob={handleViewJob}
                onApplyJob={handleApplyJob}
              />
            ))}
          </div>
        )}
        
        <JobModal
          job={selectedJob}
          isOpen={isModalOpen}
          onClose={closeModal}
          isSaved={selectedJob ? jobStorage.isJobSaved(selectedJob.id) : false}
          onSaveJob={handleSaveJob}
          onApplyJob={handleApplyJob}
        />
      </div>
    </div>
  );
};

export default Dashboard;