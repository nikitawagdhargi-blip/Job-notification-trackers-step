// Preferences storage utilities
const PREFERENCES_KEY = 'jobTrackerPreferences';

export const preferencesStorage = {
  // Get preferences from localStorage
  getPreferences: () => {
    try {
      const saved = localStorage.getItem(PREFERENCES_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error reading preferences from localStorage:', error);
      return null;
    }
  },

  // Save preferences to localStorage
  savePreferences: (preferences) => {
    try {
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
      return true;
    } catch (error) {
      console.error('Error saving preferences to localStorage:', error);
      return false;
    }
  },

  // Clear preferences
  clearPreferences: () => {
    try {
      localStorage.removeItem(PREFERENCES_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing preferences from localStorage:', error);
      return false;
    }
  }
};

// Match score calculation engine
export const matchScoreEngine = {
  // Calculate match score for a job based on user preferences
  calculateMatchScore: (job, preferences) => {
    if (!preferences) return 0;
    
    let score = 0;
    
    // +25 if any roleKeyword appears in job.title (case-insensitive)
    if (preferences.roleKeywords && preferences.roleKeywords.length > 0) {
      const titleLower = job.title.toLowerCase();
      const hasKeywordInTitle = preferences.roleKeywords.some(keyword => 
        titleLower.includes(keyword.toLowerCase().trim())
      );
      if (hasKeywordInTitle) score += 25;
    }
    
    // +15 if any roleKeyword appears in job.description
    if (preferences.roleKeywords && preferences.roleKeywords.length > 0) {
      const descLower = job.description.toLowerCase();
      const hasKeywordInDescription = preferences.roleKeywords.some(keyword => 
        descLower.includes(keyword.toLowerCase().trim())
      );
      if (hasKeywordInDescription) score += 15;
    }
    
    // +15 if job.location matches preferredLocations
    if (preferences.preferredLocations && preferences.preferredLocations.length > 0) {
      const hasLocationMatch = preferences.preferredLocations.includes(job.location);
      if (hasLocationMatch) score += 15;
    }
    
    // +10 if job.mode matches preferredMode
    if (preferences.preferredMode && preferences.preferredMode.length > 0) {
      const hasModeMatch = preferences.preferredMode.includes(job.mode);
      if (hasModeMatch) score += 10;
    }
    
    // +10 if job.experience matches experienceLevel
    if (preferences.experienceLevel && preferences.experienceLevel === job.experience) {
      score += 10;
    }
    
    // +15 if overlap between job.skills and user.skills (any match)
    if (preferences.skills && preferences.skills.length > 0) {
      const hasSkillMatch = job.skills.some(skill => 
        preferences.skills.includes(skill)
      );
      if (hasSkillMatch) score += 15;
    }
    
    // +5 if postedDaysAgo <= 2
    if (job.postedDaysAgo <= 2) {
      score += 5;
    }
    
    // +5 if source is LinkedIn
    if (job.source === 'LinkedIn') {
      score += 5;
    }
    
    // Cap score at 100
    return Math.min(score, 100);
  },
  
  // Get score badge style based on score
  getScoreBadgeClass: (score) => {
    if (score >= 80) return 'score-green';
    if (score >= 60) return 'score-amber';
    if (score >= 40) return 'score-neutral';
    return 'score-grey';
  },
  
  // Get score badge text
  getScoreBadgeText: (score) => {
    return `${score}% match`;
  }
};

// Utility functions for form handling
export const preferenceUtils = {
  // Parse comma-separated values
  parseCommaSeparated: (value) => {
    return value ? value.split(',').map(item => item.trim()).filter(item => item) : [];
  },
  
  // Join array to comma-separated string
  joinCommaSeparated: (array) => {
    return array ? array.join(', ') : '';
  },
  
  // Validate preferences
  validatePreferences: (preferences) => {
    const errors = [];
    
    if (!preferences.roleKeywords || preferences.roleKeywords.length === 0) {
      errors.push('At least one role keyword is required');
    }
    
    if (!preferences.preferredLocations || preferences.preferredLocations.length === 0) {
      errors.push('At least one preferred location is required');
    }
    
    if (!preferences.preferredMode || preferences.preferredMode.length === 0) {
      errors.push('At least one preferred mode is required');
    }
    
    if (!preferences.experienceLevel) {
      errors.push('Experience level is required');
    }
    
    if (!preferences.skills || preferences.skills.length === 0) {
      errors.push('At least one skill is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};