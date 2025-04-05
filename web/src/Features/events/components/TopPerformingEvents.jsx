import React from 'react';

const TopPerformingEvents = ({ events, onEventClick }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Top Performing Events</h2>
            <div className="relative">
                <div className="overflow-x-auto pb-4 flex space-x-6 no-scrollbar">
                    {events.map((event) => (
                        <div
                            key={event.id}
                            onClick={() => onEventClick(event)}
                            className="flex-shrink-0 w-64 bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition transform hover:scale-105"
                        >
                            <div className={`h-2 ${event.category === "Live Music" ? "bg-blue-500" :
                                event.category === "Comedy Shows" ? "bg-green-500" :
                                event.category === "Theatre" ? "bg-yellow-500" :
                                event.category === "Concerts" ? "bg-purple-500" :
                                event.category === "Live Sports" ? "bg-red-500" :
                                "bg-gray-500"
                            }`}></div>
                            <div className="p-4">
                                <h3 className="font-bold text-gray-800 text-lg mb-2">{event.name}</h3>
                                <p className="text-sm text-gray-600 mb-2">{formatDate(event.date)}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs px-2 py-1 bg-gray-200 rounded-full">{event.category}</span>
                                    <span className="font-semibold text-gray-800">₹{(event.revenue / 1000).toFixed(0)}K</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopPerformingEvents;