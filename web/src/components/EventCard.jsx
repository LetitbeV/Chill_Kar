import React from 'react';
import defaultImage from '/images/art/art1.jpeg'

const EventCard = ({ event }) => {
  return (
    <div className=" w-56 relative cursor-pointer overflow-hidden rounded-lg shadow-md">
      {/* Event Image with Color Overlay */}
      <div className={`${event.color} relative h-64`}>
        <img 
          src={event.poster || defaultImage} 
          alt={event.title} 
          className="w-full h-full object-cover mix-blend-overlay"
        />
        
        {/* Event Title and Count */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between">
          <div className="text-xl font-bold text-white leading-tight">
            {event.title}
          </div>
          <div className="text-base font-medium text-white">
            {`${event.eventCount}+`} Events
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;