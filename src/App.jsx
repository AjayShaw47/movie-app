import { useState, useEffect } from 'react'
import { useDebounce } from 'react-use'
import './App.css'
import Search from './components/Search'
import Spinner from './components/Spinner'
import MovieCard from './components/MovieCard'
import { updateSearchCount, getTrendingMovies } from './appwrite'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const API_BASE_URL = `https://api.themoviedb.org/3`

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}


function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  const [movies, setMovies] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [trendingMovies, setTrendingMovies] = useState([])

  useDebounce(() => {
    setDebouncedSearchTerm(searchTerm)
  }, 500, [searchTerm])

  const fetchMovies = async (query) => {
    setIsLoading(true)
    setError('')
  try  {
    const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`
    const response = await fetch(endpoint, API_OPTIONS)

    if (!response.ok) {
      throw new Error('Failed to fetch movies')
    }
    const data = await response.json()
    setMovies(data.results || [])

    if(query && data.results.length > 0) {
      await updateSearchCount(query, data.results[0]);
    }
  } catch (error) {
    setError(error.message)
  } finally {
    setIsLoading(false)
  }
}

const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();

      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  }

useEffect(() => {
  fetchMovies(debouncedSearchTerm)
}, [debouncedSearchTerm])

useEffect(() => {
  loadTrendingMovies()
}, [])

  return (
    <main className="min-h-screen w-full bg-[url('/hero-bg.png')] bg-fixed bg-cover bg-center bg-no-repeat flex flex-col items-center">
      <div className='wrapper flex flex-col max-w-[540px]'>
        <header>
          <div className='hero flex justify-center'>
            <img src="/hero.png" alt="" />
          </div>
          <div className='description text-white text-5xl'>
            <h2 className='text-center'>Find <span className="text-5xl font-bold bg-gradient-to-r from-[#CDBBFF] to-[#9278FF] bg-clip-text text-transparent">Movies</span> You'll Love Without the Hassle</h2>
          </div>
        </header>

        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      </div>

      {trendingMovies.length > 0 && (
        <section className="trending w-full max-w-7xl mx-auto px-8 py-10 mt-10">
          <h2 className="text-white text-3xl font-bold mb-6">Trending Movies</h2>
          
          <ul className="flex flex-row gap-5 overflow-x-auto pb-4 custom-scrollbar">
            {trendingMovies.map((movie, index) => (
              <li key={movie.$id} className="min-w-[200px] flex flex-row items-center gap-4">
                <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-purple-600 opacity-50">
                  {index + 1}
                </p>
                <img 
                  src={movie.poster_url} 
                  alt={movie.searchTerm} 
                  className="w-28 h-40 object-cover rounded-xl shadow-lg shadow-black/50"
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className='all-movies py-24 px-8 flex flex-col items-center w-full max-w-7xl mx-auto'>
          <h2 className='text-white text-3xl font-bold mb-10 self-start'>Movies Suggestions</h2>
          {isLoading ? 
          (<Spinner />)
          :
          error ?
          (<div className='text-red-500'>Error: {error}</div>)
          :
          (<div className='movies-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 w-full'>
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>)
        }
      </section>

    </main>

  )
}

export default App
