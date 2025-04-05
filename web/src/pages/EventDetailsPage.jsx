import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import EventDetails from "../components/EventDetails";
import getDataByAddr from "../contractLogic/getDataByAddr";

const EventDetailsPage = () => {
  const { owner, eventTime } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);

        let bandData = await getDataByAddr(owner);

        const matchedEvent = bandData.events.find(
          (event) => event.eventTime == eventTime
        );
        console.log("matched: ", matchedEvent);
        setEvent(matchedEvent);
      } catch (error) {
        console.error("Error fetching event data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (eventTime) {
      fetchEventData();
    }
  }, [eventTime, owner]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div>
      {event ? (
        <EventDetails movie={event} />
      ) : (
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Event not found</h2>
        </div>
      )}
    </div>
  );
};

export default EventDetailsPage;
