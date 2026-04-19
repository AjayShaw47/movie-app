import { useState, useEffect } from 'react'
import { useDebounce } from 'react-use'
import './App.css'
import Search from './components/Search'
import Spinner from './components/Spinner'
import MovieCard from './components/MovieCard'

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
  const [error, setError] = useState('')
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

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
  } catch (error) {
    setError(error.message)
  } finally {
    setIsLoading(false)
  }
}

useEffect(() => {
  fetchMovies(debouncedSearchTerm)
}, [debouncedSearchTerm])

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

      <section className='all-movies py-24 px-8 flex flex-col items-center w-full max-w-7xl mx-auto'>
          <h2 className='text-white text-3xl font-bold mb-10 self-start'>Trending Movies</h2>
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
