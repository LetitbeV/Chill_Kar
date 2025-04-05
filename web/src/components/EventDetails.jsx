import React, { useState, useEffect } from 'react';
import { Star, Share, X } from 'lucide-react';
import { getImageFromPinata } from '../contractLogic/pinataUtils';
import defaultImage from "../../public/images/anime/anime1.jpeg";

const EventDetails = ({ movie }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [image,setImage] =useState(defaultImage);
  const [bookingData, setBookingData] = useState({
    age: '',
    gender: '',
    region: '',
    eventCategory: movie?.eventType || 'Other Events',
    timestamp: new Date().toISOString()
  });

  const getImage = async (imageCID) => {
    let result = await getImageFromPinata(imageCID);
    if (!result) {
      console.log("no image");
      return null;
    }
    setImage(result);
  }

  useEffect(() => {
    const handleScroll = () => {
      // Show fixed booking button when scrolled past hero section
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 400);
    };

    getImage(movie.poster);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!movie) return null;

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Booking data:', bookingData);
    setShowBookingModal(false);
  };

  const regions = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata'];

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Booking Modal */}
      {showBookingModal && (
        <>
          {/* Dark overlay */}
          <div className="fixed inset-0 bg-black opacity-50 z-40" />
          {/* Modal content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Book Tickets</h2>
                <button onClick={() => setShowBookingModal(false)}>
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleBookingSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Age</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded"
                      value={bookingData.age}
                      onChange={(e) => setBookingData({...bookingData, age: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Gender</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={bookingData.gender}
                      onChange={(e) => setBookingData({...bookingData, gender: e.target.value})}
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Region</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={bookingData.region}
                      onChange={(e) => setBookingData({...bookingData, region: e.target.value})}
                      required
                    >
                      <option value="">Select region</option>
                      {regions.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Fixed Book Tickets Button (appears on scroll) */}
      {isScrolled && (
        <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 py-3 px-4 flex justify-between items-center">
          <h2 className="text-lg font-bold">{movie.title}</h2>
          <button 
            onClick={() => setShowBookingModal(true)}
            className="bg-yellow-500 hover:bg-yellow-600 text-black cursor-pointer font-bold py-2 px-6 rounded-md"
          >
            Book tickets
          </button>
        </div>
      )}
``
      {/* Hero Section with Background Image */}
      <div
        className="relative w-full bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.8) 20%, transparent), url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: 'auto',
          minHeight: '380px'
        }}
      >
        <div className="container mx-auto px-4 py-8 h-full flex flex-col md:flex-row items-center md:items-end">
          {/* Movie Poster */}
          <div className="hidden md:block md:w-64 relative mr-8 mb-6">
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img
                src={image}
                alt={movie.title}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Movie Info */}
          <div className="text-white flex-1 pb-6">
            <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>

            {/* Rating */}
            <div className="flex items-center mb-4">
              <Star size={24} className="text-yellow-500 fill-yellow-500" />
              <span className="text-xl font-bold ml-2">9/10</span>
              <span className="ml-2 text-gray-300">1000</span>
            </div>
            {/* Movie Details */}
            <div className="flex flex-wrap items-center text-sm text-gray-300 mb-8">
              <span>{movie.genres && movie.genres.join(', ')}</span>
              <span className="mx-2">•</span>
              <span>{movie.eventTime}</span>
              <span className="mx-2">•</span>
              <span>{movie.venue}</span>
            </div>

            {/* Book Tickets Button */}
            <button 
              onClick={() => setShowBookingModal(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-md cursor-pointer"
            >
              Book tickets
            </button>
          </div>
        </div>
      </div>

      {/* About the movie section */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">About the movie</h2>
        <p className="text-gray-700 leading-relaxed mb-8">
          {movie.description}
        </p>

      </div>

    </div>
  );
};

export default EventDetails;