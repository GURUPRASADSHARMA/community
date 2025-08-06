import React, { useState, useEffect } from 'react';
import { Mail, Shield, CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// interface VerificationState {
//   status: 'idle' | 'loading' | 'success' | 'error';
//   message: string;
// }

const EmailVerification= () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [emailError, setEmailError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [state, setState] = useState({ status: 'idle', message: '' });
  const [focusedField, setFocusedField] = useState(null);

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  // Verification code validation
  const validateCode = (code) => {
    if (!code) {
      return 'Verification code is required';
    }
    if (code.length !== 6) {
      return 'Verification code must be 6 digits';
    }
    if (!/^\d+$/.test(code)) {
      return 'Verification code must contain only numbers';
    }
    return '';
  };

  // Handle email change
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (emailError) {
      setEmailError(validateEmail(value));
    }
  };

  // Handle code change
  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(value);
    if (codeError) {
      setCodeError(validateCode(value));
    }
  };


  

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailValidationError = validateEmail(email);
    const codeValidationError = validateCode(verificationCode);
    setEmailError(emailValidationError);
    setCodeError(codeValidationError);
    if (emailValidationError || codeValidationError) {
      return;
    }
    setState({ status: 'loading', message: 'Verifying your email...' });
    try {
       const response =  await axios.post("/api/v1/user/verifyemail",{
        email:email,
        verifyCode:verificationCode
      });
      console.log(response)
      console.log("verifying email")
      if (response.data.statusCode) {
        navigate("/login")
        setState({ status: 'success', message: response.message });
      } else {
        setState({ status: 'error', message: response.message });
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong. Please try again.";
  setState({ status: "error", message });
    }
  };

  // Reset form
  const resetForm = () => {
    setEmail('');
    setVerificationCode('');
    setEmailError('');
    setCodeError('');
    setState({ status: 'idle', message: '' });
    setFocusedField(null);
  };

  // Auto-clear success/error state after some time
  useEffect(() => {
    if (state.status === 'success' || state.status === 'error') {
      const timer = setTimeout(() => {
        if (state.status === 'success') {
          resetForm();
        } else {
          setState({ status: 'idle', message: '' });
        }
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [state.status]);

  if (state.status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full transform animate-pulse">
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Email Verified!</h2>
            <p className="text-gray-600 mb-6">{state.message}</p>
            <button
              onClick={resetForm}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-700 transition-all duration-200 transform hover:scale-105"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
          <p className="text-gray-600">Enter your email and the verification code we sent you</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Mail className={`w-5 h-5 transition-colors duration-200 ${
                  focusedField === 'email' ? 'text-blue-600' : 'text-gray-400'
                }`} />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                  emailError
                    ? 'border-red-300 focus:border-red-500 bg-red-50'
                    : focusedField === 'email'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 focus:border-blue-400'
                }`}
                placeholder="Enter your email address"
                disabled={state.status === 'loading'}
              />
            </div>
            {emailError && (
              <p className="text-red-500 text-sm mt-1 animate-slideInFromTop">
                {emailError}
              </p>
            )}
          </div>

          {/* Verification Code Field */}
          <div className="space-y-2">
            <label htmlFor="code" className="block text-sm font-semibold text-gray-700">
              Verification Code
            </label>
            <div className="relative">
              <input
                id="code"
                type="text"
                value={verificationCode}
                onChange={handleCodeChange}
                onFocus={() => setFocusedField('code')}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 text-center text-2xl font-mono tracking-widest ${
                  codeError
                    ? 'border-red-300 focus:border-red-500 bg-red-50'
                    : focusedField === 'code'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 focus:border-blue-400'
                }`}
                placeholder="000000"
                maxLength={6}
                disabled={state.status === 'loading'}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <div className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  verificationCode.length === 6 ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              </div>
            </div>
            {codeError && (
              <p className="text-red-500 text-sm mt-1 animate-slideInFromTop">
                {codeError}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          {/* Error Message */}
          {state.status === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-slideInFromTop">
              <div className="flex items-center">
                <XCircle className="w-5 h-5 text-red-600 mr-2" />
                <p className="text-red-700 text-sm">{state.message}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={state.status === 'loading'}
            className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform ${
              state.status === 'loading'
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95'
            } text-white flex items-center justify-center space-x-2`}
          >
            {state.status === 'loading' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Verify Email</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Helper Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Didn't receive the code?{' '}
            <button className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200">
              Resend
            </button>
          </p>
        </div>

        {/* Demo Instructions */}
        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <p className="text-xs text-gray-600 mb-2 font-semibold">Demo Instructions:</p>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>• Use code <code className="bg-gray-200 px-1 rounded">123456</code> for success</li>
            <li>• Use code <code className="bg-gray-200 px-1 rounded">000000</code> for expired error</li>
            <li>• Any other 6-digit code will show invalid error</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;