import { useState } from "react";

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
  const [filmList, setFilmList] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [chosenMovie, setChosenMovie] = useState<Movie | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setChosenMovie(null);
  };

  const handleSelectMovie = (movie: Movie) => {
    setChosenMovie(movie);
    handleOpenModal();
  };

  const searchMovies = async (query: string) => {
    if (!query.trim()) {
      toast.error("Please enter your search query.");
      return;
    }

    setFilmList([]);
    setHasError(false);
    setIsLoading(true);

    try {
      const result = await fetchMovies(query);
      if (result.length === 0) {
        toast.error("No movies found for your request.");
      } else {
        setFilmList(result);
      }
    } catch (err) {
      console.error(err);
      setHasError(true);
      toast.error("There was an error, please try again...");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={css.app}>
      <Toaster position="top-center" />
      <SearchBar onSubmit={searchMovies} />

      {isLoading && <Loader />}
      {hasError && <ErrorMessage />}
      {filmList.length > 0 && (
        <MovieGrid movies={filmList} onSelect={handleSelectMovie} />
      )}
      {showModal && chosenMovie && (
        <MovieModal onClose={handleCloseModal} movie={chosenMovie} />
      )}
    </div>
  );
}
