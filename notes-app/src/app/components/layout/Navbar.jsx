'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useAuthStore from '@/app/hooks/useAuth';
import { useRouter } from 'next/router';

const Navbar = () => {
  const pathname = usePathname();
  const { isAuthenticated, signOut } = useAuthStore();

  const handleSignOut = () => {
    signOut();
    const router = useRouter();
    router.push('/auth/signin');
  }

  return (
    <nav>
      <div className='flex items-center justify-between px-[10vw] py-[2vh] bg-[#a0ccd4] text-blue-800 font-bold'>
        <div>
          <Link href="/" className='text-[3vh]'>Notes App</Link>
        </div>

        {isAuthenticated ? (
          <div>
            <Link href="/">
              <span className={pathname === '/' ? 'active' : ''}>Notes</span>
            </Link>
            <button onClick={handleSignOut} className='ml-4'>Sign Out</button>
          </div>
        ) : (
          <div>
            <Link href="/auth/signin" className={pathname === '/auth/signin' ? 'active' : ''}>
                Sign In
            </Link>
            <Link href="/auth/signup" className={`pl-[16px] ${pathname === '/auth/signup' ? 'active' : ''}`}>
                Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;