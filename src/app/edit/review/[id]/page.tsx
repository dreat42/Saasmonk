"use client";
import { useState } from "react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface EditReviewProps {
  params: {
    id: string;
  };
}

import { useMovies } from "../../../../context/MovieContext";
const EditReview: React.FC<EditReviewProps> = ({ params }) => {
  const { id } = params;
  const { movies, loading } = useMovies();

  const [requestLoading, setRequestLoading] = useState(false);

  const movie = movies.find((movie) => {
    return movie.reviews.some((review) => review.id == Number(id));
  });

  const review = movie
    ? movie.reviews.find((review) => review.id == Number(id))
    : null;

  const movieId = review?.MovieID;
  const [reviewerName, setReviewerName] = useState(review?.Name);
  const [rating, setRating] = useState(review?.Rating);
  const [comments, setComments] = useState(review?.Comment);
  const [errors, setErrors] = useState({ movieId: "", rating: "" });

  const arrRating = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formErrors = { movieId: "", rating: "" };

    if (!movieId) {
      formErrors.movieId = "Movie ID is required.";
    }

    if (!rating || Number(rating) < 0 || Number(rating) > 10) {
      formErrors.rating = "Rating must be between 0 and 10.";
    }

    setErrors(formErrors);

    if (!formErrors.movieId && !formErrors.rating) {
      try {
        setRequestLoading(true);
        const response = await fetch(`/api/updateReview`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Comment: comments,
            id: id,
            Rating: rating,
            Name: reviewerName,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update movie");
        }

        setRequestLoading(false);

        alert(`Review Edited:\nName: ${reviewerName}\n Comment: ${comments}`);
      } catch (error) {
        setRequestLoading(false);
        console.error(error);
      }
    }
  };

  if (!review) return <div>Review not found</div>;

  if (requestLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white border border-gray-300 rounded-md shadow-md w-full max-w-md">
        <h1 className="text-black bg-white p-4 rounded-md text-center text-2xl font-bold mb-6">
          Edit Review
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="movieId" className="block mb-2 font-medium">
              Movie ID:
            </label>
            <select
              id="movieId"
              value={movieId}
              disabled
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
            >
              <option value="">Select a movie</option>
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
              Reviewer Name (optional):
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
              onChange={(e) => {
                if (arrRating.includes(Number(e.target.value))) {
                  setRating(Number(e.target.value));
                }
              }}
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

export default EditReview;
