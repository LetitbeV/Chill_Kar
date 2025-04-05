import React, { useState } from 'react';
import EventsAnalytics from '../SampleData/EventAnalytics.json';
import EventDashboard from '../components/EventDashboard';
import OverviewCards from '../features/events/components/OverviewCards';
import TopPerformingEvents from '../features/events/components/TopPerformingEvents';
import MonthlyTicketSales from '../features/events/components/MonthlyTicketSales';
import AgeDistribution from '../features/events/components/AgeDistribution';
import GenderDistribution from '../features/events/components/GenderDistribution';
import LocationDistribution from '../features/events/components/LocationDistribution';
import EventCategories from '../features/events/components/EventCategories';

const EventsAnalyticsPage = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);

    const handleEventClick = (event) => {
        setSelectedEvent(event);
    };

    const closeEventDetail = () => {
        setSelectedEvent(null);
    };

    return (
        <>
            {selectedEvent ? (
                <EventDashboard event={selectedEvent} onClose={closeEventDetail} />
            ) : (
                <div className="mr-auto ml-auto max-w-11/12 rounded-4xl bg-white pb-8 pt-6 mt-4 px-4">
                    <div className="container mx-auto">
                        <div className="relative mb-8">
                            <h1 className="text-3xl font-bold text-gray-800 relative inline-block">
                                Events Analytics
                                <div className="absolute -bottom-2 left-0 w-full h-1 bg-yellow-400 transform -skew-x-12"></div>
                            </h1>
                        </div>

                        <OverviewCards 
                            totalEvents={EventsAnalytics.eventCategoryData.reduce((sum, item) => sum + item.value, 0)}
                            totalTickets={EventsAnalytics.monthlyTicketSales.reduce((sum, item) => sum + item.tickets, 0)}
                        />

                        <TopPerformingEvents 
                            events={EventsAnalytics.topPerformingEvents}
                            onEventClick={handleEventClick}
                        />

                        <MonthlyTicketSales 
                            data={EventsAnalytics.monthlyTicketSales}
                        />

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                            <AgeDistribution 
                                data={EventsAnalytics.ageDistribution}
                            />
                            <GenderDistribution 
                                data={EventsAnalytics.genderDistribution}
                            />
                            <LocationDistribution 
                                data={EventsAnalytics.locationData}
                            />
                        </div>

                        <EventCategories 
                            data={EventsAnalytics.eventCategoryData}
                        />
                    </div>
                </div>
            )}
            <div className="mb-12"></div>
        </>
    );
};

export default EventsAnalyticsPage;