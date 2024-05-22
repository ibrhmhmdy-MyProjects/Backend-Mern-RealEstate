import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { useState, useEffect } from "react"
import { app } from "../firebase"
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

export default function UpdateListing() {
  const {currentUser} = useSelector(state => state.user)
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [imageUploadError, setImageUploadError] = useState(false)
  const [error, setError] = useState(false)
  const [creating, setCreating] = useState(false)
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false
  });
  const params = useParams()

  useEffect(()=>{
    const fetchListing = async()=>{
      const listingId = params.listingId
      console.log(listingId);
      const res = await fetch(`/api/listing/get/${listingId}`)
      const data = await res.json()
      if(data.success === false){
        console.log(data.message);
        return;
      }
      setFormData(data)
    }

    fetchListing()
  }, [])

  const handleImageSubmit = (e)=> {
    setUploading(true)
    if(files.length > 0 && files.length + formData.imageUrls.length < 7){
      const promises = []
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]))
      }
      Promise.all(promises)
      .then((urls) => {
        setFormData({
          ...formData, 
          imageUrls: formData.imageUrls.concat(urls)
        })
        setUploading(false)
        setImageUploadError(false)
      }).catch(err => {
        setUploading(false)
        setImageUploadError('Image Upload Failed (2 MB max per Image)', err)
      })
    }else{
      setUploading(false)
      setImageUploadError('You can upload 6 images per Lisitng')
    }
  }
  const storeImage = async(file) => {
    return new Promise((resolve,reject)=>{
      const storage = getStorage(app)
      const fileName = new Date().getTime() + file.name
      const storageRef = ref(storage, fileName)
      const uploadTask = uploadBytesResumable(storageRef, file)
      uploadTask.on("state_changed",
      (snapshot)=>{
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% Done`)
      }, (error)=>{
        reject(error)
      },()=>{
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
          resolve(downloadURL)
        });
      })
    })
  }

  const handleImageRemove = (index)=> {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_,i)=> i !== index),
    })
  }

  const handleChange = (e)=> {
    if(e.target.id === 'rent' || e.target.id === 'sale'){
      setFormData({
        ...formData,
        type: e.target.id
      })
    }
    if(e.target.id === 'offer' || e.target.id === 'furnished' || e.target.id === 'parking'){
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked
      })
    }
    if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
      setFormData({
        ...formData,
        [e.target.id]: e.target.value
      })
    }
  }
  const handleSubmit = async(e)=>{
    e.preventDefault()
    try {
      setCreating(true)
      setError(false)
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id
        })
      })
      const data = await res.json()
      console.log(data);
      setCreating(false)
      if(data.success === false){
        setError(data.message)
      }
      navigate(`/listing/${params.listingId}`)
    } catch (error) {
      setCreating(false)
      setError(error.message)
    }
  }

  return (

    <main className="mx-auto max-w-4xl my-3">
      <h1 className="text-center font-semibold p-3 text-4xl my-7">Update a Listing</h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input type="text" id="name" placeholder="Name" 
          className="border rounded-lg p-3" required
          onChange={handleChange} value={formData.name}/>
          <textarea id="description" placeholder="Description"
          className="border rounded-lg p-3"
          onChange={handleChange} value={formData.description}></textarea>
          <input type="text" id="address" placeholder="Address" 
          className="border rounded-lg p-3" required
          onChange={handleChange} value={formData.address}/>
          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5"
              onChange={handleChange} checked={formData.type === 'sale'}/>
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5"
              onChange={handleChange} checked={formData.type === 'rent'}/>
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5"
              onChange={handleChange} checked={formData.parking}/>
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5"
              onChange={handleChange} checked={formData.furnished}/>
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5"
              onChange={handleChange} checked={formData.offer}/>
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input type="number" id="bedrooms" min='1' max='10'
              className="border rounded-lg border-gray-300 p-3" required 
              onChange={handleChange} value={formData.bedrooms}/>
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input type="number" id="bathrooms" min='1' max='10'
              className="border rounded-lg border-gray-300 p-3" required 
              onChange={handleChange} value={formData.bathrooms}/>
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input type="number" id="regularPrice" min='0' max='100000000000'
              className="border rounded-lg border-gray-300 p-3" required 
              onChange={handleChange} value={formData.regularPrice}/>
              <div className="flex flex-col items-center">
                <p className="font-semibold">Regular Price</p>
                <span className="text-sm">($ / Month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="number" id="discountPrice" min='0' max='1000'
              className="border rounded-lg border-gray-300 p-3" required 
              onChange={handleChange} value={formData.discountPrice}/>
              <div className="flex flex-col items-center">
                <p className="font-semibold">Discount Price</p>
                <span className="text-sm">(% / Month)</span>
              </div> 
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">Images: 
            <span className="font-normal text-gray-600 ml-2">
              the first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input type="file" onChange={(e)=> setFiles(e.target.files)} className="border border-gray-300 rounded w-full p-3 gap-4" id="images" accept="image/*" multiple />
            <button type="button" onClick={handleImageSubmit} disabled={uploading}
              className="border border-green-700 text-green-700 rounded-lg p-3 uppercase hover:shadow-lg hover:opacity-95 disabled:opacity-80">
                {uploading ? 'Uploading...' : 'upload'}
            </button>
          </div>
            <p className="text-red-700">{imageUploadError && imageUploadError}</p>
            {
              formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <img key= {url} src={url} alt="listing Images" className="object-fit w-20 h-20 rounded-lg"/>
                  <button type="button" onClick={() => handleImageRemove(index)}  className="text-red-700 hover:opacity-95">Delete</button>
                </div>
              ))
            }
          <button disabled={creating || uploading} className="border bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            {creating ? 'Updating...' : 'update listing'}
          </button>
          {error && <p className="text-red-700 text-sm" >{error}</p>}
        </div>
      </form>
    </main>

  )
}
