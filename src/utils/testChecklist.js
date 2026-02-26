// Test checklist storage utilities
const TEST_STATUS_KEY = 'jobTrackerTestStatus';

// Test items with descriptions and tooltips
export const TEST_ITEMS = [
  {
    id: 'preferences-persist',
    title: 'Preferences persist after refresh',
    tooltip: 'Set preferences in Settings, refresh page, verify they remain'
  },
  {
    id: 'match-score-calculate',
    title: 'Match score calculates correctly',
    tooltip: 'Set preferences, check Dashboard for accurate match percentages'
  },
  {
    id: 'show-matches-toggle',
    title: '"Show only matches" toggle works',
    tooltip: 'Toggle the filter on Dashboard, verify job list updates correctly'
  },
  {
    id: 'save-job-persist',
    title: 'Save job persists after refresh',
    tooltip: 'Save a job on Dashboard, refresh, verify it\'s still saved'
  },
  {
    id: 'apply-opens-new-tab',
    title: 'Apply opens in new tab',
    tooltip: 'Click Apply button, verify it opens job application in new tab'
  },
  {
    id: 'status-update-persist',
    title: 'Status update persists after refresh',
    tooltip: 'Change job status, refresh page, verify status is maintained'
  },
  {
    id: 'status-filter-works',
    title: 'Status filter works correctly',
    tooltip: 'Use status filter dropdown, verify only matching jobs are shown'
  },
  {
    id: 'digest-generates-top10',
    title: 'Digest generates top 10 by score',
    tooltip: 'Generate digest, verify it shows exactly 10 jobs sorted by match score'
  },
  {
    id: 'digest-persists-day',
    title: 'Digest persists for the day',
    tooltip: 'Generate digest, refresh page, verify same digest loads automatically'
  },
  {
    id: 'no-console-errors',
    title: 'No console errors on main pages',
    tooltip: 'Navigate all pages, open dev tools console, verify no errors appear'
  }
];

export const testStorage = {
  // Get all test statuses from localStorage
  getAllStatuses: () => {
    try {
      const saved = localStorage.getItem(TEST_STATUS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error('Error reading test statuses from localStorage:', error);
      return {};
    }
  },

  // Get status for a specific test
  getTestStatus: (testId) => {
    const allStatuses = testStorage.getAllStatuses();
    return allStatuses[testId] || false;
  },

  // Set status for a specific test
  setTestStatus: (testId, isChecked) => {
    try {
      const allStatuses = testStorage.getAllStatuses();
      allStatuses[testId] = isChecked;
      localStorage.setItem(TEST_STATUS_KEY, JSON.stringify(allStatuses));
      return true;
    } catch (error) {
      console.error('Error saving test status to localStorage:', error);
      return false;
    }
  },

  // Get count of completed tests
  getCompletedCount: () => {
    const allStatuses = testStorage.getAllStatuses();
    return Object.values(allStatuses).filter(status => status === true).length;
  },

  // Check if all tests are completed
  areAllTestsCompleted: () => {
    return testStorage.getCompletedCount() === TEST_ITEMS.length;
  },

  // Reset all test statuses
  resetAllTests: () => {
    try {
      localStorage.removeItem(TEST_STATUS_KEY);
      return true;
    } catch (error) {
      console.error('Error resetting test statuses:', error);
      return false;
    }
  },

  // Clear all test data (for testing)
  clearAllTestData: () => {
    try {
      localStorage.removeItem(TEST_STATUS_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing test data:', error);
      return false;
    }
  }
};

// Navigation guard for ship route
export const navigationGuard = {
  // Check if navigation to ship route is allowed
  canNavigateToShip: () => {
    return testStorage.areAllTestsCompleted();
  },

  // Get ship route lock message
  getLockMessage: () => {
    const completed = testStorage.getCompletedCount();
    const total = TEST_ITEMS.length;
    return `Complete all tests before shipping. (${completed}/${total} completed)`;
  }
};