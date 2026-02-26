import React, { useState } from 'react';
import { statusStorage, JOB_STATUS, STATUS_COLORS } from '../utils/jobStatus';
import { useToast } from '../components/ToastProvider';

const JobCard = ({ job, matchScore, showMatchScore = true, onApplyClick }) => {
  const [jobStatus, setJobStatus] = useState(() => statusStorage.getStatus(job.id));
  const { showToast } = useToast();

  const handleStatusChange = (newStatus) => {
    if (statusStorage.setStatus(job.id, newStatus)) {
      setJobStatus(newStatus);
      showToast(`Status updated: ${newStatus}`, 'success');
    } else {
      showToast('Failed to update status', 'error');
    }
  };

  const handleApplyClick = (e) => {
    e.stopPropagation();
    if (onApplyClick) {
      onApplyClick(job);
    }
    // Also update status to Applied when applying
    handleStatusChange(JOB_STATUS.APPLIED);
  };

  const handleSaveToggle = (e) => {
    e.stopPropagation();
    // Implementation would depend on existing saved jobs logic
    // This is a placeholder for the save functionality
  };

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div className="job-title-section">
          <h3 className="job-title">{job.title}</h3>
          <div className="job-company-location">
            <span className="job-company">{job.company}</span>
            <span className="job-location">{job.location}</span>
          </div>
        </div>
        <div className="job-actions">
          <button 
            className="btn-icon save-btn"
            onClick={handleSaveToggle}
            title="Save job"
          >
            <span className="save-icon">☆</span>
          </button>
        </div>
      </div>
      
      <div className="job-details">
        <div className="job-meta">
          <span className="job-experience">{job.experience}</span>
          <span className="job-salary">{job.salary}</span>
          <span className="job-posted">{job.postedDaysAgo}d ago</span>
        </div>
        
        {showMatchScore && matchScore !== undefined && (
          <div className={`score-badge ${getScoreBadgeClass(matchScore)}`}>
            {getScoreBadgeText(matchScore)}
          </div>
        )}
        
        {/* Status Badge */}
        <div className={`status-badge ${STATUS_COLORS[jobStatus]}`}>
          {jobStatus}
        </div>
      </div>
      
      <div className="job-description">
        <p>{job.description}</p>
      </div>
      
      {/* Status Button Group */}
      <div className="status-button-group">
        <button 
          className={`btn btn-sm ${jobStatus === JOB_STATUS.NOT_APPLIED ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => handleStatusChange(JOB_STATUS.NOT_APPLIED)}
        >
          {JOB_STATUS.NOT_APPLIED}
        </button>
        <button 
          className={`btn btn-sm ${jobStatus === JOB_STATUS.APPLIED ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => handleStatusChange(JOB_STATUS.APPLIED)}
        >
          {JOB_STATUS.APPLIED}
        </button>
        <button 
          className={`btn btn-sm ${jobStatus === JOB_STATUS.REJECTED ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => handleStatusChange(JOB_STATUS.REJECTED)}
        >
          {JOB_STATUS.REJECTED}
        </button>
        <button 
          className={`btn btn-sm ${jobStatus === JOB_STATUS.SELECTED ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => handleStatusChange(JOB_STATUS.SELECTED)}
        >
          {JOB_STATUS.SELECTED}
        </button>
      </div>
      
      <div className="job-footer">
        <div className="job-skills">
          {job.skills.slice(0, 3).map((skill, index) => (
            <span key={index} className="skill-tag">{skill}</span>
          ))}
          {job.skills.length > 3 && (
            <span className="skill-tag">+{job.skills.length - 3} more</span>
          )}
        </div>
        <button 
          className="btn btn-primary btn-sm apply-btn"
          onClick={handleApplyClick}
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

// Helper functions for score badges
const getScoreBadgeClass = (score) => {
  if (score >= 80) return 'score-green';
  if (score >= 60) return 'score-amber';
  if (score >= 40) return 'score-neutral';
  return 'score-grey';
};

const getScoreBadgeText = (score) => {
  return `${score}% match`;
};

export default JobCard;