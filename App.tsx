import React, { useState, useEffect } from 'react';
import axios from 'axios';

//  This defines an interface called "Movie" that describes the structure of a movie object. It includes properties such as title, episode_id, release_date, director, and opening_crawl:

interface Movie {
  title: string;
  episode_id: number;
  release_date: string;
  director: string;
  opening_crawl: string;
}
//This is the main functional component of the application. It contains the entire logic and structure of the app
function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [orderOption, setOrderOption] = useState<string>('episode_id');
  const [filterText, setFilterText] = useState<string>('');
/*
useState is used to declare and initialize state variables for the component. The component has several state variables:
movies: An array of Movie objects retrieved from the API.
selectedMovie: Stores the currently selected movie.
orderOption: Stores the selected sorting option (episode_id or release_date).
filterText: Stores the text entered by the user to filter movies by title*/
  useEffect(() => {
    axios.get('https://swapi.dev/api/films/?format=json')
      .then((response) => {
        setMovies(response.data.results);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);
  const movieImages: { [key: string]: string } = {
    'A New Hope': 'url_to_image_for_A_New_Hope.jpg',
    'The Empire Strikes Back': 'url_to_image_for_The_Empire_Strikes_Back.jpg',
    // image URLs for other movies could be added here (it can be added using api provided or only url adresses from photoes on the web)
  };

  /*useEffect Hook:
useEffect is used to fetch movie data from the SWAPI when the component is mounted ([] as the dependency array ensures it only runs once). The fetched data is stored in the movies state variable.*/
  
  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(filterText.toLowerCase())
  );
/*The filteredMovies array is created by filtering the movies array based on the filterText entered by the user.
The sortedMovies array is created by sorting the filteredMovies array based on the orderOption selected by the user. Sorting can be done by episode ID or release date.*/
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    if (orderOption === 'episode_id') {
      return a.episode_id - b.episode_id;
    } else if (orderOption === 'release_date') {
      return new Date(a.release_date).getTime() - new Date(b.release_date).getTime();
    }
    // more sorting options could be added here if I had more time
    return 0;
  });
/*handleMovieClick is a function that sets the selectedMovie state variable to the movie clicked by the user.*/
  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  return (
    <div className="App">
      <div className="movie-list">
        <input
          type="text"
          placeholder="Search by movie name"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <select
          value={orderOption}
          onChange={(e) => setOrderOption(e.target.value)}
        >
          <option value="episode_id">Sort by Episode</option>
          <option value="release_date">Sort by Release Date</option>
        </select>
        <ul>
          {sortedMovies.map((movie) => (
            <li key={movie.episode_id} onClick={() => handleMovieClick(movie)}>
              {movie.title}
            </li>
          ))}
        </ul>
      </div>
      <div className="movie-details">
        {selectedMovie ? (
          <div>
            <h2>{selectedMovie.title}</h2>
            <img
      src={movieImages[selectedMovie.title]}
      alt={selectedMovie.title}
      style={{ maxWidth: '100%', height: 'auto' }}
    />
            <p>Director: {selectedMovie.director}</p>
            <p>Release Date: {selectedMovie.release_date}</p>
            <p>{selectedMovie.opening_crawl}</p>
          </div>
        ) : (
          <p>Select a movie to view details</p>
        )}
      </div>
    </div>
  );
}

export default App;
