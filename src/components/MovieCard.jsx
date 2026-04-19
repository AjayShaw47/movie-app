const MovieCard = ({movie:{title, poster_path, vote_average, release_date, original_language}}) => {
    return (
        <div className='movie-card bg-[#0f1117] p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-black/60'>
            <div className='movie-poster'>
                <img 
                    src={poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : '/no-movie.png'} 
                    alt={title} 
                    className="rounded-lg w-full h-auto object-cover"
                />
            </div>
                <div className='movie-info mt-4'>
                    <p className='text-white font-bold text-base line-clamp-1'>{title}</p>
                    
                    <div className='flex flex-row items-center flex-wrap gap-2 mt-2'>
                        <div className="flex flex-row items-center gap-1">
                            <img src="/star.svg" alt="star-icon" className='w-4 h-4' />
                            <p className='text-white font-semibold text-sm'>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
                        </div>
                        
                        <span className="text-gray-500">•</span>
                        <p className="capitalize text-gray-400 font-medium text-sm">{original_language}</p>

                        <span className="text-gray-500">•</span>
                        <p className="text-gray-400 font-medium text-sm">{release_date ? release_date.split('-')[0] : 'N/A'}</p>
                    </div>
                </div>

        </div>
    )
}

export default MovieCard