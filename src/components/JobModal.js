import React from 'react';
import { formatPostedDate, formatExperience } from '../utils/jobUtils';

const JobModal = ({ job, isOpen, onClose, isSaved, onSaveJob, onApplyJob }) => {
  if (!isOpen || !job) return null;

  const handleSaveClick = () => {
    onSaveJob(job.id);
  };

  const handleApplyClick = () => {
    onApplyJob(job.applyUrl);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title-section">
            <h2 className="modal-job-title">{job.title}</h2>
            <div className="modal-company">{job.company}</div>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="modal-job-details">
            <div className="detail-row">
              <span className="detail-label">Location & Mode:</span>
              <span className="detail-value">{job.location} • {job.mode}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Experience:</span>
              <span className="detail-value">{formatExperience(job.experience)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Salary:</span>
              <span className="detail-value">{job.salaryRange}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Source:</span>
              <span className="detail-value source-badge">{job.source}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Posted:</span>
              <span className="detail-value">{formatPostedDate(job.postedDaysAgo)}</span>
            </div>
          </div>
          
          <div className="modal-description">
            <h3 className="section-title">Job Description</h3>
            <p className="description-text">{job.description}</p>
          </div>
          
          <div className="modal-skills">
            <h3 className="section-title">Required Skills</h3>
            <div className="skills-list">
              {job.skills.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button 
            className={`btn btn-secondary ${isSaved ? 'saved' : ''}`}
            onClick={handleSaveClick}
          >
            {isSaved ? 'Saved' : 'Save Job'}
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleApplyClick}
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobModal;