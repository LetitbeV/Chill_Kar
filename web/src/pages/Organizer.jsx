import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import getDataByAddr from "../contractLogic/getDataByAddr";
import getEvents from "../contractLogic/getEvents";
import { useNavigate } from "react-router-dom";

const Organizer = () => {
  const [organizerAddress, setOrganizerAddress] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const handleCardClick = (addr, eventId) => {
    navigate(`/events/${addr}/${eventId}`);
  };

  useEffect(() => {
    const loadData = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const organizer = accounts[0];

      // On-chain events
      const onChainEvents = await getEvents();

      // Off-chain metadata
      const metadata = await getDataByAddr(organizer);

      setOrganizerAddress(organizer);

      const mergedEvents = [];

      for (const onChainEvent of onChainEvents) {
        const chainEventId = onChainEvent.args.eventId.toString();

        const matchingMeta = metadata.events.find(
          (metaEvent) => metaEvent.eventId.toString() === chainEventId
        );

        if (matchingMeta) {
          mergedEvents.push({
            ...onChainEvent,
            ...matchingMeta,
          });
        }
      }

      console.log("merged events: ", mergedEvents);

      setEvents(mergedEvents);
      setLoading(false);
    };

    loadData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Organizer Dashboard</h1>
      <p className="mb-4 text-gray-500">Logged in as: {organizerAddress}</p>

      {loading ? (
        <p>Loading events...</p>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-md p-4 transition-transform hover:scale-105"
              onClick={() =>
                handleCardClick(event.args[1], event.eventId.toString())
              }
            >
              <img
                src={`https://gateway.pinata.cloud/ipfs/${event.poster}`}
                alt={event.title}
                className="w-full h-40 object-cover rounded-xl mb-4"
              />
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Event ID:</strong> {event.eventId}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Event Number:</strong> {event.eventNumber}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Venue:</strong> {event.venue}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Type:</strong> {event.eventType}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Genres:</strong> {event.genres.join(", ")}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>General Price:</strong>{" "}
                {event.args.generalTicketPrice.toString()} Wei
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>VIP Price:</strong>{" "}
                {event.args.vipTicketPrice.toString()} Wei
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Event start Time:</strong> {event.args.eventStartTime}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Event sell start time:</strong>{" "}
                {event.args.ticketSellStartTime}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Total Gen Tickets:</strong>{" "}
                {event.args.generalMaxTickets.toString()}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Total VIP tickets:</strong>{" "}
                {event.args.vipMaxTickets.toString()}
              </p>
              <p className="text-gray-700 text-sm">{event.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No events found for this organizer.</p>
      )}
    </div>
  );
};

export default Organizer;
