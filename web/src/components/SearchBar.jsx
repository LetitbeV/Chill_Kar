import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import allEventsData from '../SampleData/AllEventsData.json'

const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [showResults, setShowResults] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setSearchResults([])
            return
        }

        const filteredResults = allEventsData.Events.filter(event => {
            const searchTerm = searchQuery.toLowerCase()
            return (
                event.title.toLowerCase().includes(searchTerm) ||
                event.eventType.toLowerCase().includes(searchTerm) ||
                event.genres.some(genre => genre.toLowerCase().includes(searchTerm)) ||
                event.venue.toLowerCase().includes(searchTerm)
            )
        }).slice(0, 5) // Limit to 5 results

        setSearchResults(filteredResults)
    }, [searchQuery])

    return (
        <div className="mt-15 mb-15 ml-auto mr-auto max-w-2xl relative">
            <div className="bg-white flex items-center flex-1 relative rounded-2xl">
                <Search className="absolute left-3 text-gray-400" size={18} />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setShowResults(true)
                    }}
                    onFocus={() => setShowResults(true)}
                    placeholder="Search for Movies, Events, Plays, Sports and Activities"
                    className="pl-10 pr-4 py-2 rounded-2xl w-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                />
            </div>

            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
                <div className="absolute w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
                    {searchResults.map((result) => (
                        <div
                            key={result.id}
                            className="p-3 hover:bg-yellow-50 cursor-pointer border-b last:border-b-0"
                            onClick={() => {
                                // Handle click - navigate to event details or category
                                setShowResults(false)
                                setSearchQuery('')
                            }}
                        >
                            <div className="flex items-start gap-3">
                                <img 
                                    src={result.poster} 
                                    alt={result.title}
                                    className="w-12 h-12 object-cover rounded"
                                />
                                <div>
                                    <h3 className="font-medium text-gray-800">{result.title}</h3>
                                    <p className="text-sm text-gray-500">
                                        {result.eventType} • {result.venue}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Click outside handler */}
            {showResults && (
                <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setShowResults(false)}
                ></div>
            )}
        </div>
    )
}

export default SearchBar