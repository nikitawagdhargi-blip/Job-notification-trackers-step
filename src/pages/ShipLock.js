import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { testStorage, navigationGuard } from '../utils/testChecklist';

const ShipLock = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  // Check unlock status on component mount and when localStorage changes
  useEffect(() => {
    const checkStatus = () => {
      const completed = testStorage.getCompletedCount();
      const total = 10; // Total test items
      const unlocked = navigationGuard.canNavigateToShip();
      
      setCompletedCount(completed);
      setTotalCount(total);
      setIsUnlocked(unlocked);
    };

    checkStatus();
    
    // Listen for localStorage changes
    const handleStorageChange = () => {
      checkStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically in case of same-tab changes
    const interval = setInterval(checkStatus, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Handle navigation to test checklist
  const handleGoToTests = () => {
    navigate('/jt/07-test');
  };

  return (
    <div className="page-container">
      <div className="page-content">
        <h1 className="page-heading">Ship Ready</h1>
        <p className="page-subtext">Final verification before deployment.</p>
        
        <div className="ship-lock-container">
          {isUnlocked ? (
            <div className="ship-unlocked">
              <div className="success-icon">✅</div>
              <h2 className="success-title">Ready for Shipping!</h2>
              <p className="success-message">
                All {totalCount} tests have been completed successfully. 
                The application is ready for deployment.
              </p>
              <div className="success-stats">
                <div className="stat-item">
                  <span className="stat-number">{completedCount}</span>
                  <span className="stat-label">Tests Passed</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{totalCount}</span>
                  <span className="stat-label">Total Tests</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="ship-locked">
              <div className="lock-icon">🔒</div>
              <h2 className="lock-title">Shipping Locked</h2>
              <p className="lock-message">
                {navigationGuard.getLockMessage()}
              </p>
              <div className="lock-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${(completedCount / totalCount) * 100}%` }}
                  ></div>
                </div>
                <p className="progress-text">
                  Progress: {completedCount} of {totalCount} tests completed
                </p>
              </div>
              <button 
                className="btn btn-primary go-to-tests-btn"
                onClick={handleGoToTests}
              >
                Complete Tests Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShipLock;