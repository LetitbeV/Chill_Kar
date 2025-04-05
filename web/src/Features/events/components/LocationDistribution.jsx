import React from 'react';
import { BarChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';

const LocationDistribution = ({ data }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Tickets by Location</h2>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
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
    );
};

export default LocationDistribution;