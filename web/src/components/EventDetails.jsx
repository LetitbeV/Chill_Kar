import React, { useState, useEffect } from "react";
import { Star, Share, X } from "lucide-react";
import { getImageFromPinata } from "../contractLogic/pinataUtils";
import defaultImage from "../../public/images/anime/anime1.jpeg";
import NFTCard from "./NFTCard";
import nft from "../SampleData/NFTData.json";
import getEventsByEventId from "../contractLogic/getEventsByEventId";
import getEventOnChain from "../contractLogic/getEventsOnChain";
import { buyTicket } from "../contractLogic/buyTicket";

const EventDetails = ({ movie }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [image, setImage] = useState(defaultImage);
  const [event, setEvent] = useState(null);
  const [eventOnChain, setEventOnChain] = useState([]);
  const [bookingData, setBookingData] = useState({
    age: "",
    gender: "",
    region: "",
    type: "",
    eventCategory: movie?.eventType || "Other Events",
    timestamp: new Date().toISOString(),
  });

  function convertEpochToIST(epoch) {
    const date = new Date(epoch * 1000); // Epoch is in seconds, convert to ms
    const istOffset = 5.5 * 60; // IST is UTC + 5:30, in minutes
    const localDate = new Date(date.getTime() + istOffset * 60 * 1000);
    return localDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  }

  const getData = async (imageCID, eventId) => {
    let result = await getImageFromPinata(imageCID);
    if (!result) {
      console.log("no image");
      return null;
    }
    setImage(result);

    result = await getEventsByEventId(eventId);
    let event = await getEventOnChain(eventId);
    console.log("eventOnChain: ", event);
    setEventOnChain(event);
    console.log("event: ", result[0]);
    setEvent(result[0]);
  };

  useEffect(() => {
    const handleScroll = () => {
      // Show fixed booking button when scrolled past hero section
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 400);
    };

    getData(movie.poster, movie.eventId);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [movie.eventId]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    const type = bookingData.type.toLowerCase();

    if (!event || !event.args || !eventOnChain) {
      console.error("Event or eventOnChain data not loaded.");
      return;
    }

    let tokenId = null;
    let price;

    if (type === "vip") {
      const sold = Number(eventOnChain.vipTicketSold);
      const vipTokenIds = event.args.tokenIds.slice(
        Number(event.args.vipMaxTickets)
      );
      tokenId = vipTokenIds[sold];
      price = event.args.vipTicketPrice.toString();
    } else if (type === "general") {
      const sold = Number(eventOnChain.generalTicketSold);
      const generalTokenIds = event.args.tokenIds.slice(
        0,
        Number(event.args.generalMaxTickets)
      );
      tokenId = generalTokenIds[sold];
      price = event.args.generalTicketPrice.toString();
    } else {
      console.error("Invalid ticket type selected");
      return;
    }

    if (tokenId === undefined) {
      console.error("No available token ID for this ticket type");
      return;
    }

    console.log("Booking data:", bookingData);
    console.log("Token ID to buy:", tokenId.toString());
    console.log("price: ", price);
    const tx = await buyTicket(tokenId.toString(), price);

    console.log("Tx hash: ", tx.hash);

    setShowBookingModal(false);
  };

  const regions = [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Hyderabad",
    "Chennai",
    "Kolkata",
  ];

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
                    <label className="block text-sm font-medium mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded"
                      value={bookingData.age}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, age: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Gender
                    </label>
                    <select
                      className="w-full p-2 border rounded"
                      value={bookingData.gender}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          gender: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Region
                    </label>
                    <select
                      className="w-full p-2 border rounded"
                      value={bookingData.region}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          region: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select region</option>
                      {regions.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Type
                    </label>
                    <select
                      className="w-full p-2 border rounded"
                      value={bookingData.type}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          type: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select Type of Ticket</option>
                      <option value="vip">VIP</option>
                      <option value="general">General</option>
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
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "auto",
          minHeight: "380px",
        }}
      >
        <div className="container mx-auto px-4 py-8 h-full flex flex-col md:flex-row items-center md:items-end">
          {/* Movie Poster */}
          <div className="hidden md:block md:w-64 relative mr-8 mb-6">
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img src={image} alt={movie.title} className="w-full h-auto" />
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
              <span>{movie.genres && movie.genres.join(", ")}</span>
              <span className="mx-2">•</span>
              <span>{event && convertEpochToIST(event.args[7])}</span>
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
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          About the movie
        </h2>
        <p className="text-gray-700 leading-relaxed mb-8">
          {movie.description}
        </p>

        <h2 className="text-3xl font-bold mb-4 underline decoration-yellow-500 ">
          Event NFTs
        </h2>
        {event && (
          <div className="NFTcards flex min-w-7/12 justify-around">
            <NFTCard
              data={nft.nfts[2]}
              price={event.args.vipTicketPrice.toString()}
              total={event.args.vipMaxTickets.toString()}
              image={image}
              isVIP={true}
              tokenIds={event.args.tokenIds.slice(
                Number(event.args.generalMaxTickets)
              )}
              sold={eventOnChain.vipTicketSold.toString()}
            />
            <NFTCard
              data={nft.nfts[4]}
              image={image}
              price={event.args.generalTicketPrice.toString()}
              total={event.args.generalMaxTickets.toString()}
              tokenIds={event.args.tokenIds.slice(
                0,
                Number(event.args.generalMaxTickets)
              )}
              sold={eventOnChain.generalTicketSold.toString()}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
