import React from 'react';
import { BarChart, LineChart, PieChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Line, Pie, Cell } from 'recharts';
import EventsAnalytics from '../SampleData/EventAnalytics.json'; // Assuming you have a JSON file with the data

const EventsAnalyticsPage = () => {
    // Sample data
    // const ageData = [
    //     { name: '18-24', value: 2800 },
    //     { name: '25-34', value: 4200 },
    //     { name: '35-44', value: 3400 },
    //     { name: '45-54', value: 1900 },
    //     { name: '55+', value: 1200 },
    // ];
    const ageData = EventsAnalytics.ageDistribution;
    const locationData = EventsAnalytics.locationData;
    const genderData = EventsAnalytics.genderDistribution;
    const eventCategoryData = EventsAnalytics.eventCategoryData;
    const monthlyTicketData = EventsAnalytics.monthlyTicketSales;

    // const locationData = [
    //     { name: 'Mumbai', value: 3500 },
    //     { name: 'Delhi', value: 2900 },
    //     { name: 'Bangalore', value: 2700 },
    //     { name: 'Hyderabad', value: 2100 },
    //     { name: 'Chennai', value: 1800 },
    //     { name: 'Kolkata', value: 1500 },
    // ];

    // const genderData = [
    //     { name: 'Male', value: 7800 },
    //     { name: 'Female', value: 6200 },
    //     { name: 'Non-binary', value: 600 },
    // ];

    // const monthlyTicketData = [
    //     { name: 'Jan', tickets: 2400 },
    //     { name: 'Feb', tickets: 3100 },
    //     { name: 'Mar', tickets: 2800 },
    //     { name: 'Apr', tickets: 3600 },
    //     { name: 'May', tickets: 4200 },
    //     { name: 'Jun', tickets: 3900 },
    //     { name: 'Jul', tickets: 4400 },
    //     { name: 'Aug', tickets: 4900 },
    //     { name: 'Sep', tickets: 4300 },
    // ];

    // const eventCategoryData = [
    //     { name: 'Comedy Shows', value: 22 },
    //     { name: 'Live Music', value: 35 },
    //     { name: 'Theatre', value: 18 },
    //     { name: 'Kids', value: 12 },
    //     { name: 'Adventure & Fun', value: 15 },
    //     { name: 'Concerts', value: 26 },
    //     { name: 'Live Sports', value: 20 },
    // ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

    const totalEvents = eventCategoryData.reduce((sum, item) => sum + item.value, 0);
    const totalTickets = monthlyTicketData.reduce((sum, item) => sum + item.tickets, 0);

    return (
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
                                <BarChart data={ageData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }} barSize={30}>
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

                    {/* Locations */}
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Tickets by Location</h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={locationData}
                                    layout="vertical"
                                    margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" scale="band" />
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
                            <BarChart data={eventCategoryData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
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

                {/* Download Reports Section */}
                {/* <div className="bg-gray-900 rounded-lg overflow-hidden mb-8">
                    <div className="flex items-center p-6">
                        <div className="flex flex-col md:flex-row items-center justify-between w-full">
                            <div className="flex items-center mb-4 md:mb-0">
                                <div className="text-white font-bold text-xl">Download Analytics Report</div>
                            </div>
                            <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium py-2 px-6 rounded-full transition duration-300">
                                Export as PDF
                            </button>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default EventsAnalyticsPage;