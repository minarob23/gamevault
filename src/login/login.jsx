import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const GameStoreAuth = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false); // For animation
  const navto = useNavigate();

  // Create floating particles with random positions and animations
  const particles = Array(10).fill().map((_, index) => ({
    id: index,
    size: Math.floor(Math.random() * 10) + 5,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    duration: Math.floor(Math.random() * 10) + 8
  }));

  const flipCard = () => {
    setIsFlipped(!isFlipped);
    setErrorMessage('');
    setSuccessMessage('');
    setShowMessage(false); // Reset animation state
    // Reset form fields when flipping
    if (!isFlipped) {
      // Reset login form
      setEmail('');
      setPassword('');
    } else {
      // Reset registration form
      setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    }
  };

  const handleSubmit = async (e, isRegister) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    setShowMessage(false); // Reset animation state

    // Form validation
    if (isRegister) {
      if (!fullName || !email || !password || !confirmPassword) {
        setErrorMessage("Please fill all fields");
        setShowMessage(true); // Trigger animation
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setErrorMessage("Passwords don't match");
        setShowMessage(true); // Trigger animation
        setIsLoading(false);
        return;
      }
    } else {
      // Login validation
      if (!email || !password) {
        setErrorMessage("Please fill all fields");
        setShowMessage(true); // Trigger animation
        setIsLoading(false);
        return;
      }
    }

    try {
      const response = await fetch("http://localhost/gamevault/src/login/index.php", {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: isRegister ? 'register' : 'login',
          email,
          // username: email, // Use email as username for registration

          password,
          ...(isRegister && { 
            fullName,
            confirmPassword 
          })
        }),
      });

      const data = await response.json();

      if (!data.success) {
        if (data.message === "Invalid credentials") {
          setErrorMessage("Invalid email or password. Please try again.");
        } else {
          setErrorMessage(data.message);
        }
        setShowMessage(true); // Trigger animation
        throw new Error(data.message || (isRegister ? 'Registration failed' : 'Login failed'));
      }

      if (isRegister) {
        setSuccessMessage('Registration successful! You can now login.');
        setShowMessage(true); // Trigger animation
        setIsFlipped(false); // Flip back to login
        // Clear registration form fields
        setFullName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        // Check if the user exists in the database
        if (data.data && data.data.username) {
          // Store user data in localStorage if needed
          window.localStorage.setItem("LoginUser", "logged");
          window.localStorage.setItem("UserName", data.data.username);
          if (data.data.token) {
            window.localStorage.setItem("AuthToken", data.data.token);
          }
          // Check if user is admin
          if (data.data.isAdmin) {
            window.localStorage.setItem("isAdmin", "true");
            window.location.href = `/game-ecommerce-store/admin`;
          } else {
            window.location.href = `/game-ecommerce-store/browse`;
          }
        } else {
          setErrorMessage("Invalid credentials. Please check your email and password.");
          setShowMessage(true); // Trigger animation
        }
      }
    } catch (error) {
      setErrorMessage(error.message);
      setShowMessage(true); // Trigger animation
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div 
        className={`w-full max-w-4xl h-96 md:h-[500px] relative perspective-1000 ${
          isFlipped ? 'rotate-y-180' : ''
        } transition-transform duration-1000 ease-in-out transform-style-3d`}
      >
        {/* Login Card (Front) */}
        <div 
          className={`absolute w-full h-full rounded-2xl overflow-hidden shadow-2xl flex transform-style-3d backface-hidden ${
            isFlipped ? 'invisible' : ''
          }`}
        >
          {/* Left Panel */}
          <div className="w-2/5 bg-gradient-to-br from-purple-700 to-indigo-900 relative flex flex-col justify-center items-center p-8 overflow-hidden">
            {particles.map(particle => (
              <div 
                key={particle.id}
                className="absolute rounded-full bg-white bg-opacity-10"
                style={{
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  left: particle.left,
                  top: particle.top,
                  animation: `float ${particle.duration}s infinite linear`
                }}
              />
            ))}

            <div className="relative z-10 mb-6">
              <div className="w-16 h-16 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded transform rotate-45"></div>
                <div className="absolute w-3 h-3 bg-purple-700 rounded-full"></div>
              </div>
            </div>

            <h1 className="text-white text-xl font-bold uppercase tracking-wider mb-2 text-center relative z-10">GameVault</h1>
            <p className="text-white text-opacity-80 text-sm text-center relative z-10">Your Gateway to Virtual Worlds</p>
          </div>

          {/* Right Panel */}
          <div className="w-3/5 bg-gray-800 p-8 flex flex-col justify-center">
            <div className="animate-fadeIn">
              <h2 className="text-white text-2xl font-bold mb-6 relative">
                Login
                <span className="absolute left-0 bottom-0 w-6 h-0.5 bg-purple-600 rounded-full" />
              </h2>
            </div>

            <div className="animate-fadeIn animation-delay-100">
              <div className="mb-6 relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg text-white outline-none transition-all focus:border-purple-600 focus:shadow-outline-purple"
                  placeholder="Email"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">✉️</span>
              </div>
            </div>

            <div className="animate-fadeIn animation-delay-200">
              <div className="mb-6 relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg text-white outline-none transition-all focus:border-purple-600 focus:shadow-outline-purple"
                  placeholder="Password"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔒</span>
              </div>
            </div>

            <div className="animate-fadeIn animation-delay-300">
              <button 
                onClick={(e) => handleSubmit(e, false)}
                className="w-full p-4 bg-gradient-to-r from-purple-700 to-purple-500 rounded-lg text-white font-semibold text-base cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 active:translate-y-0 relative overflow-hidden"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "LOGIN"}
                <span className="absolute inset-0 w-full h-full shine-effect" />
              </button>
            </div>

            <div className="text-center mt-4 text-sm animate-fadeIn animation-delay-400">
              <span className="text-gray-400">Don't have an account?</span>
              <button onClick={flipCard} className="ml-2 text-purple-500 hover:underline transition-colors">Create Account</button>
            </div>

            {/* Animated Error Message */}
            {errorMessage && showMessage && (
              <div className="mt-4 text-center animate-fadeIn">
                <div className="text-red-500 animate-bounce">{errorMessage}</div>
              </div>
            )}

            {/* Animated Success Message */}
            {successMessage && showMessage && (
              <div className="mt-4 text-center animate-fadeIn">
                <div className="text-green-500 animate-bounce">{successMessage}</div>
              </div>
            )}
          </div>
        </div>

        {/* Register Card (Back) */}
        <div 
          className={`absolute w-full h-full rounded-2xl overflow-hidden shadow-2xl flex transform-style-3d backface-hidden rotate-y-180 ${
            isFlipped ? '' : 'invisible'
          }`}
        >
          {/* Left Panel */}
          <div className="w-2/5 bg-gradient-to-br from-purple-700 to-indigo-900 relative flex flex-col justify-center items-center p-8 overflow-hidden">
            {particles.map(particle => (
              <div 
                key={particle.id}
                className="absolute rounded-full bg-white bg-opacity-10"
                style={{
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  left: particle.left,
                  top: particle.top,
                  animation: `float ${particle.duration}s infinite linear`
                }}
              />
            ))}

            <div className="relative z-10 mb-6">
              <div className="w-16 h-16 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded transform rotate-45"></div>
                <div className="absolute w-3 h-3 bg-purple-700 rounded-full"></div>
              </div>
            </div>

            <h1 className="text-white text-xl font-bold uppercase tracking-wider mb-2 text-center relative z-10">GameVault</h1>
            <p className="text-white text-opacity-80 text-sm text-center relative z-10">Join Our Gaming Community</p>
          </div>

          {/* Right Panel */}
          <div className="w-3/5 bg-gray-800 p-6 flex flex-col justify-center">
            <div className="animate-fadeIn">
              <h2 className="text-white text-2xl font-bold mb-4 relative">
                Register
                <span className="absolute left-0 bottom-0 w-6 h-0.5 bg-purple-600 rounded-full" />
              </h2>
            </div>

            <div className="animate-fadeIn animation-delay-100">
              <div className="mb-3 relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg text-white outline-none transition-all focus:border-purple-600 focus:shadow-outline-purple"
                  placeholder="Full Name"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">👤</span>
              </div>
            </div>

            <div className="animate-fadeIn animation-delay-300">
              <div className="mb-3 relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg text-white outline-none transition-all focus:border-purple-600 focus:shadow-outline-purple"
                  placeholder="Email"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">✉️</span>
              </div>
            </div>

            <div className="animate-fadeIn animation-delay-400">
              <div className="mb-4 relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg text-white outline-none transition-all focus:border-purple-600 focus:shadow-outline-purple"
                  placeholder="Password"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔒</span>
              </div>
            </div>

            <div className="animate-fadeIn animation-delay-500">
              <div className="mb-4 relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg text-white outline-none transition-all focus:border-purple-600 focus:shadow-outline-purple"
                  placeholder="Confirm Password"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔒</span>
              </div>
            </div>

            <div className="animate-fadeIn animation-delay-600">
              <button 
                onClick={(e) => handleSubmit(e, true)}
                className="w-full p-3 bg-gradient-to-r from-purple-700 to-purple-500 rounded-lg text-white font-semibold text-base cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 active:translate-y-0 relative overflow-hidden"
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : "CREATE ACCOUNT"}
                <span className="absolute inset-0 w-full h-full shine-effect" />
              </button>
            </div>

            <div className="text-center mt-3 text-sm animate-fadeIn animation-delay-700">
              <span className="text-gray-400">Already have an account?</span>
              <button onClick={flipCard} className="ml-2 text-purple-500 hover:underline transition-colors">Login</button>
            </div>

            {/* Animated Error Message */}
            {errorMessage && showMessage && (
              <div className="mt-4 text-center animate-fadeIn">
                <div className="text-red-500 animate-bounce">{errorMessage}</div>
              </div>
            )}

            {/* Animated Success Message */}
            {successMessage && showMessage && (
              <div className="mt-4 text-center animate-fadeIn">
                <div className="text-green-500 animate-bounce">{successMessage}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-1000%) rotate(720deg);
            opacity: 0;
          }
        }

        .perspective-1000 {
          perspective: 1000px;
        }

        .transform-style-3d {
          transform-style: preserve-3d;
        }

        .backface-hidden {
          backface-visibility: hidden;
        }

        .rotate-y-180 {
          transform: rotateY(180deg);
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animation-delay-100 {
          animation-delay: 0.1s;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-700 {
          animation-delay: 0.7s;
        }

        .shine-effect {
          background: linear-gradient(
            135deg,
            transparent 0%,
            rgba(255, 255, 255, 0.1) 50%,
            transparent 100%
          );
          transform: translateX(-100%);
        }

        button:hover .shine-effect {
          animation: shine 1s forwards;
        }

        @keyframes shine {
          to {
            transform: translateX(100%);
          }
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-30px);
          }
          60% {
            transform: translateY(-15px);
          }
        }

        .animate-bounce {
          animation: bounce 1s;
        }
      `}</style>
    </div>
  );
};

export default GameStoreAuth;