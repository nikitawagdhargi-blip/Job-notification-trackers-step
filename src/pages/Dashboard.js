import React, { useState, useEffect } from 'react';
import jobsData from '../data/jobsData';
import { preferencesStorage } from '../utils/preferences';
import { matchScoreEngine } from '../utils/preferences';
import { statusFilter, statusStorage } from '../utils/jobStatus';
import FilterBar from '../components/FilterBar';
import JobCard from '../components/JobCard';
import JobModal from '../components/JobModal';

const Dashboard = () => {
  const [jobs, setJobs] = useState([...jobsData]);
  const [filteredJobs, setFilteredJobs] = useState([...jobsData]);
  const [preferences, setPreferences] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showMatchesOnly, setShowMatchesOnly] = useState(false);
  const [statusFilterValue, setStatusFilterValue] = useState('All');
  const [hasPreferences, setHasPreferences] = useState(false);

  // Load preferences on component mount
  useEffect(() => {
    const savedPreferences = preferencesStorage.getPreferences();
    setPreferences(savedPreferences);
    setHasPreferences(!!savedPreferences);
  }, []);

  // Apply all filters including status filter
  useEffect(() => {
    let result = [...jobs];
    
    // Apply existing filters (keyword, location, mode, etc.)
    // This would typically come from FilterBar component
    // For now, we'll apply the status filter
    
    // Apply status filter
    result = statusFilter.applyStatusFilter(result, statusFilterValue);
    
    // Apply match filtering if enabled
    if (showMatchesOnly && hasPreferences) {
      result = result.filter(job => {
        const matchScore = matchScoreEngine.calculateMatchScore(job, preferences);
        return matchScore >= preferences.minMatchScore;
      });
    }
    
    setFilteredJobs(result);
  }, [jobs, showMatchesOnly, preferences, hasPreferences, statusFilterValue]);

  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
  };

  const handleApplyJob = (job) => {
    window.open(job.applyUrl, '_blank');
  };

  const handleStatusFilterChange = (newStatusFilter) => {
    setStatusFilterValue(newStatusFilter);
  };

  // Jobs with match scores
  const jobsWithScores = filteredJobs.map(job => ({
    ...job,
    matchScore: hasPreferences ? matchScoreEngine.calculateMatchScore(job, preferences) : undefined
  }));

  return (
    <div className="page-container">
      <div className="page-content">
        <h1 className="page-heading">Dashboard</h1>
        <p className="page-subtext">Track your job applications and find your perfect match.</p>
        
        <FilterBar 
          onFilterChange={(filters) => {
            // Handle filter changes from FilterBar
            // This would integrate with the existing filtering logic
          }}
          showMatchesOnly={showMatchesOnly}
          onShowMatchesOnlyChange={setShowMatchesOnly}
          statusFilter={statusFilterValue}
          onStatusFilterChange={handleStatusFilterChange}
          statusFilterOptions={statusFilter.getStatusOptions()}
        />
        
        <div className="jobs-grid">
          {jobsWithScores.map(job => (
            <JobCard
              key={job.id}
              job={job}
              matchScore={job.matchScore}
              onApplyClick={handleApplyJob}
            />
          ))}
        </div>
        
        {jobsWithScores.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h2 className="empty-state-title">No Jobs Found</h2>
            <p className="empty-state-message">
              Try adjusting your filters or check back later for new opportunities.
            </p>
          </div>
        )}
      </div>
      
      {selectedJob && (
        <JobModal 
          job={selectedJob}
          onClose={handleCloseModal}
          onApply={handleApplyJob}
        />
      )}
    </div>
  );
};

export default Dashboard;