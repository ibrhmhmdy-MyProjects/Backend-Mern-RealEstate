import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import OAuth from "../Components/OAuth"

export default function SignUp() {

  const [formData, setFormData] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const handleChange = (e)=>{
    setFormData({
      ...formData,
      [e.target.id] : e.target.value,
    })
  }
  const handleSubmit = async (e)=>{
    e.preventDefault()
    try {
      setLoading(true)
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if(data.success === false){
        setLoading(false)
        setError(data.message)
        return
      }
      setLoading(false)
      navigate('/signin')
    } catch (error) {
      setLoading(false)
      setError(error.message)
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-7'>
        <input type="text" id="username" onChange={handleChange} placeholder='UserName' className='border rounded-lg p-3' />
        <input type="email" id="email" onChange={handleChange} placeholder='Email' className='border rounded-lg p-3' />
        <input type="password" id="password" onChange={handleChange} placeholder='Password' className='border rounded-lg p-3' />
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading? 'Loading...' : 'SignUp'}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-3 mt-7 ">
        <p className="font-bold">Have an Account?</p>
        <Link to={"/signin"} >
          <span className="text-blue-700 font-semibold">SignIn</span>
        </Link>
      </div>
      {error && <p className="mt-5 text-red-700">{error}</p>}
      
    </div>
  )
}
