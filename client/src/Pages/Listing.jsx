import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation} from 'swiper/modules';
import 'swiper/css/bundle';
import { FaBath, FaBed, FaChair, FaCheckDouble, FaLocationDot, FaP, FaRegCopy, FaSquareParking } from "react-icons/fa6";
import { useSelector } from 'react-redux'
import Contact from '../Components/Contact';
import Footer from '../Components/Footer';

export default function Listing() {
    SwiperCore.use([Navigation])
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)
    const [listing, setListing] = useState(null)
    const params = useParams()
    const {currentUser} = useSelector((state) => state.user)
    const [contact, setContact] = useState(false)
    const [copySuccess, setCopySuccess] = useState(false)
    
    useEffect(()=>{
        const fetchListings = async()=>{
            try {
                setLoading(true)
                const res = await fetch(`/api/listing/get/${params.listingId}`)
                const data = await res.json()
                if(data.success === false){
                    setLoading(false)
                    setError(true)
                    return;
                }
                setLoading(false)
                setListing(data)
            } catch (error) {
                setError(true)
                setLoading(false)
            }
        }
        fetchListings()
    }, [params.listingId])

    const copyUrl = async()=>{
        setCopySuccess(false)
        const url = location.href;
        await navigator.clipboard.writeText(url);
        setCopySuccess(true);
    }
    return (
        <>
        <main>
            {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
            {error && <p className='text-center my-7 text-2xl text-red-700 font-semibold'>Something went Wrong!</p>}
            {listing && !loading && !error && (
                <div>
                    <span onClick={copyUrl} className='fixed top-[10%] right-[2%] z-10 rounded-full bg-slate-600 cursor-pointer text-4xl p-4'>
                        {copySuccess ? <FaCheckDouble color='white' /> : <FaRegCopy color='white'/>}
                        
                        
                    </span>
                    <Swiper className='relative' navigation>
                        {listing.imageUrls.map((url)=> (
                            <SwiperSlide key={url}>
                                <div className="h-[550px] " style={{background: `url(${url}) center no-repeat`, backgroundSize: 'cover'}}>
                                </div>
                            </SwiperSlide>
                        ) )}
                    </Swiper>

                    <div className="flex flex-col max-w-2xl mx-auto my-10 gap-3 p-3">
                        <h1 className='text-2xl font-semibold '>{`${listing.name} - Price : $${listing.regularPrice}`} </h1>
                        <p className='flex justify-start items-center gap-4 text-xl mt-6'>
                            <FaLocationDot color='green'  /> {`${listing.address}`} 
                        </p>
                        <div className="flex gap-2 ">
                            <p className="bg-red-900 text-white w-full max-w-[200px] text-center p-1 rounded-md">
                                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                            </p>
                            {listing.offer && (
                                <p className="bg-green-900 text-white w-full max-w-[200px] text-center p-1 rounded-md">
                                    ${+listing.regularPrice - +listing.discountPrice} 
                                </p>
                            )}
                        </div>
                        <p className='mt-2'>
                            <span className='text-slate-600 font-semibold text-xl'>Description - </span>{`${listing.description}`}
                        </p>
                        <ul className='flex gap-3 text-green-900 font-semibold text-sm mt-2 flex-wrap'>
                            <li className='flex items-center whitespace-nowrap gap-2'>
                                <FaBed className='text-lg gap-1' />
                                {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : '1 Bed'}
                            </li>
                            <li className='flex items-center whitespace-nowrap gap-2'>
                                <FaBath />
                                {listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : '1 Bath'}
                            </li>
                            <li className='flex items-center whitespace-nowrap gap-2'>
                                <FaSquareParking />
                                {listing.parking ? 'Yes Parking' : 'No Parking'}
                            </li>
                            <li className='flex items-center whitespace-nowrap gap-2'>
                                <FaChair />
                                {listing.furnished ? 'Yes Furnished' : 'Not Furnished'}
                            </li>
                        </ul>
                        {currentUser && listing?.userRef !== currentUser._id && !contact && (
                            <button onClick={() => setContact(true)} className="bg-slate-700 text-white text-center font-semibold my-3 p-3 rounded-lg w-full uppercase hover:opacity-95 disabled:opacity-80">
                                Contact LandLord
                            </button>
                        )}
                        {contact && (
                            <Contact listing={listing}/>
                        )}
                    </div>
                </div>
            )}
        </main>
        <Footer />
        </>
    ) 
}
