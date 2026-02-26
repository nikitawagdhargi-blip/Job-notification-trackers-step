// Job status tracking utilities
const STATUS_KEY = 'jobTrackerStatus';

// Available job statuses
export const JOB_STATUS = {
  NOT_APPLIED: 'Not Applied',
  APPLIED: 'Applied',
  REJECTED: 'Rejected',
  SELECTED: 'Selected'
};

// Status colors for badges
export const STATUS_COLORS = {
  [JOB_STATUS.NOT_APPLIED]: 'status-neutral',
  [JOB_STATUS.APPLIED]: 'status-blue',
  [JOB_STATUS.REJECTED]: 'status-red',
  [JOB_STATUS.SELECTED]: 'status-green'
};

export const statusStorage = {
  // Get all job statuses from localStorage
  getAllStatuses: () => {
    try {
      const saved = localStorage.getItem(STATUS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error('Error reading statuses from localStorage:', error);
      return {};
    }
  },

  // Get status for a specific job
  getStatus: (jobId) => {
    const allStatuses = statusStorage.getAllStatuses();
    return allStatuses[jobId] || JOB_STATUS.NOT_APPLIED;
  },

  // Set status for a specific job
  setStatus: (jobId, status) => {
    // Validate status
    if (!Object.values(JOB_STATUS).includes(status)) {
      console.error('Invalid status:', status);
      return false;
    }

    try {
      const allStatuses = statusStorage.getAllStatuses();
      allStatuses[jobId] = status;
      localStorage.setItem(STATUS_KEY, JSON.stringify(allStatuses));
      
      // Also save status update history
      statusHistory.addStatusUpdate(jobId, status);
      
      return true;
    } catch (error) {
      console.error('Error saving status to localStorage:', error);
      return false;
    }
  },

  // Clear all statuses (for testing/reset)
  clearAllStatuses: () => {
    try {
      localStorage.removeItem(STATUS_KEY);
      statusHistory.clearHistory();
      return true;
    } catch (error) {
      console.error('Error clearing statuses:', error);
      return false;
    }
  },

  // Reset all statuses to default (Not Applied)
  resetAllToDefault: () => {
    try {
      const allStatuses = statusStorage.getAllStatuses();
      const resetStatuses = {};
      Object.keys(allStatuses).forEach(jobId => {
        resetStatuses[jobId] = JOB_STATUS.NOT_APPLIED;
      });
      localStorage.setItem(STATUS_KEY, JSON.stringify(resetStatuses));
      return true;
    } catch (error) {
      console.error('Error resetting statuses:', error);
      return false;
    }
  }
};

// Status update history tracking
const HISTORY_KEY = 'jobTrackerStatusHistory';

export const statusHistory = {
  // Add status update to history
  addStatusUpdate: (jobId, status) => {
    try {
      const history = statusHistory.getHistory();
      const update = {
        jobId,
        status,
        timestamp: new Date().toISOString(),
        id: Date.now() + Math.random() // unique ID
      };
      
      // Keep only last 20 updates to prevent storage bloat
      history.unshift(update);
      if (history.length > 20) {
        history.splice(20);
      }
      
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
      return true;
    } catch (error) {
      console.error('Error saving status history:', error);
      return false;
    }
  },

  // Get status update history
  getHistory: () => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error reading status history:', error);
      return [];
    }
  },

  // Clear status history
  clearHistory: () => {
    try {
      localStorage.removeItem(HISTORY_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing status history:', error);
      return false;
    }
  },

  // Get recent status updates with job details
  getRecentUpdatesWithJobs: (jobsData) => {
    const history = statusHistory.getHistory();
    const jobMap = new Map(jobsData.map(job => [job.id, job]));
    
    return history.map(update => {
      const job = jobMap.get(update.jobId);
      return {
        ...update,
        jobTitle: job ? job.title : 'Unknown Job',
        company: job ? job.company : 'Unknown Company',
        location: job ? job.location : 'Unknown Location'
      };
    });
  }
};

// Status filtering utilities
export const statusFilter = {
  // Apply status filter to jobs array
  applyStatusFilter: (jobs, statusFilter) => {
    if (!statusFilter || statusFilter === 'All') {
      return jobs;
    }
    
    const allStatuses = statusStorage.getAllStatuses();
    return jobs.filter(job => {
      const jobStatus = allStatuses[job.id] || JOB_STATUS.NOT_APPLIED;
      return jobStatus === statusFilter;
    });
  },
  
  // Get all available statuses for filter dropdown
  getStatusOptions: () => {
    return [
      'All',
      JOB_STATUS.NOT_APPLIED,
      JOB_STATUS.APPLIED,
      JOB_STATUS.REJECTED,
      JOB_STATUS.SELECTED
    ];
  }
};