import {FaSearch} from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import {useSelector} from 'react-redux'
import { useEffect, useState } from 'react'

export default function Header() {
    const {currentUser} = useSelector((state)=> state.user)
    const [searchTerm, setSearchTerm] = useState('')
    const navigate = useNavigate()
    const handleSubmit = (e)=>{
        e.preventDefault()

        const urlParams = new URLSearchParams(window.location.search)
        urlParams.set('searchTerm', searchTerm)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }

    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search);
        const SearchTermFromUrl = urlParams.get('searchTerm');
        if(SearchTermFromUrl) setSearchTerm(SearchTermFromUrl)
    }, [location.search]);

  return (
    <header className='bg-slate-200 shadow-md'>
        <div className="flex justify-between items-center mx-auto p-3 max-w-6xl">
            <Link to='/'>
                <h1 className="flex flex-wap font-bold text-sm sm:text-xl">
                    <span className="text-slate-500">Real</span>
                    <span className="text-slate-700">EState</span>
                </h1>
            </Link>
            <form onSubmit={handleSubmit} className='flex items-center bg-slate-100 rounded-lg p-3'>
                <input type="text" 
                    placeholder='Search...' 
                    className='bg-transparent focus:outline-none w-24 sm:w-64'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} />
                <button >
                    <FaSearch className='text-slate-600' />
                </button>
            </form>
            <ul className='flex gap-4'>
                <Link to='/'>
                    <li className='hidden sm:inline text-slate-700 hover:underline'>Home</li>
                </Link>
                <Link to='/about'>
                    <li className='hidden sm:inline text-slate-700 hover:underline'>About</li>
                </Link>
                <Link to='/profile'>
                    {
                        currentUser ? (
                            <img className='rounded-full object-cover w-7 h-7' src={currentUser.avatar} alt="profile" />
                        ):(
                            <li className='hidden sm:inline text-slate-700 hover:underline'>Signin</li>)
                    }
                </Link>
            </ul>
        </div>
    </header>
  )
}
