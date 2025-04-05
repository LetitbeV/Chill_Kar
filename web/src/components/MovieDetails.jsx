import React, { useState, useEffect } from 'react';
import { Star, Share, X } from 'lucide-react';
import defaultPoster from '/images/anime/anime4.png'; // Default poster image
import NFTCard from './NFTCard';
import nft from '../SampleData/NFTData.json'

const MovieDetails = ({ movie }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    age: '',
    gender: '',
    isVIP: false,
    region: '',
    eventCategory: movie?.eventType || 'Other Events',
    timestamp: new Date().toISOString()
  });

  useEffect(() => {
    const handleScroll = () => {
      // Show fixed booking button when scrolled past hero section
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 400);
    };

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
                      onChange={(e) => setBookingData({ ...bookingData, age: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Gender</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={bookingData.gender}
                      onChange={(e) => setBookingData({ ...bookingData, gender: e.target.value })}
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
                      onChange={(e) => setBookingData({ ...bookingData, region: e.target.value })}
                      required
                    >
                      <option value="">Select region</option>
                      {regions.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="vipTicket"
                      checked={bookingData.isVIP}
                      onChange={(e) => setBookingData({ ...bookingData, isVIP: e.target.checked })}
                      className="h-4 w-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
                    />
                    <label htmlFor="vipTicket" className="text-sm font-medium text-gray-700">
                      Book VIP tickets
                    </label>
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

      {/* Hero Section with Background Image */}
      <div
        className="relative w-full bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.8) 20%, transparent), url(${movie.backdropImage || movie.poster})`,
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
                src={movie.poster}
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
              <span className="text-xl font-bold ml-2">{movie.rating}/10</span>
              <span className="ml-2 text-gray-300">({movie.votes})</span>
            </div>
            {/* Movie Details */}
            <div className="flex flex-wrap items-center text-sm text-gray-300 mb-8">
              <span>{movie.genres && movie.genres.join(', ')}</span>
              <span className="mx-2">•</span>
              <span>{movie.releaseDate}</span>
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

        <h2 className='text-3xl font-bold mb-4 underline decoration-yellow-500 '>Event NFTs</h2>
        <div className="NFTcards flex min-w-7/12 justify-around">
          <NFTCard data={nft.nfts[2]} isVIP={true} />
          <NFTCard data={nft.nfts[4]}/>
        </div>

      </div>

    </div>
  );
};

export default MovieDetails;