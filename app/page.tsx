import { Login } from '@/components/login';
import Image from 'next/image';

export default async function Home() {
  return (
    <div className='min-h-screen bg-white'>
      <main className='flex-1'>
        <section className='w-full min-h-screen py-12 md:py-24 lg:py-32 xl:py-48'>
          <div className='container px-4 md:px-6'>
            <div className='grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]'>
              <div className='flex flex-col justify-center space-y-4'>
                <div className='space-y-2'>
                  <h1 className='text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none'>
                    Charlotte Hornets Stats Dashboard
                  </h1>
                  <p className='max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400'>
                    Access comprehensive player statistics and performance
                    analytics for the Charlotte Hornets. Sign in to explore
                    interactive visualizations and detailed player data.
                  </p>
                </div>
                <div className='flex flex-col gap-2 min-[400px]:flex-row'>
                  <Login />
                </div>
              </div>
              <div className='flex items-center justify-center'>
                <Image
                  src='/logo.png'
                  alt='Charlotte Hornets Logo'
                  width={400}
                  height={400}
                  className='rounded-lg object-cover'
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
