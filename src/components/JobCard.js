import React from 'react';
import { formatPostedDate, formatExperience } from '../utils/jobUtils';

const JobCard = ({ job, isSaved, onSaveJob, onViewJob, onApplyJob }) => {
  const handleSaveClick = (e) => {
    e.stopPropagation();
    onSaveJob(job.id);
  };

  const handleViewClick = (e) => {
    e.stopPropagation();
    onViewJob(job);
  };

  const handleApplyClick = (e) => {
    e.stopPropagation();
    onApplyJob(job.applyUrl);
  };

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div className="job-title">{job.title}</div>
        <div className="job-company">{job.company}</div>
      </div>
      
      <div className="job-card-body">
        <div className="job-meta">
          <span className="job-location-mode">
            {job.location} • {job.mode}
          </span>
          <span className="job-experience">
            {formatExperience(job.experience)}
          </span>
          <span className="job-salary">{job.salaryRange}</span>
        </div>
        
        <div className="job-source-badge">
          {job.source}
        </div>
        
        <div className="job-posted">
          {formatPostedDate(job.postedDaysAgo)}
        </div>
      </div>
      
      <div className="job-card-footer">
        <button 
          className={`btn btn-secondary ${isSaved ? 'saved' : ''}`}
          onClick={handleSaveClick}
        >
          {isSaved ? 'Saved' : 'Save'}
        </button>
        <button 
          className="btn btn-secondary"
          onClick={handleViewClick}
        >
          View
        </button>
        <button 
          className="btn btn-primary"
          onClick={handleApplyClick}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default JobCard;