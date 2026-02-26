import React, { useState, useEffect } from 'react';
import jobsData from '../data/jobsData';
import { jobStorage } from '../utils/jobUtils';
import JobCard from '../components/JobCard';
import JobModal from '../components/JobModal';

const Saved = () => {
  const [jobs] = useState(jobsData);
  const [savedJobs, setSavedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load saved jobs from localStorage on component mount
  useEffect(() => {
    const savedJobObjects = jobStorage.getSavedJobObjects(jobs);
    setSavedJobs(savedJobObjects);
  }, [jobs]);

  const handleSaveJob = (jobId) => {
    const isCurrentlySaved = jobStorage.isJobSaved(jobId);
    if (isCurrentlySaved) {
      jobStorage.unsaveJob(jobId);
    } else {
      jobStorage.saveJob(jobId);
    }
    // Update the saved jobs list
    const savedJobObjects = jobStorage.getSavedJobObjects(jobs);
    setSavedJobs(savedJobObjects);
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

  const isEmpty = savedJobs.length === 0;

  return (
    <div className="page-container">
      <div className="page-content">
        <h1 className="page-heading">Saved Jobs</h1>
        
        {isEmpty ? (
          <div className="empty-state">
            <div className="empty-state-icon">💾</div>
            <h2 className="empty-state-title">No Saved Jobs</h2>
            <p className="empty-state-message">
              You haven't saved any jobs yet. Jobs you like will appear here for easy reference.
            </p>
          </div>
        ) : (
          <div>
            <p className="page-subtext">
              {savedJobs.length} saved job{savedJobs.length !== 1 ? 's' : ''}
            </p>
            <div className="job-cards-container">
              {savedJobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSaved={true}
                  onSaveJob={handleSaveJob}
                  onViewJob={handleViewJob}
                  onApplyJob={handleApplyJob}
                />
              ))}
            </div>
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

export default Saved;