import React from 'react';
import Magnifier from '../../components/Magnifier/Magnifier'
import Navbar from '../../components/Navbar/Navbar';

function HomePage() {
  return (
    <div className="container mt-5">
      <Navbar/>
      <Magnifier/>
    </div>
  );
}

export default HomePage; 