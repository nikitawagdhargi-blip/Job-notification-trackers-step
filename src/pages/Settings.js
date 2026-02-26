import React from 'react';

const Settings = () => {
  return (
    <div className="page-container">
      <div className="page-content">
        <h1 className="page-heading">Settings</h1>
        <div className="settings-form">
          <div className="input-group">
            <label htmlFor="keywords">Role Keywords</label>
            <input 
              type="text" 
              id="keywords" 
              placeholder="e.g., software engineer, frontend developer"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="locations">Preferred Locations</label>
            <input 
              type="text" 
              id="locations" 
              placeholder="e.g., New York, Remote, San Francisco"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="mode">Mode</label>
            <select id="mode">
              <option value="">Select work mode</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">Onsite</option>
            </select>
          </div>
          
          <div className="input-group">
            <label htmlFor="experience">Experience Level</label>
            <select id="experience">
              <option value="">Select experience level</option>
              <option value="entry">Entry Level</option>
              <option value="mid">Mid Level</option>
              <option value="senior">Senior Level</option>
              <option value="lead">Lead/Principal</option>
            </select>
          </div>
        </div>
        <p className="page-subtext">Preferences will be saved in the next step.</p>
      </div>
    </div>
  );
};

export default Settings;