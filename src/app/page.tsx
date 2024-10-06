"use client";

import { useMovies } from "../context/MovieContext";
import { useState } from "react";
import Link from "next/link";
import NavBar from "../components/NavBar";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";

export const dynamic = "force-dynamic";

const Home = () => {
  const { movies, deleteMovie } = useMovies();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMovies = movies.filter((movie) =>
    movie.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto ">
      <NavBar />
      <h1
        className="text-3xl font-bold mb-5 py-5 pl-4"
        style={{ fontFamily: "Roboto, sans-serif" }}
      >
        The Best Movie Review Site
      </h1>
      <div className="relative w-1/2 focus:ring-2 focus:ring-[rgb(101, 88, 245)]">
        <div className=" flex items-center  border border-gray-300 rounded-sm ml-5 px-4  ">
          <FaSearch className="text-gray-500 h-5 w-5 " />{" "}
          <input
            type="text"
            placeholder="Search for your favourite movie"
            className="w-full pl-10 h-12 focus:outline-none focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredMovies.map((movie) => {
          const totalRating = movie.reviews.reduce(
            (sum, review) => sum + (review.Rating || 0),
            0
          );
          const numberOfReviews = movie.reviews.length;

          const averageRating =
            numberOfReviews > 0
              ? (totalRating / numberOfReviews).toFixed(1)
              : "No reviews yet";

          return (
            <div
              key={movie.id}
              className="p-8 border rounded shadow-lg bg-[rgb(224,222,253)] text-black m-4"
            >
              <Link href={`/movies/${movie.id}`}>
                <h2 className="text-lg font-bold">{movie.Name}</h2>
                <p className="mb-4">Release Date: {movie.Release_Date}</p>
                <p className="mb-4 font-semibold">
                  Average Rating: {averageRating}/10
                </p>
              </Link>

              <div className="flex items-center mt-4">
                <Link href={`/edit/movie/${movie.id}`}>
                  <button className=" text-white px-4 py-2 rounded ">
                    <FaEdit
                      className="text-gray-700 hover:text-gray-900 cursor-pointer mr-2"
                      size={20}
                    />
                  </button>
                </Link>
                <button
                  onClick={() => deleteMovie(movie.id)}
                  className=" text-white px-4 py-2 rounded"
                >
                  <FaTrash
                    className="text-gray-700 hover:text-gray-900 cursor-pointer"
                    size={20}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
