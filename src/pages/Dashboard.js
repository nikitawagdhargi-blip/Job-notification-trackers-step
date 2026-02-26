import React, { useState, useEffect } from 'react';
import jobsData from '../data/jobsData';
import { jobStorage, jobFilters } from '../utils/jobUtils';
import FilterBar from '../components/FilterBar';
import JobCard from '../components/JobCard';
import JobModal from '../components/JobModal';

const Dashboard = () => {
  const [jobs] = useState(jobsData);
  const [filteredJobs, setFilteredJobs] = useState(jobsData);
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    mode: '',
    experience: '',
    source: '',
    sortBy: 'latest'
  });
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Apply filters whenever filters or jobs change
  useEffect(() => {
    let result = [...jobs];
    
    // Apply all filters
    result = jobFilters.filterByKeyword(result, filters.keyword);
    result = jobFilters.filterByLocation(result, filters.location);
    result = jobFilters.filterByMode(result, filters.mode);
    result = jobFilters.filterByExperience(result, filters.experience);
    result = jobFilters.filterBySource(result, filters.source);
    result = jobFilters.sortJobs(result, filters.sortBy);
    
    setFilteredJobs(result);
  }, [jobs, filters]);

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

  const noResults = filteredJobs.length === 0;

  return (
    <div className="page-container">
      <div className="page-content">
        <h1 className="page-heading">Dashboard</h1>
        
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
              No jobs match your search criteria. Try adjusting your filters or search terms.
            </p>
          </div>
        ) : (
          <div className="job-cards-container">
            {filteredJobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
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