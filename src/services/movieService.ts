import axios from "axios";
import type { Movie } from "../types/movie";

interface MovieResponse {
  results: Movie[];
}

const BASE_URL = "https://api.themoviedb.org/3/search/movie";
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export async function fetchMovies(searchQuery: string): Promise<Movie[]> {
  const config = {
    params: {
      query: searchQuery,
      include_adult: false,
      language: "en-US",
      page: 1,
    },
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  };

  const { data } = await axios.get<MovieResponse>(BASE_URL, config);
  return data.results;
}
