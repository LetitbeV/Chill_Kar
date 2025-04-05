import React, { useState } from 'react';
import { BarChart, LineChart, PieChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Line, Pie, Cell } from 'recharts';
import EventsAnalytics from '../SampleData/EventAnalytics.json';
import EventDashboard from '../components/EventDashboard.jsx';

const EventsAnalyticsPage = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);

    const ageData = EventsAnalytics.ageDistribution;
    const locationData = EventsAnalytics.locationData;
    const genderData = EventsAnalytics.genderDistribution;
    const eventCategoryData = EventsAnalytics.eventCategoryData;
    const monthlyTicketData = EventsAnalytics.monthlyTicketSales;
    const topEvents = EventsAnalytics.topPerformingEvents;

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

    const totalEvents = eventCategoryData.reduce((sum, item) => sum + item.value, 0);
    const totalTickets = monthlyTicketData.reduce((sum, item) => sum + item.tickets, 0);

    // Format date function
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Handle event card click
    const handleEventClick = (event) => {
        setSelectedEvent(event);
    };

    // Close event detail view
    const closeEventDetail = () => {
        setSelectedEvent(null);
    };

    return (
        <>
            {selectedEvent ? (
                <EventDashboard event={selectedEvent} onClose={closeEventDetail} />
            ) : (
                // Main Analytics Dashboard
                <div className="mr-auto ml-auto max-w-11/12 rounded-4xl bg-white pb-8 pt-6 mt-4 px-4">
                    <div className="container mx-auto">
                        {/* Header with title */}
                        <div className="relative mb-8">
                            <h1 className="text-3xl font-bold text-gray-800 relative inline-block">
                                Events Analytics
                                <div className="absolute -bottom-2 left-0 w-full h-1 bg-yellow-400 transform -skew-x-12"></div>
                            </h1>
                        </div>

                        {/* Overview Cards */}
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

                        {/* Event Cards - Horizontal Scrollable */}
                        <div className="mb-10">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Top Performing Events</h2>
                            <div className="relative">
                                <div className="overflow-x-auto pb-4 flex space-x-6 no-scrollbar">
                                    {topEvents.map((event) => (
                                        <div
                                            key={event.id}
                                            onClick={() => handleEventClick(event)}
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

                        {/* Monthly Ticket Sales Chart */}
                        <div className="mb-10">
                            <div className="bg-white rounded-lg shadow-md p-4 mb-2">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Ticket Sales</h2>
                                <div className="h-72">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={monthlyTicketData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Line type="monotone" dataKey="tickets" stroke="#FFB200" strokeWidth={2} activeDot={{ r: 8 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Three Charts in a Row for Desktop, Stacked for Mobile */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                            {/* Age Distribution */}
                            <div className="bg-white rounded-lg shadow-md p-4">
                                <h2 className="text-lg font-bold text-gray-800 mb-4">Attendee Age Distribution</h2>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={ageData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }} barSize={20}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Gender Distribution */}
                            <div className="bg-white rounded-lg shadow-md p-4">
                                <h2 className="text-lg font-bold text-gray-800 mb-4">Gender Distribution</h2>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={genderData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {genderData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Locations - Fixed to ensure Mumbai is visible */}
                            <div className="bg-white rounded-lg shadow-md p-4">
                                <h2 className="text-lg font-bold text-gray-800 mb-4">Tickets by Location</h2>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={locationData}
                                            layout="vertical"
                                            margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number" domain={[0, 4000]} />
                                            <YAxis
                                                dataKey="name"
                                                type="category"
                                                scale="band"
                                                width={80}
                                                tick={{ fontSize: 12 }}
                                            />
                                            <Tooltip />
                                            <Bar dataKey="value" fill="#82ca9d" radius={[0, 4, 4, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Event Categories Distribution */}
                        <div className="bg-white rounded-lg shadow-md p-4 mb-10">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Event Categories</h2>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={eventCategoryData}
                                        margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                                        barSize={40}
                                        maxBarSize={40}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="value" fill="#FFB200" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Added a gap before the footer */}
            <div className="mb-12"></div>
        </>
    );
};

export default EventsAnalyticsPage;