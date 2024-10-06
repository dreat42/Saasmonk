"use client";
import { useState } from "react";

interface EditMovieProps {
  params: {
    id: string;
  };
}

import { useMovies } from "../../../../context/MovieContext";

const EditMovie: React.FC<EditMovieProps> = ({ params }) => {
  const [requetLoading, setRequetLoading] = useState(false);
  const { id } = params;
  const { movies, loading } = useMovies();

  const movie = movies.find((movie) => {
    return movie.id == parseInt(id);
  });

  const [name, setName] = useState(movie?.Name || "");
  const [releaseDate, setReleaseDate] = useState(movie?.Release_Date);
  const [errors, setErrors] = useState({ name: "", date: "" });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formErrors = { name: "", date: "" };

    if (!name) {
      formErrors.name = "Name is required.";
    }

    if (!releaseDate) {
      formErrors.date = "Release date is required.";
    }

    setErrors(formErrors);

    try {
      setRequetLoading(true);
      const response = await fetch(`/api/updateMovie`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Name: name, Release_Date: releaseDate, id: id }),
      });

      if (!response.ok) {
        throw new Error("Failed to update movie");
      }

      alert(`Movie Edited:\nName: ${name}\nRelease Date: ${releaseDate}`);
      setRequetLoading(false);
    } catch (error) {
      setRequetLoading(false);
      console.error(error);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );

  if (!movie) return <div>Movie not found</div>;

  if (requetLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white border border-gray-300 rounded-md shadow-md w-full max-w-md">
        <h1 className="text-black bg-white p-4 rounded-md text-center text-2xl font-bold mb-6">
          Edit Movie
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 font-medium">
              Name:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.name && (
              <div className="text-red-500 mt-1">{errors.name}</div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="releaseDate" className="block mb-2 font-medium">
              Release Date:
            </label>
            <input
              type="date"
              id="releaseDate"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.date && (
              <div className="text-red-500 mt-1">{errors.date}</div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[rgb(101,88,245)] text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Update Movie
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditMovie;
