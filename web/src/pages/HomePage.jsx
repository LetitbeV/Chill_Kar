// src/pages/home.page.jsx
import React from 'react';
// import defaultImage from '../../public/images/gaming/gaming1.webp';
import MovieCard from '../components/MovieCard';
import EventCard from '../components/EventCard';
import ScrollableSection from '../Features/ScrollableSection';
import MoviesData from '../SampleData/MoviesData.json';

const Homepage = () => {
  const { recommendedMovies, TrendingGenres } = MoviesData;

  return (
    <div className="mr-auto ml-auto mb-20 max-w-11/12 rounded-4xl bg-white pb-8 pt-2 mt-10 px-4">
      {/* Recommended Movies Section */}
      <ScrollableSection
        title="Recommended Movies"
        items={recommendedMovies}
        renderItem={(movie) => <MovieCard movie={movie} />}
        seeAllLink="/Movies"
        containerId="recommended-movies"
      />
      
      {/* Stream Banner */}
      <section className="py-4">
        <div className="container mx-auto px-4">
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="flex items-center p-4 md:p-6">
              <div className="flex flex-col md:flex-row items-center justify-between w-full">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="text-lg md:text-xl font-bold text-white mr-2">
                    <span>Chill</span>
                    <span className="text-yellow-500">Kar</span>
                  </div>
                  <div className="text-white font-bold text-lg md:text-2xl ml-2">STREAM</div>
                </div>
                <div className="text-yellow-400 font-medium text-center text-sm md:text-base">
                  Endless Entertainment Anytime. Anywhere!
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* TrendingGenres Section */}
      <ScrollableSection
        title="Trending Genres"
        items={TrendingGenres}
        renderItem={(event) => <EventCard event={event} />}
        seeAllLink="#"
        containerId="TrendingGenres"
      />
    </div>
  );
};

export default Homepage;