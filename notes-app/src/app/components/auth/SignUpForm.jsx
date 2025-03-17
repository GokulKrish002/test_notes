'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuthStore from '@/app/hooks/useAuth';

const SignUpForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  
  const { signUp, isLoading, error, clearError } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    clearError();
    
    if (!username || !email || !password || !confirmPassword) {
      setFormError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    try {
      await signUp(username, email, password);
      router.push('/auth/signin');
    } catch (err) {
      setFormError(err.message || 'Failed to sign up');
    }
  };

  return (
    <div className='flex justify-center items-center h-[90vh] w-[100vw]'>
      <div className='transition-all relative overflow-hidden border-[2px] border-amber-900 rounded-lg pt-[8vh] pb-[4vh] px-[2vw] w-[80vw] md:w-[50vw] lg:w-[40vw] xl:w-[25vw]'>

      <p className='absolute top-0 left-0 w-full bg-[#f2d1b5] py-[0.8vh] pl-4 font-bold border-b-[2px] border-amber-900'>Signup</p>
      
      <p className='mb-[20px] text-center text-[26px] font-bold'>Register</p>
      {(formError || error) && <p>{formError || error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username" className='block text-[14px] font-semibold mb-[4px] ml-[4px]'>Username</label>
          <input
            id="username"
            type="text"
            value={username}
            placeholder='Name'
            className='border-[1.5px] rounded-lg border-amber-800 bg-white px-2 py-1 w-full'
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        
        <div className='mt-4'>
          <label htmlFor="email" className='block text-[14px] font-semibold mb-[4px] ml-[4px]'>Email</label>
          <input
            id="email"
            type="email"
            value={email}
            placeholder='Email'
            className='border-[1.5px] rounded-lg border-amber-800 bg-white px-2 py-1 w-full'
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className='my-4'>
          <label htmlFor="password" className='block text-[14px] font-semibold mb-[4px] ml-[4px]'>Password</label>
          <input
            id="password"
            type="password"
            value={password}
            placeholder='Password'
            className='border-[1.5px] rounded-lg border-amber-800 bg-white px-2 py-1 w-full'
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className='block text-[14px] font-semibold mb-[4px] ml-[4px]'>Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            placeholder='Confirm Password'
            className='border-[1.5px] rounded-lg border-amber-800 bg-white px-2 py-1 w-full'
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        
        <div className='mt-10 flex justify-around'>
        <button type="submit" className='font-semibold py-2 px-5 bg-[#4ade80] text-[#72401f]  rounded-lg' disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>
        <Link href="/auth/signin" className='font-semibold py-2 px-5 bg-[#ebb384] text-[#72401f] rounded-lg'>
          Login
        </Link>
        </div>
      </form>
      </div>
    </div>
  );
};

export default SignUpForm;