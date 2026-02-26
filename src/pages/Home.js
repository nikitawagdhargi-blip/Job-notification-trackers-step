import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="page-container">
      <div className="page-content">
        <h1 className="page-heading">Stop Missing The Right Jobs.</h1>
        <p className="page-subtext">Precision-matched job discovery delivered daily at 9AM.</p>
        <Link to="/settings" className="btn btn-primary">Start Tracking</Link>
      </div>
    </div>
  );
};

export default Home;