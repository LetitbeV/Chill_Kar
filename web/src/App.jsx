// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Homepage from "./pages/HomePage.jsx";
import Footer from "./components/Footer.jsx";
import MovieDetailsPage from "./pages/MovieDetailsPage.jsx";
import ListEvents from "./pages/ListEvents.jsx";
import PostEvent from './pages/PostEvent.jsx'
import EventsAnalyticsPage from "./pages/EventAnalyticsPage.jsx";
import EventDetailsPage from "./pages/EventDetailsPage.jsx";
import User from "./pages/User.jsx";
import Organizer from "./pages/Organizer.jsx";

const Layout = () => {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-yellow-50 to-yellow-100">
        <Navbar />
        {/* <SearchBar /> */}
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/movies/:movieId" element={<MovieDetailsPage />} />
          <Route path="/events/:owner/:eventId" element={<EventDetailsPage />} />
          <Route path="/Movies" element={<ListEvents eventType={`Movies`} />} />
          <Route path="/Sports" element={<ListEvents eventType={`Sports`} />} />
          <Route path="/Concerts" element={<ListEvents eventType={`Concert`} />} />
          <Route path="/Events" element={<ListEvents />} />
          <Route path="/events-analytics" element={<EventsAnalyticsPage />} />
          <Route path="/PostEvent" element={<PostEvent />} />
          <Route path="/User" element={<User />} />
          <Route path="/Organizer" element={<Organizer />} />
        </Routes>
      <Footer />
      </main>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<Layout />} />
      </Routes>
    </Router>
  );
};

export default App;