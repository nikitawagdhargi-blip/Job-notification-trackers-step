import React, { useState, useEffect } from 'react';
import { TEST_ITEMS, testStorage } from '../utils/testChecklist';

const TestChecklist = () => {
  const [testStatuses, setTestStatuses] = useState({});
  const [completedCount, setCompletedCount] = useState(0);
  const [showTooltips, setShowTooltips] = useState({});

  // Load test statuses on component mount
  useEffect(() => {
    const statuses = testStorage.getAllStatuses();
    setTestStatuses(statuses);
    setCompletedCount(testStorage.getCompletedCount());
  }, []);

  // Handle checkbox change
  const handleTestToggle = (testId) => {
    const newStatus = !testStatuses[testId];
    if (testStorage.setTestStatus(testId, newStatus)) {
      setTestStatuses(prev => ({
        ...prev,
        [testId]: newStatus
      }));
      setCompletedCount(testStorage.getCompletedCount());
    }
  };

  // Handle reset button click
  const handleReset = () => {
    if (testStorage.resetAllTests()) {
      setTestStatuses({});
      setCompletedCount(0);
      setShowTooltips({});
    }
  };

  // Toggle tooltip visibility
  const toggleTooltip = (testId) => {
    setShowTooltips(prev => ({
      ...prev,
      [testId]: !prev[testId]
    }));
  };

  // Check if all tests are completed
  const allTestsCompleted = completedCount === TEST_ITEMS.length;

  return (
    <div className="page-container">
      <div className="page-content">
        <h1 className="page-heading">Test Checklist</h1>
        <p className="page-subtext">Verify all core functionality before shipping the application.</p>
        
        {/* Test Result Summary */}
        <div className="test-summary">
          <div className={`test-counter ${allTestsCompleted ? 'completed' : 'in-progress'}`}>
            <h2 className="counter-text">Tests Passed: {completedCount} / {TEST_ITEMS.length}</h2>
          </div>
          
          {!allTestsCompleted && (
            <div className="warning-banner">
              <p>Resolve all issues before shipping.</p>
            </div>
          )}
          
          {allTestsCompleted && (
            <div className="success-banner">
              <p>All tests completed! Ready for shipping.</p>
            </div>
          )}
        </div>
        
        {/* Checklist */}
        <div className="checklist-container">
          <div className="checklist">
            {TEST_ITEMS.map((test) => (
              <div key={test.id} className="checklist-item">
                <div className="checklist-main">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={testStatuses[test.id] || false}
                      onChange={() => handleTestToggle(test.id)}
                    />
                    <span className="checkmark"></span>
                    <span className="test-title">{test.title}</span>
                  </label>
                  
                  <button 
                    className="tooltip-toggle"
                    onClick={() => toggleTooltip(test.id)}
                    title="How to test"
                  >
                    ?
                  </button>
                </div>
                
                {showTooltips[test.id] && (
                  <div className="tooltip-content">
                    <p>{test.tooltip}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Reset Button */}
        <div className="reset-section">
          <button 
            className="btn btn-secondary reset-btn"
            onClick={handleReset}
          >
            Reset Test Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestChecklist;