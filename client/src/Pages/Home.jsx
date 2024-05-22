import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation} from 'swiper/modules';
import 'swiper/css/bundle';
import ListingItem from '../Components/ListingItem';
import Footer from '../Components/Footer';

export default function Home() {
  SwiperCore.use([Navigation])
  const [offerListing, setOfferListing] = useState([])
  const [rentListing, setRentListing] = useState([])
  const [saleListing, setSaleListing] = useState([])
  console.log(offerListing);
  console.log(rentListing);
  console.log(saleListing);
  useEffect(()=>{
    const fetchOffer = async()=>{
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=3');
        const data= await res.json()
        setOfferListing(data)
        fetchRent()
      } catch (error) {
        console.log(error);
      }
    }
    const fetchRent = async()=>{
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=3');
        const data = await res.json();
        setRentListing(data)
        fetchSale()
      } catch (error) {
        console.log(error);
      }
    }
    const fetchSale = async()=>{
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=3');
        const data = await res.json();
        setSaleListing(data)
      } catch (error) {
        console.log(error);
      }
    }
    fetchOffer()
  }, []);


  return (
    <>
    <div>
      {/* Top */}
      <div className='flex flex-col gap-8 p-16 max-w-6xl mx-auto'>
        <h1 className='text-6xl font-semibold text-slate-700'>
          Find your next <span className='text-slate-400 font-semibold'>perfect</span> place with ease
        </h1>
        <p className='text-lg text-gray-700 font-semibold mt-3'>
          Real Estate will help you find your home fast, easy and comfortable. <br />
          Our expert support are always available.
        </p>
        <Link to={`/search`} className='text-slate-800 hover:text-blue-700 hover:underline font-semibold text-lg'>
          Let's start now...
        </Link>
      </div>
      {/* Swiper */}
      <Swiper navigation>
        {offerListing && offerListing.length > 0 && (
          offerListing.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div  style={{background: `url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize: 'cover', height: '500px'}} ></div>
            </SwiperSlide>
          ))
        )}
      </Swiper>
      {/* Show Listing Offer & Rent & Sale */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {
          offerListing && offerListing.length > 0 && (
            <div>
              <h2 className='text-2xl text-slate-600 font-semibold'>Recent Offer</h2>
              <div className="flex flex-wrap gap-4 mt-4">
                {
                  offerListing.map((listing)=>(
                    <ListingItem listing={listing} key={listing._id}/>
                  ))
                }
              </div>
            </div>
          )
        }
        <Link className='text-lg text-slate-400 hover:text-slate-700 mt-3 mx-auto w-full text-center' to={`/search?offer=true`} >Show More Offer</Link>
      </div>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {
          rentListing && rentListing.length > 0 && (
            <div className="">
              <h2 className='text-2xl text-slate-600 font-semibold'>Recent Places for Rent</h2>
              <div className="flex flex-wrap gap-4 mt-4">
                {
                  rentListing.map((listing)=>(
                    <ListingItem listing={listing} key={listing._id}/>
                  ))
                }
              </div>
            </div>
          )
        }
        <Link className='text-lg text-slate-400 hover:text-slate-700 mt-3 mx-auto w-full text-center' to={`/search?type=rent`} >Show More Rent</Link>
      </div>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {
          saleListing && saleListing.length > 0 && (
            <div className="">
              <h2 className='text-2xl text-slate-600 font-semibold'>Recent Places for Sale</h2>
              <div className="flex flex-wrap gap-4 mt-4">
                {
                  saleListing.map((listing)=>(
                    <ListingItem listing={listing} key={listing._id}/>
                  ))
                }
              </div>
            </div>
          )
        }
        <Link className='text-lg text-slate-400 hover:text-slate-700 mt-3 mx-auto w-full text-center' to={`/search?type=sale`} >Show More Sale</Link>
      </div>
    </div>
    <Footer />
    </>
  )
}
