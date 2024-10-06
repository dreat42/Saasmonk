"use client";
import { useState } from "react";

import { useMovies } from "../../../../context/MovieContext";

const NewReview = () => {
  const { movies, loading } = useMovies();

  const [requestLoading, setRequestLoading] = useState(false);

  const [movieId, setMovieId] = useState(movies[0].id);
  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState("");
  const [comments, setComments] = useState("");
  const [errors, setErrors] = useState({ movieId: "", rating: "" });

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  if (!movies.length) return <div>Movies not found</div>;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formErrors = { movieId: "", rating: "" };

    if (!movieId) {
      formErrors.movieId = "Movie ID is required.";
    }

    if (!rating || parseInt(rating) < 0 || parseInt(rating) > 10) {
      formErrors.rating = "Rating must be between 0 and 10.";
    }

    setErrors(formErrors);

    if (!formErrors.movieId && !formErrors.rating) {
      const reviewData = {
        movieId: movieId,
        reviewerName,
        rating,
        comments,
      };

      try {
        setRequestLoading(true);
        const response = await fetch("/api/createReview", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reviewData),
        });

        if (response.ok) {
          const createdReview = await response.json();
          alert(
            `Review Submitted:\nMovie ID: ${movieId}\nReviewer Name: ${createdReview.Name}\nRating: ${createdReview.Rating}\nComments: ${createdReview.Comment}`
          );

          setMovieId(0);
          setReviewerName("");
          setRating("");
          setComments("");

          setRequestLoading(false);
        } else {
          const errorResponse = await response.json();

          setRequestLoading(false);
          alert(`Error: ${errorResponse.error}`);
        }
      } catch (error) {
        console.error("Error creating review:", error);
        alert("An unexpected error occurred.");
      }
    }
  };

  if (requestLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white border border-gray-300 rounded-md shadow-md w-full max-w-md">
        <h1 className="text-black bg-white p-4 rounded-md text-center text-2xl font-bold mb-6">
          Add New Review
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="movieId" className="block mb-2 font-medium">
              Movie Name:
            </label>
            <select
              id="movieId"
              value={movieId}
              onChange={(e) => setMovieId(Number(e.target.value))}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {movies.map((movie) => (
                <option key={movie.id} value={movie.id}>
                  {movie.Name}
                </option>
              ))}
            </select>
            {errors.movieId && (
              <div className="text-red-500 mt-1">{errors.movieId}</div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="reviewerName" className="block mb-2 font-medium">
              Reviewer Name:
            </label>
            <input
              type="text"
              id="reviewerName"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="rating" className="block mb-2 font-medium">
              Rating (0-10):
            </label>
            <input
              type="number"
              id="rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              min="0"
              max="10"
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.rating && (
              <div className="text-red-500 mt-1">{errors.rating}</div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="comments" className="block mb-2 font-medium">
              Review Comments:
            </label>
            <textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-[rgb(101,88,245)] text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewReview;
