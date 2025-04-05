// src/pages/home.page.jsx
import React from 'react';
// import defaultImage from '../../public/images/gaming/gaming1.webp';
import MovieCard from '../components/MovieCard';
import EventCard from '../components/EventCard';
import ScrollableSection from '../Features/ScrollableSection';
import MoviesData from '../SampleData/MoviesData.json';
import allEventsData from '../SampleData/AllEventsData.json'

const Homepage = () => {
  const { recommendedMovies, TrendingGenres } = MoviesData;

  return (
    <div className="mr-auto ml-auto mb-20 max-w-11/12 rounded-4xl bg-white pb-8 pt-2 mt-10 px-4">
      {/* Recommended Events Section */}
      <ScrollableSection
        title="Recommended Events"
        items={allEventsData.Events.slice(-13,-3)}
        renderItem={(movie) => <MovieCard movie={movie} />}
        seeAllLink="/Movies"
        containerId="recommended-events"
      />

      <ScrollableSection
        title="Trending Events"
        items={allEventsData.Events}
        renderItem={(Event) => <MovieCard movie={Event} />}
        seeAllLink="/Events"
        containerId="trending-events"
      />
      
      {/* Stream Banner */}
      <StreamBanner/>
      
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