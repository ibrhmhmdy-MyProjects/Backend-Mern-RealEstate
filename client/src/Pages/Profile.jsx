import { useDispatch, useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react"
import {getDownloadURL, getStorage, list, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase.js'
import {Link} from 'react-router-dom'
import { updateUserStart,updateUserSuccess,updateUserFailure,
   deleteUserStart,deleteUserSuccess,deleteUserFailure, 
   signOutStart,signOutSuccess,signOutFailure } from "../redux/user/userSlice.js"

export default function Profile() {
  const {currentUser, loading, error} = useSelector((state)=> state.user)
  const dispatch = useDispatch()
  const fileRef = useRef(null)
  const [imageFile, setImageFile] = useState(undefined)
  const [uploadPerc, setUploadPerc] = useState(0)
  const [uploadFileError, setUploadFileError] = useState(false)
  const [formData, setFormData] = useState({})
  const [success, setSuccess] = useState(false)
  const [showListingError, setShowListingError] = useState(false)
  const [userListings,setUserListings] = useState([])

  useEffect(()=>{
    if(imageFile){
      handleUploadFile(imageFile)
    }
  }, [imageFile])

  const handleUploadFile = (image)=>{
    const storage = getStorage(app)
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef,image)

    uploadTask.on('state_changed', (snapshot)=> {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setUploadPerc(Math.round(progress))
    },
    (error) => {
      setUploadFileError(true)
    },
    ()=> {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl)=>{
        setFormData({...formData, avatar: downloadUrl})
      })
    });
  }

  const handleChange = (e)=>{
    setFormData({...formData, [e.target.id] : e.target.value})
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    try {
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method: "POST",
        headers: {
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json()
      console.log(data);
      if(data.success === false){
        dispatch(updateUserFailure(data.message))
        return
      }
      dispatch(updateUserSuccess(data))
      setSuccess(true)
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }
  
  const handleDeleteUser = async()=>{
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method: 'DELETE'
      })

      const data = await res.json()

      if(data.success === false){
        dispatch(deleteUserFailure(data.message))
        return
      }
      dispatch(deleteUserSuccess(data))
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignOutUser = async()=>{
    try {
      dispatch(signOutStart())
      const res = await fetch('/api/auth/signout')
      const data = await res.json()
      if(data.success === false){
        dispatch(deleteUserFailure(data.message))
        return
      }
      dispatch(deleteUserSuccess(data))
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }
  const handleShowListings = async()=>{
    try {
      setShowListingError(false)
      const res = await fetch(`/api/user/listings/${currentUser._id}`)
      const data = await res.json();
      if(data.success === false){
        setShowListingError(true)
        return;
      }
      setUserListings(data)
    } catch (error) {
      setShowListingError(true)
    }
  }

  const handleDeleteListing = async(listingId)=>{
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE'
      });
      const data = res.json()
      if(data.success === false){
        console.log(data.message);
        return;
      }
      setUserListings(prev => prev.filter((listing)=> listing._id !== listingId))
    } catch (error) {
      console.log(error.message);
    }
  }

  return (

    <div className='max-w-lg mx-auto p-3'>
      <h1 className='text-3xl text-center font-semibold my-7'>Profile</h1>
      <form onSubmit={handleSubmit} 
            className='flex flex-col gap-7'>
        <input 
          onChange={(e)=> setImageFile(e.target.files[0])} 
          type="file" 
          ref={fileRef} 
          hidden 
          accept="image/*"/>
        
        <img src={formData.avatar || currentUser.avatar} alt="Profile"
            onClick={()=> fileRef.current.click()} 
            className="rounded-full w-24 h-24 object-cover self-center mt-2 cursor-pointer"/>
        
        {uploadFileError ? 
          (<p className="text-red-700 text-center">Error Image Upload</p>) :
          uploadPerc > 0 && uploadPerc < 100 ?
          (<p className="text-slate-700 text-center">Uploading {uploadPerc}%</p>) :
          uploadPerc === 100 ? 
          (<p className="text-green-900 text-center">Image Successfully Uploaded!</p>) : ''
        }

        <input 
          type="text" 
          defaultValue={currentUser.username} 
          onChange={handleChange} 
          className='p-3 rounded-lg border' 
          placeholder='UserName' 
          id="username" />
        
        <input 
          type="email" 
          defaultValue={currentUser.email} 
          onChange={handleChange} 
          className='p-3 rounded-lg border' 
          placeholder='Email' 
          id="email" />
        
        <input 
          type="password" 
          defaultValue={currentUser.password} 
          onChange={handleChange} 
          className='p-3 rounded-lg border' 
          placeholder='Password' 
          id="password" />
        
        <button disabled={loading}
          className='text-white bg-slate-700 p-3 rounded-lg hover:opacity-95 disabled:opacity-80 uppercase'>
          {loading ? 'Loading..' : 'Update'}
        </button>
        <Link to="/create-listing"
          className="bg-green-700 rounded-lg p-3 uppercase text-white text-center hover:opacity-95">
            Create Listing
        </Link>
      </form>
      <div className="flex justify-between items-center">
        <button onClick={handleDeleteUser} className="text-red-700 font-semibold p-3 mt-3">Delete Account</button>
        <button onClick={handleSignOutUser} className='text-red-700 font-semibold p-3 mt-3'>SignOut</button>
      </div>
      {error ? (<p className="bg-red-100 rounded-lg border border-red-700 font-semibold py-3 mt-5 text-red-900 text-center">{error}</p>) : ''}
      {success ? (<p className="bg-green-100 rounded-lg border border-green-700 font-semibold py-3 mt-5 text-green-900 text-center">'User is Updated Successfully'</p>) : ''}
      <hr />
      <button onClick={handleShowListings} className="text-red-700 w-full font-semibold my-5">{userListings ? 'Show Listings' : ''}</button>
      <p>{showListingError? 'Error Showing Listings' : ''}</p>
      
      <h1 className="text-2xl mt-7 text-center font-semibold">Your Listings</h1>
      {userListings && userListings.length > 0 && userListings.map((listing) =>
        <div key={listing._id} className='border rounded-lg p-3 my-3 flex justify-between items-center gap-4'>
          <Link to={`/listing/${listing._id}`}>
            <img src={listing.imageUrls[0]} alt="image Listing Cover" className="w-16 h-16 object-contain rounded-lg"/>
          </Link>
          <Link to={`/listing/${listing._id}`} className="flex-1 ">
            <p className="text-slate-700 font-semibold hover:underline truncate">{listing.name}</p>
          </Link>
          <div className="flex flex-col items-center">
            <Link to={`/update-listing/${listing._id}`} className="text-green-700 font-semibold p-2 my-1 uppercase">
              Edit
            </Link>
            <button type="button" onClick={()=> handleDeleteListing(listing._id)} className="text-red-700 font-semibold p-2 my-1 uppercase">Delete</button>
          </div>
        </div>
      )}
    </div>

  )
}
