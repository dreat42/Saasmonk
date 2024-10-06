"use client";
import { useState } from "react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const CreateMovie = () => {
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);

  const [releaseDate, setReleaseDate] = useState("");
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

    if (!formErrors.name && !formErrors.date) {
      const movieData = {
        name,
        releaseDate,
      };

      try {
        setLoading(true);
        const response = await fetch("/api/createMovie", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(movieData),
        });

        if (response.ok) {
          const createdMovie = await response.json();
          alert(
            `Movie Created:\nName: ${createdMovie.Name}\nRelease Date: ${createdMovie.Release_Date}`
          );

          setName("");
          setReleaseDate("");

          setLoading(false);
        } else {
          const errorResponse = await response.json();
          alert(`Error: ${errorResponse.error}`);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error creating movie:", error);
        alert("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }
  };

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
          Add New Movie
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
            Create Movie
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateMovie;
