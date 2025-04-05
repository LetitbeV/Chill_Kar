import React from 'react'
import MovieCard from '../components/MovieCard'
import { FileWarning } from 'lucide-react'
import allEventsData from '../SampleData/AllEventsData.json'

const ListEvents = ({ eventType }) => {
  // Filter events based on eventType
  const filteredEvents = allEventsData.Events.filter(event => 
    event.eventType === eventType || (!eventType && event.eventType !== 'Concert' && event.eventType !== 'Movies' && event.eventType.toLocaleLowerCase() !== 'sports')
  );

  if (!filteredEvents || filteredEvents.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-yellow-100 py-8 pb-50">
        <div className="container mx-auto px-4 h-[70vh] flex flex-col items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
            <FileWarning className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No Records Found
            </h2>
            <p className="text-gray-600">
              We couldn't find any {eventType || 'events'} matching your criteria.
            </p>
            <button 
              onClick={() => window.history.back()}
              className="mt-6 px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-yellow-100 py-8">
      <div className="pb-20 pl-10 pr-10 rounded-4xl bg-white container mx-auto px-4">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-3 relative">
            <span className="relative inline-block">
              {eventType || 'All Events'}
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-yellow-400 transform -skew-x-12"></div>
            </span>
          </h1>
          <p className="text-gray-600 text-lg">
            Browse through our collection of {eventType?.toLowerCase() || 'events'}
          </p>
        </div>

        {/* Events Grid */}
        <div className="pb-10 pt-5 flex flex-wrap justify-center gap-8 p-4 bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg">
          {filteredEvents.map((event, index) => (
            <div
              key={event.id || index}
              className="transform hover:scale-105 transition-all duration-300"
            >
              <MovieCard movie={event} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ListEvents