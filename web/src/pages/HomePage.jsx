// src/pages/home.page.jsx
import React, { useEffect, useState } from "react";
// import defaultImage from '../../public/images/gaming/gaming1.webp';
import MovieCard from "../components/MovieCard";
import EventCard from "../components/EventCard";
import ScrollableSection from "../Features/ScrollableSection";
import MoviesData from "../SampleData/MoviesData.json";
import allEventsData from "../SampleData/AllEventsData.json";
import StreamBanner from "../components/StreamBanner";
import getEvents from "../contractLogic/getEvents";
import EventTut from "../components/EventTut";

const Homepage = () => {
  const { recommendedMovies, TrendingGenres } = MoviesData;
  const [eventsData, setEventsData] = useState(null);

  useEffect(() => {
    async function getEventsList() {
      const events = await getEvents();
      setEventsData(events);
      console.log("events", events)
    }
    getEventsList();
  }, []);

  return (
    <div className="mr-auto ml-auto mb-20 max-w-11/12 rounded-4xl bg-white pb-8 pt-2 mt-10 px-4">
      {/* Recommended Events Section */}
      <ScrollableSection
        title="Recommended Events"
        items={allEventsData.Events.slice(-13, -3)}
        renderItem={(movie) => <MovieCard movie={movie} />}
        seeAllLink="/Movies"
        containerId="recommended-events"
      />

      {eventsData && (
        <ScrollableSection
          title="Trending Events"
          items={eventsData}
          renderItem={(Event) => <EventTut movie={Event} />}
          seeAllLink="/Events"
          containerId="trending-events"
        />
      )}

      {/* Stream Banner */}
      <StreamBanner />

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
