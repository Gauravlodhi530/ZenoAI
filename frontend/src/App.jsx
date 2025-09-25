import React from 'react'
import Mainroute from './AppRoutes/Mainroute'
import ThemeToggle from './components/ThemeToggle'
const App = () => {
  return (
    <div className='min-h-screen bg-white text-gray-900 dark:bg-neutral-950 dark:text-gray-100'>
      <header className='flex items-center justify-between px-4 sm:px-6 py-3 border-b dark:border-neutral-800'>
        <div className='flex items-center gap-2'>
          <span className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white font-semibold'>G</span>
          <span className='font-semibold'>GPT Clone</span>
        </div>
        <ThemeToggle />
      </header>
      <main className='px-4 sm:px-6 py-6'>
        <Mainroute />
      </main>
    </div>
  )
}

export default App
