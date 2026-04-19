
const Search = ({searchTerm, setSearchTerm}) => {
    return (
        <div className='search-bar-container mt-10 bg-black flex'>  
          <div className='pt-3 mr-2'>
            <img src="/search.svg" alt="search-icon" />
          </div>
          <input 
            type="text" 
            placeholder='Search through 3000+ movies online' 
            className='w-full h-10 text-white px-2 bg-transparent outline-none focus:ring-0' 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
    )
}

export default Search   