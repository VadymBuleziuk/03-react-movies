import css from "./App.module.css";
import SearchBar from "../SearchBar/SearchBar";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import type { Movie } from "../types/movie";
import { useState } from "react";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

function App() {
  const [collection, setCollection] = useState<Movie[]>([]);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<boolean>(false);
  const token = import.meta.env.VITE_TMDB_TOKEN;
  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => setSelectedMovie(null);
  const handleSubmit = async (query: string) => {
    setShowLoader(true);
    setError(false);

    try {
      const response = await axios.get<MoviesResponse>(
        "https://api.themoviedb.org/3/search/movie",
        {
          params: { query },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.total_results === 0) {
        toast.error("No movies found for your request.");
        setCollection([]);
        return;
      }

      setCollection(response.data.results);
    } catch {
      setError(true);
      toast.error("Request failed");
    } finally {
      setShowLoader(false);
    }
  };

  return (
    <div className={css.app}>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSubmit} />
      {error ? (
        <ErrorMessage />
      ) : (
        <MovieGrid movies={collection} onSelect={openModal} />
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
      {showLoader && <Loader />}
    </div>
  );
}

export default App;
