import React, { useState, useRef } from 'react';
import './DataTable.css';

const DataTable = ({ data, onAddToPlaylist }) => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const audioRef = useRef(null);

  const handlePlayPause = (trackId, previewUrl) => {
    if (!previewUrl) {
      alert('No preview available for this track');
      return;
    }

    if (currentlyPlaying === trackId) {
      // Pause current track
      audioRef.current?.pause();
      setCurrentlyPlaying(null);
    } else {
      // Play new track
      if (audioRef.current) {
        audioRef.current.src = previewUrl;
        audioRef.current.play().catch(err => {
          console.error('Error playing audio:', err);
        });
      }
      setCurrentlyPlaying(trackId);
    }
  };

  const handleAudioEnded = () => {
    setCurrentlyPlaying(null);
  };

  const formatPrice = (price, currency) => {
    if (price === undefined || price === null) return 'N/A';
    return `${currency || '$'}${price.toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const truncateText = (text, maxLength = 30) => {
    if (!text) return 'N/A';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="data-table-container">
      <audio 
        ref={audioRef} 
        onEnded={handleAudioEnded}
        aria-label="Audio preview player"
      />
      
      <div className="table-wrapper">
        <table className="data-table" role="table">
          <thead>
            <tr role="row">
              <th scope="col" className="th-artwork">Artwork</th>
              <th scope="col" className="th-track">Track Name</th>
              <th scope="col" className="th-artist">Artist</th>
              <th scope="col" className="th-album">Album</th>
              <th scope="col" className="th-price">Price</th>
              <th scope="col" className="th-release">Release Date</th>
              <th scope="col" className="th-preview">Preview</th>
              <th scope="col" className="th-action">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
              const {
                trackId,
                artworkUrl100,
                artworkUrl60,
                trackName,
                artistName,
                collectionName,
                trackPrice,
                collectionPrice,
                currency,
                releaseDate,
                previewUrl
              } = item;

              return (
                <tr key={trackId} role="row" className="table-row">
                  <td className="td-artwork" data-label="Artwork">
                    <img
                      src={artworkUrl100 || artworkUrl60 || '/placeholder.png'}
                      alt={`${trackName || 'Track'} artwork`}
                      className="artwork-img"
                      loading="lazy"
                    />
                  </td>
                  <td className="td-track" data-label="Track">
                    <span className="track-name" title={trackName}>
                      {truncateText(trackName, 40)}
                    </span>
                  </td>
                  <td className="td-artist" data-label="Artist">
                    <span title={artistName}>
                      {truncateText(artistName, 30)}
                    </span>
                  </td>
                  <td className="td-album" data-label="Album">
                    <span title={collectionName}>
                      {truncateText(collectionName, 30)}
                    </span>
                  </td>
                  <td className="td-price" data-label="Price">
                    <span className="price-badge">
                      {formatPrice(trackPrice || collectionPrice, currency)}
                    </span>
                  </td>
                  <td className="td-release" data-label="Release Date">
                    {formatDate(releaseDate)}
                  </td>
                  <td className="td-preview" data-label="Preview">
                    <button
                      className={`preview-btn ${currentlyPlaying === trackId ? 'playing' : ''}`}
                      onClick={() => handlePlayPause(trackId, previewUrl)}
                      disabled={!previewUrl}
                      aria-label={currentlyPlaying === trackId ? 'Pause preview' : 'Play preview'}
                      title={previewUrl ? 'Play/Pause preview' : 'No preview available'}
                    >
                      {currentlyPlaying === trackId ? (
                        <span className="icon-pause">⏸</span>
                      ) : (
                        <span className="icon-play">▶</span>
                      )}
                    </button>
                  </td>
                  <td className="td-action" data-label="Action">
                    <button
                      className="add-btn"
                      onClick={() => onAddToPlaylist(item)}
                      aria-label={`Add ${trackName} to playlist`}
                      title="Add to playlist"
                    >
                      <span className="add-icon">➕</span>
                      <span className="add-text">Add</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">🎵</span>
          <p>No music found. Try searching for something!</p>
        </div>
      )}
    </div>
  );
};

export default DataTable;
