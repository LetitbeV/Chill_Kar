import React, { useState, useEffect } from 'react';
import { Star, Share } from 'lucide-react';
import defaultPoster from '../../public/images/anime/anime4.png'; // Default poster image

const MovieDetails = ({ movie }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  console.log(movie);

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

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Fixed Book Tickets Button (appears on scroll) */}
      {isScrolled && (
        <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 py-3 px-4 flex justify-between items-center">
          <h2 className="text-lg font-bold">{movie.title}</h2>
          <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-md">
            Book tickets
          </button>
        </div>
      )}

      {/* Hero Section with Background Image */}
      <div
        className="relative w-full bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.8) 20%, transparent), url(${movie.backdropImage || movie.image})`,
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
              <Star size={24} className="text-red-500 fill-red-500" />
              <span className="text-xl font-bold ml-2">{movie.rating}/10</span>
              <span className="ml-2 text-gray-300">({movie.votes})</span>
            </div>

            {/* Movie Format */}


            {/* Movie Details */}
            <div className="flex flex-wrap items-center text-sm text-gray-300 mb-8">
              <span>{movie.genres && movie.genres.join(', ')}</span>
              <span className="mx-2">•</span>
              <span>{movie.releaseDate}</span>
            </div>

            {/* Book Tickets Button */}
            <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-md cursor-pointer">
              Book tickets
            </button>
          </div>

          {/* Share Button - Positioned on right side */}
        </div>
      </div>

      {/* About the movie section */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">About the movie</h2>
        <p className="text-gray-700 leading-relaxed mb-8">
          {movie.description}
        </p>

        {/* Cast Section */}
        {/* <h2 className="text-2xl font-bold text-gray-900 mb-6">Cast</h2> */}

      </div>

    </div>
  );
};

export default MovieDetails;