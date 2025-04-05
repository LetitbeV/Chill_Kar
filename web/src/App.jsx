// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import SearchBar from "./components/SearchBar.jsx";
import moviesData from './SampleData/MoviesData.json'

import Homepage from "./pages/HomePage.jsx";
import ListEvents from "./pages/ListEvents.jsx";
import PostEvent from './pages/PostEvent.jsx'
import Login from './pages/Login';
import SignUp from './pages/SignUp';

const Layout = () => {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-yellow-50 to-yellow-100">
        <Navbar />
        <SearchBar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/Movies" element={<ListEvents eventType={`Movies`} />} />
          <Route path="/Sports" element={<ListEvents eventType={`Sports`} />} />
          <Route path="/Concerts" element={<ListEvents eventType={`Concert`} />} />
          <Route path="/Events" element={<ListEvents  />} />
          <Route path="/PostEvent" element={<PostEvent />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
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