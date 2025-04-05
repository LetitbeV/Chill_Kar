import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { getImageFromPinata } from "../contractLogic/pinataUtils";
import defaultImage from "../../public/images/anime/anime1.jpeg";
import getDataByAddr from "../contractLogic/getIPFSHash";

const EventTut = ({ movie }) => {
  const [image, setImage] = useState(defaultImage);
  const [movieData, setMovieData] = useState(null);
  const navigate = useNavigate();
  const handleCardClick = () => {
    navigate(`/movies/${movie.id}`);
  };

  const getData = async (imageCID, address) => {
    let result = await getImageFromPinata(imageCID);
    console.log("result: ", result);
    if (!result) {
      console.log("no image");
      return null;
    }
    setImage(result);

    result = await getDataByAddr(address, movie);
    console.log("result:: ", result);
    setMovieData(result);
  };

  useEffect(() => {
    getData(movie.CID, movie.args[1]);
  }, [movie]);

  const data = movie.args;

  return (
    <div
      className="w-56 relative group cursor-pointer transition-transform hover:scale-105"
      onClick={handleCardClick}
    >
      {/* Movie Poster */}
      <div className="rounded-lg overflow-hidden relative shadow-md ">
        <img
          src={image}
          alt={data.eventId.toString()}
          className="w-full h-80 object-cover"
        />

        {/* Rating Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
          <div className="flex items-center">
            <Star size={16} className="text-yellow-400 fill-yellow-400" />
            <span className="text-white text-sm ml-1">8.9/10</span>
            <span className="text-gray-300 text-sm ml-1">1512 Votes</span>
          </div>
        </div>
      </div>

      {/* Movie Title */}
      <h3 className="mt-2 font-medium text-gray-800 truncat">
        {movieData && movieData.title}
      </h3>

      {/* Genres */}
      <p className="text-xs text-gray-500">{movieData && movieData.genres}</p>
    </div>
  );
};

export default EventTut;
