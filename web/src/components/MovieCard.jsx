import React from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import defaultImage from "../../public/images/art/art2.jpeg";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const handleCardClick = () => {
    navigate(`/movies/${movie.id}`);
  };
  return (
    <div
      className="w-56 relative group cursor-pointer transition-transform hover:scale-105"
      onClick={handleCardClick}
    >
      {/* Movie Poster */}
      <div className="rounded-lg overflow-hidden relative shadow-md ">
        <img
          src={movie.poster || defaultImage}
          alt={movie.title}
          className="w-full h-80 object-cover"
        />

        {/* Rating Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
          <div className="flex items-center">
            <Star size={16} className="text-yellow-400 fill-yellow-400" />
            <span className="text-white text-sm ml-1">{movie.rating}/10</span>
            <span className="text-gray-300 text-sm ml-1">
              {movie.votes} Votes
            </span>
          </div>
        </div>
      </div>

      {/* Movie Title */}
      <h3 className="mt-2 font-medium text-gray-800 truncat">{movie.title}</h3>

      {/* Genres */}
      <p className="text-xs text-gray-500">{movie.genres.join("/")}</p>
    </div>
  );
};

export default MovieCard;