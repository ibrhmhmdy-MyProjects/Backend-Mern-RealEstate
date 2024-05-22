import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = (currentDate) => currentDate = new Date().getFullYear();
  return (
    <div className='relative bottom-0 p-6 bg-slate-600 w-full mx-auto text-center text-white'>Made By <Link  className='text-yellow-500' to='https://ibrahimhamdy.net/'>Ibrahim Hamdy</Link> &copy; <span id='fullYear'>{currentYear()}</span></div>
  )
}
