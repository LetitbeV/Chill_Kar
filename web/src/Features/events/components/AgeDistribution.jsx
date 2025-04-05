import React from 'react';
import { BarChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';

const AgeDistribution = ({ data }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Attendee Age Distribution</h2>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }} barSize={20}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AgeDistribution;