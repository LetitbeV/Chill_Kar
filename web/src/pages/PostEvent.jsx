import React, { useState } from 'react';
import { Calendar, MapPin, Users, Tag, Info, Theater, Upload, X } from 'lucide-react';

const PostEvent = () => {
  const [eventData, setEventData] = useState({
    title: '',
    poster: null,
    // rating: 0.0,
    // votes:0,
    eventType: '',
    ticketCount: '',
    ticketPrice: '',
    genres: [],
    date: '',
    venue: '',
    description: ''
  });

  // Event type specific genres
  const genresByType = {
    Movie: ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Documentary'],
    Sports: ['Cricket', 'Football', 'Basketball', 'Tennis', 'Athletics', 'Swimming', 'Boxing'],
    Concert: ['Rock', 'Pop', 'Jazz', 'Classical', 'Electronic', 'Hip Hop', 'Folk'],
    Other: ['Exhibition', 'Conference', 'Workshop', 'Food Festival', 'Cultural', 'Fashion', 'Tech']
  };

  const eventTypes = ['Movie', 'Sports', 'Concert', 'Others'];
  const ageRatingOptions = ['All Ages', '13+', '16+', '18+', '21+'];

  // Update event type and reset genres when type changes
  const handleEventTypeChange = (e) => {
    const newType = e.target.value;
    setEventData(prev => ({
      ...prev,
      eventType: newType,
      genres: [] // Reset genres when type changes
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5242880) { // 5MB limit
        alert('File size should be less than 5MB');
        return;
      }
      setEventData(prev => ({
        ...prev,
        poster: {
          file,
          preview: URL.createObjectURL(file)
        }
      }));
    }
  };

  const cleanupImageURL = () => {
    if (eventData.poster?.preview) {
      URL.revokeObjectURL(eventData.poster.preview);
    }
  };

  React.useEffect(() => {
    return () => cleanupImageURL();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Event Data:', eventData);
    // Handle form submission logic here
  };

  const renderGenresSection = () => (
    <div className="space-y-4">
      {/* Event Type Selection */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          <Theater className="inline-block mr-2 h-5 w-5" />
          Event Type
        </label>
        <select
          name="eventType"
          value={eventData.eventType}
          onChange={handleEventTypeChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          required
        >
          <option value="">Select event type</option>
          {eventTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Genres Selection - Only shown when event type is selected */}
      {eventData.eventType && (
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            <Tag className="inline-block mr-2 h-5 w-5" />
            {eventData.eventType === 'Movie' ? 'Genres' : 'Categories'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {genresByType[eventData.eventType].map(genre => (
              <label key={genre} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-yellow-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={eventData.genres.includes(genre)}
                  onChange={(e) => {
                    const updatedGenres = e.target.checked
                      ? [...eventData.genres, genre]
                      : eventData.genres.filter(g => g !== genre);
                    setEventData(prev => ({ ...prev, genres: updatedGenres }));
                  }}
                  className="form-checkbox h-4 w-4 text-yellow-500 rounded focus:ring-yellow-400"
                />
                <span className="text-sm text-gray-700">{genre}</span>
              </label>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-1">Select all that apply</p>
        </div>
      )}
    </div>
  );

  const renderImageUpload = () => (
    <div className="space-y-2">
      <label className="block text-gray-700 font-medium mb-2">
        <Upload className="inline-block mr-2 h-5 w-5" />
        Event Poster
      </label>
      
      <div className="relative">
        {eventData.poster ? (
          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={eventData.poster.preview}
              alt="Event poster preview"
              className="w-full h-full object-contain"
            />
            <button
              type="button"
              onClick={() => {
                cleanupImageURL();
                setEventData(prev => ({ ...prev, poster: null }));
              }}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-yellow-400 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                Click or drag and drop to upload poster
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          List Your Event
        </h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          {/* Event Title */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Event Title
            </label>
            <input
              type="text"
              name="title"
              value={eventData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              placeholder="Enter event title"
              required
            />
          </div>

          {/* Event Poster */}
          {renderImageUpload()}

          {/* Add the new genres section here */}
          {renderGenresSection()}

          {/* Ticket Count and Price - Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <Users className="inline-block mr-2 h-5 w-5" />
               VIP Tickets Count
              </label>
              <input
                type="number"
                name="ticketCount"
                value={eventData.ticketCount}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="Number of tickets"
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <Users className="inline-block mr-2 h-5 w-5" />
               General Tickets Count
              </label>
              <input
                type="number"
                name="ticketCount"
                value={eventData.ticketCount}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="Number of tickets"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                {/* <span className="inline-block mr-2">$</span> */}
                VIP Ticket Price (in Micro-ETH)
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="ticketPrice"
                  value={eventData.ticketPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Price per ticket (in Micro-ETH)"
                  min="0"
                  step="0.01"
                  required
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Enter 0 for free events</p>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                {/* <span className="inline-block mr-2">$</span> */}
                General Ticket Price (in Micro-ETH)
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="ticketPrice"
                  value={eventData.ticketPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Price per ticket (in Micro-ETH)"
                  min="0"
                  step="0.01"
                  required
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Enter 0 for free events</p>
            </div>
          </div>

          {/* Date and Venue - Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <Calendar className="inline-block mr-2 h-5 w-5" />
                Event Start Date
              </label>
              <input
                type="datetime-local"
                name="date"
                value={eventData.date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <Calendar className="inline-block mr-2 h-5 w-5" />
               Ticket Sell Start Date
              </label>
              <input
                type="datetime-local"
                name="date"
                value={eventData.date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <MapPin className="inline-block mr-2 h-5 w-5" />
                Venue
              </label>
              <input
                type="text"
                name="venue"
                value={eventData.venue}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="Event venue"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              <Info className="inline-block mr-2 h-5 w-5" />
              Event Description
            </label>
            <textarea
              name="description"
              value={eventData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              placeholder="Tell us about your event..."
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
            >
              List Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostEvent;