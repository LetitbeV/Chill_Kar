import React from 'react';
import { BarChart, LineChart, PieChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Line, Pie, Cell } from 'recharts';

const EventDashboard = ({ event, onClose }) => {
    // Sample data for event-specific analytics
    // In a real application, you would fetch this data based on the event ID
    const eventSpecificData = {
        // Generate mock data for this specific event
        ageDistribution: [
            { name: "18-24", value: Math.floor(event.ticketsSold * 0.23) },
            { name: "25-34", value: Math.floor(event.ticketsSold * 0.38) },
            { name: "35-44", value: Math.floor(event.ticketsSold * 0.22) },
            { name: "45-54", value: Math.floor(event.ticketsSold * 0.12) },
            { name: "55+", value: Math.floor(event.ticketsSold * 0.05) }
        ],
        genderDistribution: [
            { name: "Male", value: Math.floor(event.ticketsSold * 0.48) },
            { name: "Female", value: Math.floor(event.ticketsSold * 0.46) },
            { name: "Non-binary", value: Math.floor(event.ticketsSold * 0.06) }
        ],
        ticketsByLocation: [
            { name: "Mumbai", value: Math.floor(event.ticketsSold * 0.28) },
            { name: "Delhi", value: Math.floor(event.ticketsSold * 0.22) },
            { name: "Bangalore", value: Math.floor(event.ticketsSold * 0.20) },
            { name: "Hyderabad", value: Math.floor(event.ticketsSold * 0.13) },
            { name: "Chennai", value: Math.floor(event.ticketsSold * 0.09) },
            { name: "Kolkata", value: Math.floor(event.ticketsSold * 0.08) }
        ],
        ticketSalesByTime: [
            { name: "8+ Weeks Before", value: Math.floor(event.ticketsSold * 0.15) },
            { name: "4-8 Weeks Before", value: Math.floor(event.ticketsSold * 0.22) },
            { name: "2-4 Weeks Before", value: Math.floor(event.ticketsSold * 0.32) },
            { name: "1-2 Weeks Before", value: Math.floor(event.ticketsSold * 0.18) },
            { name: "Last Week", value: Math.floor(event.ticketsSold * 0.13) }
        ],
        ticketCategories: [
            { name: "VIP", value: Math.floor(event.ticketsSold * 0.12), price: Math.floor(event.revenue * 0.30 / (event.ticketsSold * 0.12)) },
            { name: "Premium", value: Math.floor(event.ticketsSold * 0.28), price: Math.floor(event.revenue * 0.40 / (event.ticketsSold * 0.28)) },
            { name: "Regular", value: Math.floor(event.ticketsSold * 0.60), price: Math.floor(event.revenue * 0.30 / (event.ticketsSold * 0.60)) }
        ],
        dailyTicketSales: Array.from({ length: 14 }, (_, i) => ({
            day: `Day ${i+1}`,
            sales: Math.floor(Math.random() * (event.ticketsSold/20) + (event.ticketsSold/30))
        }))
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];
    
    // Calculate average ticket price
    const avgTicketPrice = Math.floor(event.revenue / event.ticketsSold);
    
    // Format date function
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    return (
        <div className="mr-auto ml-auto max-w-11/12 rounded-4xl bg-white pb-8 pt-6 mt-4 px-4">
            <div className="container mx-auto">
                {/* Header with back button */}
                <div className="flex justify-between items-center mb-8">
                    <div className="relative">
                        <h1 className="text-3xl font-bold text-gray-800 relative inline-block">
                            {event.name}
                            <div className="absolute -bottom-2 left-0 w-full h-1 bg-yellow-400 transform -skew-x-12"></div>
                        </h1>
                        <p className="text-gray-600 mt-2">{formatDate(event.date)} | {event.category}</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded transition"
                    >
                        Back to Analytics
                    </button>
                </div>
                
                {/* Event Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-gray-900 rounded-lg p-6 text-white shadow-lg">
                        <div className="text-xl text-gray-300 mb-2">Tickets Sold</div>
                        <div className="text-3xl font-bold">{event.ticketsSold.toLocaleString()}</div>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-6 text-white shadow-lg">
                        <div className="text-xl text-gray-300 mb-2">Revenue</div>
                        <div className="text-3xl font-bold">₹{event.revenue.toLocaleString()}</div>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-6 text-white shadow-lg">
                        <div className="text-xl text-gray-300 mb-2">Avg. Ticket Price</div>
                        <div className="text-3xl font-bold">₹{avgTicketPrice.toLocaleString()}</div>
                    </div>
                </div>
                
                {/* Ticket Sales Over Time */}
                <div className="mb-10">
                    <div className="bg-white rounded-lg shadow-md p-4 mb-2">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Daily Ticket Sales</h2>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={eventSpecificData.dailyTicketSales} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="sales" stroke="#FFB200" strokeWidth={2} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                
                {/* Ticket Sales Distribution & Demographics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">When Tickets Were Purchased</h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={eventSpecificData.ticketSalesByTime}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={true}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {eventSpecificData.ticketSalesByTime.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Ticket Categories</h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart 
                                    data={eventSpecificData.ticketCategories} 
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    barSize={40}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                                    <Tooltip />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="value" name="Tickets Sold" fill="#8884d8" radius={[4, 4, 0, 0]} />
                                    <Bar yAxisId="right" dataKey="price" name="Price (₹)" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                
                {/* Demographics & Location Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                    {/* Age Distribution */}
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Attendee Age Distribution</h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={eventSpecificData.ageDistribution} margin={{ top: 5, right: 10, left: 10, bottom: 5 }} barSize={20}>
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
                                        data={eventSpecificData.genderDistribution}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {eventSpecificData.genderDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Locations - Properly configured for Mumbai visibility */}
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Tickets by Location</h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={eventSpecificData.ticketsByLocation}
                                    layout="vertical"
                                    margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
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
                
                {/* Additional Event Info */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-10">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Event Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="mb-3"><span className="font-semibold">Event ID:</span> {event.id}</p>
                            <p className="mb-3"><span className="font-semibold">Category:</span> {event.category}</p>
                            <p className="mb-3"><span className="font-semibold">Date:</span> {formatDate(event.date)}</p>
                        </div>
                        <div>
                            <p className="mb-3"><span className="font-semibold">Total Tickets:</span> {event.ticketsSold.toLocaleString()}</p>
                            <p className="mb-3"><span className="font-semibold">Revenue:</span> ₹{event.revenue.toLocaleString()}</p>
                            <p className="mb-3"><span className="font-semibold">Avg. Ticket Price:</span> ₹{avgTicketPrice.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDashboard;