// Job storage utilities for localStorage management
const SAVED_JOBS_KEY = 'savedJobs';

export const jobStorage = {
  // Get saved jobs from localStorage
  getSavedJobs: () => {
    try {
      const saved = localStorage.getItem(SAVED_JOBS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error reading saved jobs from localStorage:', error);
      return [];
    }
  },

  // Save jobs to localStorage
  saveJobs: (jobs) => {
    try {
      localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(jobs));
      return true;
    } catch (error) {
      console.error('Error saving jobs to localStorage:', error);
      return false;
    }
  },

  // Add a job to saved jobs
  saveJob: (jobId) => {
    const savedJobs = jobStorage.getSavedJobs();
    if (!savedJobs.includes(jobId)) {
      savedJobs.push(jobId);
      return jobStorage.saveJobs(savedJobs);
    }
    return true; // Already saved
  },

  // Remove a job from saved jobs
  unsaveJob: (jobId) => {
    const savedJobs = jobStorage.getSavedJobs();
    const updatedJobs = savedJobs.filter(id => id !== jobId);
    return jobStorage.saveJobs(updatedJobs);
  },

  // Check if a job is saved
  isJobSaved: (jobId) => {
    const savedJobs = jobStorage.getSavedJobs();
    return savedJobs.includes(jobId);
  },

  // Get saved job objects from the full job list
  getSavedJobObjects: (allJobs) => {
    const savedJobIds = jobStorage.getSavedJobs();
    return allJobs.filter(job => savedJobIds.includes(job.id));
  }
};

// Job filtering utilities
export const jobFilters = {
  // Filter jobs by keyword (title or company)
  filterByKeyword: (jobs, keyword) => {
    if (!keyword) return jobs;
    const lowerKeyword = keyword.toLowerCase();
    return jobs.filter(job => 
      job.title.toLowerCase().includes(lowerKeyword) ||
      job.company.toLowerCase().includes(lowerKeyword)
    );
  },

  // Filter jobs by location
  filterByLocation: (jobs, location) => {
    if (!location) return jobs;
    return jobs.filter(job => job.location === location);
  },

  // Filter jobs by mode
  filterByMode: (jobs, mode) => {
    if (!mode) return jobs;
    return jobs.filter(job => job.mode === mode);
  },

  // Filter jobs by experience
  filterByExperience: (jobs, experience) => {
    if (!experience) return jobs;
    return jobs.filter(job => job.experience === experience);
  },

  // Filter jobs by source
  filterBySource: (jobs, source) => {
    if (!source) return jobs;
    return jobs.filter(job => job.source === source);
  },

  // Sort jobs
  sortJobs: (jobs, sortBy) => {
    const sortedJobs = [...jobs];
    
    switch (sortBy) {
      case 'latest':
        return sortedJobs.sort((a, b) => b.postedDaysAgo - a.postedDaysAgo);
      case 'oldest':
        return sortedJobs.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
      case 'title':
        return sortedJobs.sort((a, b) => a.title.localeCompare(b.title));
      case 'company':
        return sortedJobs.sort((a, b) => a.company.localeCompare(b.company));
      case 'salary-high':
        return sortedJobs.sort((a, b) => {
          // Simple salary sorting - extract numbers and compare
          const aSalary = a.salaryRange.match(/\d+/g)?.[0] || 0;
          const bSalary = b.salaryRange.match(/\d+/g)?.[0] || 0;
          return parseInt(bSalary) - parseInt(aSalary);
        });
      default:
        return sortedJobs;
    }
  },

  // Get unique filter options from jobs
  getFilterOptions: (jobs) => {
    const locations = [...new Set(jobs.map(job => job.location))].sort();
    const modes = [...new Set(jobs.map(job => job.mode))].sort();
    const experiences = [...new Set(jobs.map(job => job.experience))].sort();
    const sources = [...new Set(jobs.map(job => job.source))].sort();
    
    return {
      locations: ['All Locations', ...locations],
      modes: ['All Modes', ...modes],
      experiences: ['All Experience Levels', ...experiences],
      sources: ['All Sources', ...sources],
      sortOptions: [
        { value: 'latest', label: 'Latest First' },
        { value: 'oldest', label: 'Oldest First' },
        { value: 'title', label: 'Title A-Z' },
        { value: 'company', label: 'Company A-Z' },
        { value: 'salary-high', label: 'Highest Salary' }
      ]
    };
  }
};

// Format job posted date
export const formatPostedDate = (daysAgo) => {
  if (daysAgo === 0) return 'Today';
  if (daysAgo === 1) return '1 day ago';
  return `${daysAgo} days ago`;
};

// Format job experience level
export const formatExperience = (experience) => {
  const experienceMap = {
    'Fresher': 'Fresher',
    '0-1': '0-1 Years',
    '1-3': '1-3 Years',
    '3-5': '3-5 Years'
  };
  return experienceMap[experience] || experience;
};