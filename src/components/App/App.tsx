import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import css from "./App.module.css";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

import { fetchMovies } from "../../services/movieService";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

import type { Movie } from "../../types/movie";

export default function App() {
  const [chosenMovie, setChosenMovie] = useState<Movie | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const {
    data: movieData,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["movies", searchQuery, page],
    queryFn: () => fetchMovies(searchQuery, page),
    enabled: !!searchQuery,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (movieData && movieData.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [movieData]);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setChosenMovie(null);
  };

  const handleSelectMovie = (movie: Movie) => {
    setChosenMovie(movie);
    handleOpenModal();
  };

  const searchMovies = (query: string) => {
    if (!query.trim()) {
      toast.error("Please enter your search query.");
      return;
    }
    setSearchQuery(query);
    setPage(1);
  };

  return (
    <div className={css.app}>
      <Toaster position="top-center" />
      <SearchBar onSubmit={searchMovies} />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {isSuccess && movieData.results.length > 0 && (
        <>
          <MovieGrid movies={movieData.results} onSelect={handleSelectMovie} />

          {movieData.total_pages > 1 && (
            <ReactPaginate
              containerClassName={css.pagination}
              activeClassName={css.active}
              pageCount={movieData.total_pages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              previousLabel="←"
              nextLabel="→"
            />
          )}
        </>
      )}

      {showModal && chosenMovie && (
        <MovieModal onClose={handleCloseModal} movie={chosenMovie} />
      )}
    </div>
  );
}
