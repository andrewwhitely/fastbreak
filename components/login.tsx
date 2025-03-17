'use client';

import { ArrowRight } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Button } from './ui/button';
export function Login() {
  return (
    <Button className='bg-[#1D1160] hover:bg-[#1D1160]/90' size='lg' asChild>
      <Link
        onClick={() => signIn('github', { redirectTo: '/dashboard' })}
        href='/dashboard'
      >
        View Dashboard <ArrowRight className='ml-2 h-4 w-4' />
      </Link>
    </Button>
  );
}
