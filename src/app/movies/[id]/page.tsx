"use client";

import { useMovies } from "../../../context/MovieContext";
import { FC, useState } from "react";
import NavBar from "../../../components/NavBar";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface MovieDetailProps {
  params: {
    id: string;
  };
}

const MovieDetail: FC<MovieDetailProps> = ({ params }) => {
  const { movies, loading, deleteReviewById } = useMovies();

  const [requestLoading, setRequestLoading] = useState(false);

  const { id } = params;

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );

  const movie = movies.find((movie) => movie.id === Number(id));

  if (!movie) return <div>Movie not found</div>;

  const totalRating = movie.reviews.reduce(
    (sum, review) => sum + (review.Rating || 0),
    0
  );
  const numberOfReviews = movie.reviews.length;

  const averageRating =
    numberOfReviews > 0
      ? (totalRating / numberOfReviews).toFixed(1)
      : "No reviews yet";

  const deleteReview = async (id: number) => {
    try {
      setRequestLoading(true);
      const response = await fetch(`/api/deleteReview`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      deleteReviewById(id);

      const result = await response.json();
      setRequestLoading(false);
      console.log("Data Deleted successfully:", result);
    } catch (error) {
      setRequestLoading(false);
      console.error("Error Deleted data:", error);
    }
  };

  if (requestLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );

  return (
    <div className="container mx-auto px-6">
      <NavBar />

      <div className="pt-8">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold font-sans">{movie.Name}</h1>{" "}
          <h1 className="text-3xl font-bold font-sans">{averageRating}</h1>{" "}
        </div>
      </div>

      {!movie.reviews.length ? null : (
        <div>
          <h2 className="text-xl mt-4 font-serif">Comments:</h2>{" "}
          {movie.reviews.map((review) => (
            <div
              key={review.id}
              className="p-6 my-4 border border-gray-300 rounded-lg w-full flex flex-col font-serif"
            >
              <div className="flex justify-between">
                <p className="font-semibold">{review.Comment}</p>
                <p className="text-sm">Rating: {review.Rating}</p>
              </div>

              <div className="flex justify-between mt-4">
                <p className="text-sm text-gray-500">By: {review.Name}</p>
                <div className="flex space-x-4">
                  <Link
                    href={`/edit/review/${review.id}`}
                    className="text-blue-500"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => {
                      deleteReview(review.id);
                    }}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieDetail;
