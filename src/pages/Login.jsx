import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, KeyRound } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({ email: '', password: '' });
  const [localError, setLocalError] = useState('');

  const { login, isLoading, error: authError } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (localError) setLocalError('');
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!data.email.trim() || !data.password.trim()) {
      setLocalError('Please enter both email and password.');
      return;
    }
    setLocalError('');
    await login(data);
  };

  const handleFillDemo = () => {
    setData({
      email: 'admin@gmail.com',
      password: '67890',
    });
    setLocalError('');
  };

  const displayError = localError || authError;

  return (
    <div className='grid relative grid-cols-2 h-screen text-white bg-slate-900 overflow-hidden'>
      <img
        src='/footerLogo.png'
        className='absolute top-3 left-4 h-24 w-auto object-contain z-10'
        alt='Logo'
      />

      {/* first half */}
      <div className='flex flex-col mt-28 w-[1000px] h-[500px] bg-[url("/registerCrm33.png")] bg-contain bg-no-repeat bg-center'>
        {/* heading and main container */}
        <div className='flex flex-col gap-20 px-5 py-4'>
          <div></div>
          <div className='flex flex-col px-30 gap-8'></div>
        </div>
      </div>

      {/* second half */}
      <div className='flex flex-col gap-5 pr text-black justify-center items-center bg-white p-6 shadow-2xl rounded-l-3xl'>
        {/* welcome section */}
        <div className='flex flex-col gap-1 text-center'>
          <div className='text-3xl font-bold tracking-tight text-gray-900'>Welcome Back!</div>
          <div className='text-sm text-gray-600'>Sign in to We Make Sweets Admin Panel</div>
        </div>

        {/* Demo credentials shortcut */}
        <div
          onClick={handleFillDemo}
          className='w-[380px] bg-amber-50 border border-amber-300 rounded-md p-2.5 flex items-center justify-between cursor-pointer hover:bg-amber-100 transition text-xs text-amber-900'
        >
          <div className='flex items-center gap-2'>
            <KeyRound className='w-4 h-4 text-amber-700' />
            <span>
              <strong>Demo Login:</strong> admin@gmail.com / 67890
            </span>
          </div>
          <span className='font-semibold text-amber-700 underline'>Fill credentials</span>
        </div>

        {displayError && (
          <div className='w-[380px] bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-xs leading-relaxed'>
            {displayError}
          </div>
        )}

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          {/* mail section */}
          <div className='flex flex-col gap-1 w-[380px]'>
            <label className='text-sm font-medium text-gray-700'>E-mail</label>
            <div className='border border-gray-300 rounded-[4px] bg-gray-100 p-2 focus-within:bg-white focus-within:ring-2 focus-within:ring-pink-500 transition'>
              <input
                className='w-full bg-transparent focus:outline-none text-sm text-gray-900'
                placeholder='Enter your e-mail'
                name='email'
                type='email'
                autoComplete='email'
                value={data.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* password */}
          <div className='flex flex-col gap-1 w-[380px]'>
            <label className='text-sm font-medium text-gray-700'>Password</label>
            <div className='border border-gray-300 relative rounded-[4px] bg-gray-100 p-2 focus-within:bg-white focus-within:ring-2 focus-within:ring-pink-500 transition flex items-center justify-between'>
              <input
                className='w-full bg-transparent focus:outline-none text-sm text-gray-900 pr-8'
                value={data.password}
                name='password'
                type={showPassword ? 'text' : 'password'}
                autoComplete='current-password'
                onChange={handleChange}
                placeholder='Enter your password'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='text-gray-500 hover:text-gray-800'
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
              </button>
            </div>
            <div className='text-right text-xs text-blue-600 hover:text-blue-900 mt-1'>
              <Link to='/forgot-password'>Forgot Password?</Link>
            </div>
          </div>

          {/* button */}
          <div className='flex flex-col gap-1 w-[380px] rounded-[4px] p-0.5 bg-pink-600 hover:bg-[#60b396] text-white shadow-[1px_2px_0px_#000] sm:shadow-[2px_3px_0px_#000] hover:shadow-[3px_4px_0px_#000] transition-all duration-300 hover:scale-[1.02] cursor-pointer'>
            <button
              type='submit'
              disabled={isLoading}
              className='text-white py-2 font-medium flex items-center justify-center gap-2 cursor-pointer w-full'
            >
              {isLoading && <Loader2 className='w-4 h-4 animate-spin' />}
              {isLoading ? 'Signing In...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
