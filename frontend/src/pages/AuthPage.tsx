import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSwitchToRegister = () => {
    setIsLogin(false);
    setRegistrationSuccess(false);
  };

  const handleSwitchToLogin = () => {
    setIsLogin(true);
    setRegistrationSuccess(false);
  };

  const handleRegistrationSuccess = () => {
    setRegistrationSuccess(true);
    console.log('Registration success, checking auth state...');
    
    // Wait for authentication state to be properly set before redirecting
    const checkAuthAndRedirect = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      console.log('Checking auth state:', { 
        hasToken: !!storedToken, 
        hasUser: !!storedUser,
        tokenPreview: storedToken ? storedToken.substring(0, 20) + '...' : 'none'
      });
      
      if (storedToken && storedUser) {
        console.log('Auth state ready, redirecting to dashboard');
        navigate('/');
      } else {
        // If not authenticated yet, wait a bit more
        console.log('Auth state not ready yet, waiting...');
        setTimeout(checkAuthAndRedirect, 100);
      }
    };
    
    // Start checking after a short delay
    setTimeout(checkAuthAndRedirect, 200);
  };

  return (
    <div>
      {registrationSuccess && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg shadow-lg">
            Registration successful! Welcome to the Feedback System.
          </div>
        </div>
      )}
      
      {isLogin ? (
        <LoginForm onSwitchToRegister={handleSwitchToRegister} />
      ) : (
        <RegisterForm 
          onSuccess={handleRegistrationSuccess}
          onSwitchToLogin={handleSwitchToLogin}
        />
      )}
    </div>
  );
};

export default AuthPage; 