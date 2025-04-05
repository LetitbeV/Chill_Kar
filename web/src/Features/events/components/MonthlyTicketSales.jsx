import React from 'react';
import { LineChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';

const MonthlyTicketSales = ({ data }) => {
    return (
        <div className="mb-10">
            <div className="bg-white rounded-lg shadow-md p-4 mb-2">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Ticket Sales</h2>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
    );
};

export default MonthlyTicketSales;