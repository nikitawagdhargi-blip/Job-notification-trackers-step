import React, { useState, useEffect } from 'react';
import { preferencesStorage, preferenceUtils } from '../utils/preferences';

const Settings = () => {
  const [preferences, setPreferences] = useState({
    roleKeywords: '',
    preferredLocations: [],
    preferredMode: [],
    experienceLevel: '',
    skills: '',
    minMatchScore: 40
  });
  
  const [errors, setErrors] = useState([]);
  const [isSaved, setIsSaved] = useState(false);

  // Load existing preferences on component mount
  useEffect(() => {
    const savedPreferences = preferencesStorage.getPreferences();
    if (savedPreferences) {
      setPreferences({
        roleKeywords: preferenceUtils.joinCommaSeparated(savedPreferences.roleKeywords) || '',
        preferredLocations: savedPreferences.preferredLocations || [],
        preferredMode: savedPreferences.preferredMode || [],
        experienceLevel: savedPreferences.experienceLevel || '',
        skills: preferenceUtils.joinCommaSeparated(savedPreferences.skills) || '',
        minMatchScore: savedPreferences.minMatchScore || 40
      });
    }
  }, []);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear saved status when user makes changes
    if (isSaved) setIsSaved(false);
  };

  // Handle checkbox changes for preferredMode
  const handleModeChange = (mode) => {
    setPreferences(prev => {
      const newModes = prev.preferredMode.includes(mode)
        ? prev.preferredMode.filter(m => m !== mode)
        : [...prev.preferredMode, mode];
      return {
        ...prev,
        preferredMode: newModes
      };
    });
    if (isSaved) setIsSaved(false);
  };

  // Handle location selection
  const handleLocationChange = (location) => {
    setPreferences(prev => {
      const newLocations = prev.preferredLocations.includes(location)
        ? prev.preferredLocations.filter(l => l !== location)
        : [...prev.preferredLocations, location];
      return {
        ...prev,
        preferredLocations: newLocations
      };
    });
    if (isSaved) setIsSaved(false);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Parse comma-separated values
    const parsedPreferences = {
      roleKeywords: preferenceUtils.parseCommaSeparated(preferences.roleKeywords),
      preferredLocations: preferences.preferredLocations,
      preferredMode: preferences.preferredMode,
      experienceLevel: preferences.experienceLevel,
      skills: preferenceUtils.parseCommaSeparated(preferences.skills),
      minMatchScore: preferences.minMatchScore
    };

    // Validate preferences
    const validation = preferenceUtils.validatePreferences(parsedPreferences);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Save to localStorage
    const success = preferencesStorage.savePreferences(parsedPreferences);
    
    if (success) {
      setErrors([]);
      setIsSaved(true);
      // Show success message briefly
      setTimeout(() => setIsSaved(false), 3000);
    } else {
      setErrors(['Failed to save preferences. Please try again.']);
    }
  };

  // Common locations for Indian tech jobs
  const commonLocations = [
    'Bangalore', 'Mumbai', 'Hyderabad', 'Pune', 'Chennai', 
    'Delhi', 'Noida', 'Gurgaon', 'Kolkata', 'Ahmedabad'
  ];

  return (
    <div className="page-container">
      <div className="page-content">
        <h1 className="page-heading">Preferences</h1>
        
        <form onSubmit={handleSubmit} className="settings-form">
          {errors.length > 0 && (
            <div className="error-messages">
              <ul>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          
          {isSaved && (
            <div className="success-message">
              Preferences saved successfully!
            </div>
          )}

          <div className="input-group">
            <label htmlFor="roleKeywords">Role Keywords *</label>
            <input 
              type="text" 
              id="roleKeywords" 
              value={preferences.roleKeywords}
              onChange={(e) => handleInputChange('roleKeywords', e.target.value)}
              placeholder="e.g., software engineer, frontend developer, data analyst"
              className="form-input"
            />
            <small className="help-text">Comma-separated keywords for roles you're interested in</small>
          </div>
          
          <div className="input-group">
            <label>Preferred Locations *</label>
            <div className="checkbox-group">
              {commonLocations.map(location => (
                <label key={location} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={preferences.preferredLocations.includes(location)}
                    onChange={() => handleLocationChange(location)}
                  />
                  {location}
                </label>
              ))}
            </div>
            <small className="help-text">Select all locations you're willing to work in</small>
          </div>
          
          <div className="input-group">
            <label>Preferred Work Mode *</label>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={preferences.preferredMode.includes('Remote')}
                  onChange={() => handleModeChange('Remote')}
                />
                Remote
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={preferences.preferredMode.includes('Hybrid')}
                  onChange={() => handleModeChange('Hybrid')}
                />
                Hybrid
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={preferences.preferredMode.includes('Onsite')}
                  onChange={() => handleModeChange('Onsite')}
                />
                Onsite
              </label>
            </div>
            <small className="help-text">Select your preferred work arrangements</small>
          </div>
          
          <div className="input-group">
            <label htmlFor="experienceLevel">Experience Level *</label>
            <select 
              id="experienceLevel"
              value={preferences.experienceLevel}
              onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
              className="form-select"
            >
              <option value="">Select experience level</option>
              <option value="Fresher">Fresher</option>
              <option value="0-1">0-1 Years</option>
              <option value="1-3">1-3 Years</option>
              <option value="3-5">3-5 Years</option>
            </select>
          </div>
          
          <div className="input-group">
            <label htmlFor="skills">Skills *</label>
            <input 
              type="text" 
              id="skills" 
              value={preferences.skills}
              onChange={(e) => handleInputChange('skills', e.target.value)}
              placeholder="e.g., React, JavaScript, Python, SQL"
              className="form-input"
            />
            <small className="help-text">Comma-separated technical skills you possess</small>
          </div>
          
          <div className="input-group">
            <label htmlFor="minMatchScore">Minimum Match Score: {preferences.minMatchScore}%</label>
            <input
              type="range"
              id="minMatchScore"
              min="0"
              max="100"
              value={preferences.minMatchScore}
              onChange={(e) => handleInputChange('minMatchScore', parseInt(e.target.value))}
              className="slider"
            />
            <small className="help-text">Jobs below this score will be filtered out when "Show only matches" is enabled</small>
          </div>
          
          <button type="submit" className="btn btn-primary">
            Save Preferences
          </button>
        </form>
        
        <p className="page-subtext">Your preferences will be used to calculate match scores for job recommendations.</p>
      </div>
    </div>
  );
};

export default Settings;