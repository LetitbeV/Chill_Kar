import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MovieDetails from '../components/MovieDetails';
import defaultPoster from '../../public/images/gaming/gaming1.webp';; // Default poster image
import defaultBackdrop from '../../public/images/latest-drops/asteroid.gif'; // Default backdrop image

const MovieDetailsPage = () => {
    const { movieId } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real application, you would fetch the movie data from an API
        // For this example, we'll simulate fetching with sample data
        const fetchMovieData = async () => {
            try {
                setLoading(true);

                // Simulated API call delay
                await new Promise(resolve => setTimeout(resolve, 500));

                // Sample data - replace with actual API call
                const movieData = {
                    id: movieId,
                    title: "Chhaava",
                    image: defaultPoster, // Replace with actual image path
                    backdropImage: defaultBackdrop, // Replace with actual backdrop image
                    rating: 9.2,
                    votes: "335.5K",
                    genres: ["Action", "Drama", "Historical"],
                    format: "2D, ICE, 4DX, IMAX 2D",
                    language: "Hindi",
                    duration: "2h 41m",
                    certificate: "UA16+",
                    releaseDate: "14 Feb, 2025",
                    trailerCount: 3,
                    description: "Follow the extraordinary journey of Chhatrapati Shivaji Maharaj, from his early life to becoming a legendary warrior and visionary leader. This epic historical drama portrays his strategic brilliance, courage, and unwavering commitment to establishing Swarajya (self-rule) in the face of powerful adversaries."
                };

                setMovie(movieData);
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