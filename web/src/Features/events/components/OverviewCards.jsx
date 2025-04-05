import React from 'react';

const OverviewCards = ({ totalEvents, totalTickets }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-gray-900 rounded-lg p-6 text-white shadow-lg">
                <div className="text-xl text-gray-300 mb-2">Total Events</div>
                <div className="text-4xl font-bold flex items-baseline">
                    <span>{totalEvents}</span>
                    <span className="ml-2 text-sm font-normal text-gray-400">across all categories</span>
                </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 text-white shadow-lg">
                <div className="text-xl text-gray-300 mb-2">Tickets Sold</div>
                <div className="text-4xl font-bold flex items-baseline">
                    <span>{totalTickets.toLocaleString()}</span>
                    <span className="ml-2 text-sm font-normal text-gray-400">year to date</span>
                </div>
            </div>
        </div>
    );
};

export default OverviewCards;