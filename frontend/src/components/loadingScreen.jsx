import React from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '../assets/Animation - 1748452414530.json';
import '../styles/loadingScreen.css';

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <Lottie animationData={loadingAnimation} loop={true} />
    </div>
  );
};

export default LoadingScreen;
