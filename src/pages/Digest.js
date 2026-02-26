import React, { useState, useEffect } from 'react';
import { preferencesStorage } from '../utils/preferences';
import { digestStorage, digestEngine } from '../utils/digest';
import { statusHistory } from '../utils/jobStatus';
import jobsData from '../data/jobsData';

const Digest = () => {
  const [preferences, setPreferences] = useState(null);
  const [digest, setDigest] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [recentStatusUpdates, setRecentStatusUpdates] = useState([]);

  // Load preferences and check for existing digest on component mount
  useEffect(() => {
    const savedPreferences = preferencesStorage.getPreferences();
    setPreferences(savedPreferences);
    
    // Check if digest already exists for today
    const existingDigest = digestStorage.getTodaysDigest();
    if (existingDigest) {
      setDigest(existingDigest);
    }
    
    // Load recent status updates
    const updates = statusHistory.getRecentUpdatesWithJobs(jobsData);
    setRecentStatusUpdates(updates);
  }, []);

  // Handle digest generation
  const handleGenerateDigest = () => {
    if (!preferences) {
      setError('Set preferences to generate a personalized digest.');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const newDigest = digestEngine.generateTodaysDigest(preferences);
      setDigest(newDigest);
      
      // Refresh status updates after digest generation
      const updates = statusHistory.getRecentUpdatesWithJobs(jobsData);
      setRecentStatusUpdates(updates);
    } catch (err) {
      setError('Failed to generate digest. Please try again.');
      console.error('Digest generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle copy to clipboard
  const handleCopyToClipboard = () => {
    if (!digest) return;
    
    const formattedDigest = digestEngine.formatDigestForSharing(digest);
    navigator.clipboard.writeText(formattedDigest)
      .then(() => {
        // Show success feedback
        const originalText = document.querySelector('.copy-btn')?.textContent;
        const copyBtn = document.querySelector('.copy-btn');
        if (copyBtn) {
          copyBtn.textContent = 'Copied!';
          setTimeout(() => {
            copyBtn.textContent = 'Copy Digest to Clipboard';
          }, 2000);
        }
      })
      .catch(err => {
        console.error('Failed to copy to clipboard:', err);
      });
  };

  // Handle create email draft
  const handleCreateEmailDraft = () => {
    if (!digest) return;
    
    const formattedDigest = digestEngine.formatDigestForSharing(digest);
    const subject = encodeURIComponent('My 9AM Job Digest');
    const body = encodeURIComponent(formattedDigest);
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
    
    window.open(mailtoLink, '_blank');
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format timestamp for status updates
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Check states
  const hasPreferences = !!preferences;
  const hasDigest = !!digest;
  const hasJobs = hasDigest && digest.jobs && digest.jobs.length > 0;
  const hasStatusUpdates = recentStatusUpdates.length > 0;

  return (
    <div className="page-container">
      <div className="page-content">
        <h1 className="page-heading">Daily Digest</h1>
        <p className="page-subtext">Your personalized job summary will arrive daily at 9AM. Set your preferences in Settings to get started.</p>
        
        {/* Error message */}
        {error && (
          <div className="error-banner">
            <p>{error}</p>
          </div>
        )}
        
        {/* No preferences state */}
        {!hasPreferences && !hasDigest && (
          <div className="empty-state">
            <div className="empty-state-icon">⚙️</div>
            <h2 className="empty-state-title">Set Preferences First</h2>
            <p className="empty-state-message">
              Set your preferences in the Settings page to generate a personalized digest.
            </p>
          </div>
        )}
        
        {/* No matches found state */}
        {hasPreferences && !hasDigest && (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h2 className="empty-state-title">No Matching Roles Today</h2>
            <p className="empty-state-message">
              No jobs match your criteria today. Check again tomorrow or adjust your preferences.
            </p>
          </div>
        )}
        
        {/* Generate button */}
        {hasPreferences && !hasDigest && (
          <div className="generate-section">
            <button 
              className="btn btn-primary generate-btn"
              onClick={handleGenerateDigest}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : "Generate Today's 9AM Digest (Simulated)"}
            </button>
            <p className="simulation-note">Demo Mode: Daily 9AM trigger simulated manually.</p>
          </div>
        )}
        
        {/* Digest display */}
        {hasDigest && (
          <div className="digest-container">
            <div className="digest-card">
              <div className="digest-header">
                <h2 className="digest-title">Top 10 Jobs For You — 9AM Digest</h2>
                <p className="digest-date">{formatDate(digest.date)}</p>
              </div>
              
              <div className="digest-content">
                {hasJobs ? (
                  <div className="jobs-list">
                    {digest.jobs.map((job, index) => (
                      <div key={job.id} className="job-item">
                        <div className="job-rank">{index + 1}</div>
                        <div className="job-details">
                          <h3 className="job-title">{job.title}</h3>
                          <div className="job-meta">
                            <span className="job-company">{job.company}</span>
                            <span className="job-location">{job.location}</span>
                            <span className="job-experience">{job.experience}</span>
                            <span className={`score-badge ${digestEngine.getScoreBadgeClass(job.matchScore)}`}>
                              {digestEngine.getScoreBadgeText(job.matchScore)}
                            </span>
                          </div>
                          <button 
                            className="btn btn-primary apply-btn"
                            onClick={() => window.open(job.applyUrl, '_blank')}
                          >
                            Apply Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-jobs-message">
                    <p>No matching roles found for today. Check again tomorrow.</p>
                  </div>
                )}
              </div>
              
              <div className="digest-footer">
                <p>This digest was generated based on your preferences.</p>
                <div className="action-buttons">
                  <button 
                    className="btn btn-secondary copy-btn"
                    onClick={handleCopyToClipboard}
                    disabled={!hasJobs}
                  >
                    Copy Digest to Clipboard
                  </button>
                  <button 
                    className="btn btn-secondary email-btn"
                    onClick={handleCreateEmailDraft}
                    disabled={!hasJobs}
                  >
                    Create Email Draft
                  </button>
                </div>
              </div>
            </div>
            
            <p className="simulation-note">Demo Mode: Daily 9AM trigger simulated manually.</p>
          </div>
        )}
        
        {/* Recent Status Updates Section */}
        <div className="status-updates-section">
          <h3 className="section-title">Recent Status Updates</h3>
          {hasStatusUpdates ? (
            <div className="status-updates-list">
              {recentStatusUpdates.slice(0, 10).map((update) => (
                <div key={update.id} className="status-update-item">
                  <div className="update-header">
                    <h4 className="job-title">{update.jobTitle}</h4>
                    <span className="update-timestamp">{formatTimestamp(update.timestamp)}</span>
                  </div>
                  <div className="update-details">
                    <span className="company">{update.company}</span>
                    <span className="status-badge">{update.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <h2 className="empty-state-title">No Status Updates Yet</h2>
              <p className="empty-state-message">
                Update job statuses on the Dashboard to see recent changes here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Digest;