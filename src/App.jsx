import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import DataTable from './components/DataTable';
import DetailCard from './components/DetailCard';

const App = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [sortBy, setSortBy] = useState('');

  // Load playlist from localStorage on mount
  useEffect(() => {
    const savedPlaylist = localStorage.getItem('musicPlaylist');
    if (savedPlaylist) {
      setPlaylist(JSON.parse(savedPlaylist));
    }
  }, []);

  // Save playlist to localStorage whenever it changes
  useEffect(() => {
    if (playlist.length > 0) {
      localStorage.setItem('musicPlaylist', JSON.stringify(playlist));
    }
  }, [playlist]);

  const handleSearch = async (searchParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const { keyword, mediaType, country, limit, explicit } = searchParams;
      const explicitParam = explicit === 'yes' ? 'Yes' : explicit === 'no' ? 'No' : '';
      
      const url = `https://itunes.apple.com/search?term=${encodeURIComponent(keyword)}&media=${mediaType}&country=${country}&limit=${limit}${explicitParam ? `&explicit=${explicitParam}` : ''}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSearchResults(data.results || []);
      
      if (data.results.length === 0) {
        setError('No results found. Try different search terms.');
      }
    } catch (err) {
      setError(`Failed to fetch data: ${err.message}`);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const addToPlaylist = (track) => {
    const isAlreadyInPlaylist = playlist.some(item => item.trackId === track.trackId);
    
    if (!isAlreadyInPlaylist) {
      setPlaylist([...playlist, track]);
    } else {
      alert('This track is already in your playlist!');
    }
  };

  const removeFromPlaylist = (trackId) => {
    const updatedPlaylist = playlist.filter(item => item.trackId !== trackId);
    setPlaylist(updatedPlaylist);
    localStorage.setItem('musicPlaylist', JSON.stringify(updatedPlaylist));
  };

  const clearPlaylist = () => {
    if (window.confirm('Are you sure you want to clear your entire playlist?')) {
      setPlaylist([]);
      localStorage.removeItem('musicPlaylist');
    }
  };

  const sortResults = (sortType) => {
    setSortBy(sortType);
    let sortedResults = [...searchResults];
    
    if (sortType === 'releaseDate') {
      sortedResults.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
    } else if (sortType === 'price') {
      sortedResults.sort((a, b) => (a.trackPrice || 0) - (b.trackPrice || 0));
    }
    
    setSearchResults(sortedResults);
  };

  return (
    <div className="app">
      <Header />
      
      <main className="container">
        <section className="search-section" aria-label="Search Section">
          <SearchForm onSearch={handleSearch} loading={loading} />
        </section>

        {error && (
          <div className="error-message" role="alert">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {loading && (
          <div className="loading" role="status" aria-live="polite">
            <div className="spinner"></div>
            <p>Searching for music...</p>
          </div>
        )}

        {!loading && searchResults.length > 0 && (
          <section className="results-section" aria-label="Search Results">
            <div className="results-header">
              <h2>Search Results ({searchResults.length})</h2>
              <div className="sort-controls">
                <label htmlFor="sort-select">Sort by:</label>
                <select 
                  id="sort-select"
                  value={sortBy} 
                  onChange={(e) => sortResults(e.target.value)}
                  aria-label="Sort results"
                >
                  <option value="">Default</option>
                  <option value="releaseDate">Release Date</option>
                  <option value="price">Price</option>
                </select>
              </div>
            </div>
            <DataTable 
              data={searchResults} 
              onAddToPlaylist={addToPlaylist}
            />
          </section>
        )}

        {playlist.length > 0 && (
          <section className="playlist-section" aria-label="My Playlist">
            <div className="playlist-header">
              <h2>My Playlist ({playlist.length} tracks)</h2>
              <button 
                className="clear-btn"
                onClick={clearPlaylist}
                aria-label="Clear entire playlist"
              >
                Clear All
              </button>
            </div>
            <DetailCard 
              playlist={playlist} 
              onRemove={removeFromPlaylist}
            />
          </section>
        )}
      </main>

      <footer className="footer">
        <p>2025 My Musik | iTunes Search API</p>
      </footer>
    </div>
  );
};

export default App;
