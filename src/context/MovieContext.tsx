"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type Review = {
  id: number;
  MovieID: number;
  Rating: number;
  Comment: string;
  Name: string;
};

type Movie = {
  id: number;
  Name: string;
  Release_Date: string;
  reviews: Review[];
};

type MoviesContextType = {
  movies: Movie[];
  addMovie: (movie: Movie) => void;
  addReview: (review: Review) => void;
  deleteMovie: (movieId: number) => void;
  loading: boolean;
  deleteReviewById: (ReviewId: number) => void;
};

const MoviesContext = createContext<MoviesContextType | undefined>(undefined);

export const useMovies = () => {
  const context = useContext(MoviesContext);
  if (!context) {
    throw new Error("useMovies must be used within a MoviesProvider");
  }
  return context;
};

export const MoviesProvider = ({ children }: { children: ReactNode }) => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const [moviesAndReviewsLoading, setMoviesAndReviewsLoading] = useState(false);

  const [loading, setLoading] = useState(true);

  const addMovie = (movie: Movie) => {
    setMovies([...movies, movie]);
  };

  const addReview = (review: Review) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === review.MovieID
          ? { ...movie, reviews: [...movie.reviews, review] }
          : movie
      )
    );
  };
  const deleteReviewById = (id: number) => {
    setMovies((prev) => {
      return prev.map((movie) => {
        return {
          ...movie,
          reviews: movie.reviews.filter((review) => review.id !== id),
        };
      });
    });
  };

  const deleteMovie = async (id: number) => {
    try {
      setMoviesAndReviewsLoading(true);
      const response = await fetch(`/api/deleteMovie`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== id));

      const result = await response.json();
      console.log("Data Deleted successfully:", result);
      setMoviesAndReviewsLoading(false);
    } catch (error) {
      setMoviesAndReviewsLoading(false);
      console.error("Error Deleted data:", error);
    }
  };

  useEffect(() => {
    setMoviesAndReviewsLoading(true);

    const fetchMoviesAndReviews = async () => {
      try {
        const response = await fetch("/api/getMoviesWithReviews", {
          cache: "no-store",
        });
        if (response.ok) {
          const data = await response.json();

          setMovies(data);

          setMoviesAndReviewsLoading(false);
        } else {
          console.error("Failed to fetch movies and reviews");
        }
      } catch (error) {
        setMoviesAndReviewsLoading(false);
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoviesAndReviews();
  }, []);

  if (moviesAndReviewsLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );

  return (
    <MoviesContext.Provider
      value={{
        movies,
        addMovie,
        addReview,
        deleteMovie,
        loading,
        deleteReviewById,
      }}
    >
      {children}
    </MoviesContext.Provider>
  );
};
