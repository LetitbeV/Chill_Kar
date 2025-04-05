import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MovieDetails from '../components/MovieDetails';
import defaultPoster from '../../public/images/gaming/gaming1.webp';; // Default poster image
import defaultBackdrop from '../../public/images/latest-drops/asteroid.gif'; // Default backdrop image

import allEventsData from '../SampleData/AllEventsData.json'

const MovieDetailsPage = () => {
    const { movieId } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                setLoading(true);
                
                // Find the event with matching ID from allEventsData
                const foundMovie = allEventsData.Events.find(
                    event => event.id === parseInt(movieId)
                );

                if (foundMovie) {
                    setMovie(foundMovie);
                } else {
                    setMovie(null); // Movie not found
                }
            } catch (error) {
                console.error("Error fetching movie data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (movieId) {
            fetchMovieData();
        }
    }, [movieId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
        );
    }

    return (
        <div>
            {movie ? (
                <MovieDetails movie={movie} />
            ) : (
                <div className="container mx-auto px-4 py-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-800">Movie not found</h2>
                </div>
            )}
        </div>
    );
};

export default MovieDetailsPage;