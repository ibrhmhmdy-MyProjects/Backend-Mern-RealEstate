import { Link } from 'react-router-dom'
import {FaBath, FaBed, FaLocationDot} from 'react-icons/fa6'
export default function ListingItem({listing}) {
  return (
    <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg sm:w-[330px] lg:w-2/1'>
        <Link to={`/listing/${listing._id}`}>
            <img src={listing.imageUrls[0]} alt="Image Cover" 
            className='w-full h-[320px] sm:h-[220px] object-cover transition-scale hover:scale-105 duration-300'  />
            <div className="p-3 ">
                <p className='text-xl font-semibold p-3 '>{listing.name}</p>
                <p className='text-xl font-semibold p-3 flex items-center gap-3'>
                    <FaLocationDot color='green' /> {listing.address}
                </p>
                <div className="p-3">
                    <p className='text-sm text-gray-600 line-clamp-2'>
                        {listing.description}
                    </p>
                </div>
                <div className="text-gray-700 text-lg p-3">
                    $
                    {listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')} 
                    {listing.type === 'rent' ? ' / Month' : ' Sale'}
                </div>
                <div className="flex gap-3 p-3">
                    <div className="flex items-center gap-1 text-slate-700 text-sm">
                        <FaBed />
                        {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : '1 Bed'}
                    </div>
                    <div className="flex items-center gap-1 text-slate-700 text-sm">
                        <FaBath />
                        {listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : '1 Bath'}
                    </div>
                </div>
            </div>

        </Link>
    </div>
  )
}
