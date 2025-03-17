'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuthStore from '@/app/hooks/useAuth';

const SignInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const { signIn, isLoading, error, clearError } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    clearError();

    if (!email || !password) {
      setFormError('Please fill in all fields');
      return;
    }

    try {
      await signIn(email, password);
      router.push('/');
    } catch (err) {
      setFormError(err.message || 'Failed to sign in');
    }
  };

  return (
    <div className='flex justify-center items-center h-[90vh] w-[100vw]'>
      <div className='relative overflow-hidden transition-all border-[2px] border-amber-900 rounded-lg pt-[8vh] pb-[4vh] px-[2vw] w-[80vw] md:w-[50vw] lg:w-[40vw] xl:w-[25vw]'>

      <p className='absolute top-0 left-0 w-full bg-[#f2d1b5] py-[0.8vh] pl-4 font-bold border-b-[2px] border-amber-900'>Login</p>
        <p className='mb-[20px] text-center text-[26px] font-bold'>Login</p>
        {(formError || error) && <p>{formError || error}</p>}

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className='block text-[14px] font-semibold mb-[4px] ml-[4px]'>Email</label>
            <input
              id="email"
              type="email"
              value={email}
              placeholder='Email'
              onChange={(e) => setEmail(e.target.value)}
              className="border-[1.5px] rounded-lg border-amber-800 bg-white px-2 py-1 w-full"
              required
            />
          </div>

          <div className='mt-4'>
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

          <div className='mt-7 flex justify-around'>
            <button type="submit" className='font-semibold py-2 px-5 bg-[#ebb384] text-[#72401f] rounded-lg' disabled={isLoading}>
              {isLoading ? 'Logging In...' : 'Login'}
            </button>
            <Link href="/auth/signup" className='font-semibold py-2 px-5 bg-[#a0ccd4] text-[#27626d] rounded-lg'>
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInForm;