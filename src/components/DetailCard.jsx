import React, { useState, useRef } from 'react';
import './DetailCard.css';

const DetailCard = ({ playlist, onRemove }) => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const audioRef = useRef(null);

  const handlePlayPause = (trackId, previewUrl) => {
    if (!previewUrl) {
      alert('No preview available for this track');
      return;
    }

    if (currentlyPlaying === trackId) {
      audioRef.current?.pause();
      setCurrentlyPlaying(null);
    } else {
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

  const calculateTotalPrice = () => {
    const total = playlist.reduce((sum, track) => {
      return sum + (track.trackPrice || track.collectionPrice || 0);
    }, 0);
    return total.toFixed(2);
  };

  const formatDuration = (milliseconds) => {
    if (!milliseconds) return 'N/A';
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="detail-card-container">
      <audio 
        ref={audioRef} 
        onEnded={handleAudioEnded}
        aria-label="Playlist audio player"
      />

      <div className="playlist-summary">
        <div className="summary-item">
          <span className="summary-label">Total Tracks:</span>
          <span className="summary-value">{playlist.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Total Price:</span>
          <span className="summary-value price">${calculateTotalPrice()}</span>
        </div>
      </div>

      <div className="cards-grid">
        {playlist.map((track) => {
          const {
            trackId,
            artworkUrl100,
            trackName,
            artistName,
            collectionName,
            trackPrice,
            collectionPrice,
            currency,
            releaseDate,
            previewUrl,
            trackTimeMillis,
            primaryGenreName
          } = track;

          return (
            <article key={trackId} className="detail-card" role="article">
              <div className="card-header">
                <img
                  src={artworkUrl100 || '/placeholder.png'}
                  alt={`${trackName} artwork`}
                  className="card-artwork"
                  loading="lazy"
                />
                <div className="play-overlay">
                  <button
                    className={`play-overlay-btn ${currentlyPlaying === trackId ? 'playing' : ''}`}
                    onClick={() => handlePlayPause(trackId, previewUrl)}
                    disabled={!previewUrl}
                    aria-label={currentlyPlaying === trackId ? 'Pause' : 'Play'}
                  >
                    {currentlyPlaying === trackId ? '⏸' : '▶'}
                  </button>
                </div>
              </div>

              <div className="card-body">
                <h3 className="card-title" title={trackName}>
                  {trackName || 'Unknown Track'}
                </h3>
                <p className="card-artist" title={artistName}>
                  {artistName || 'Unknown Artist'}
                </p>
                
                <div className="card-details">
                  <div className="detail-row">
                    <span className="detail-icon">💿</span>
                    <span className="detail-text" title={collectionName}>
                      {collectionName || 'Unknown Album'}
                    </span>
                  </div>
                  
                  {primaryGenreName && (
                    <div className="detail-row">
                      <span className="detail-icon">🎸</span>
                      <span className="detail-text">{primaryGenreName}</span>
                    </div>
                  )}
                  
                  <div className="detail-row">
                    <span className="detail-icon">⏱</span>
                    <span className="detail-text">{formatDuration(trackTimeMillis)}</span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="detail-icon">📅</span>
                    <span className="detail-text">
                      {releaseDate ? new Date(releaseDate).getFullYear() : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="card-footer">
                  <span className="card-price">
                    {currency || '$'}{(trackPrice || collectionPrice || 0).toFixed(2)}
                  </span>
                  <button
                    className="remove-btn"
                    onClick={() => onRemove(trackId)}
                    aria-label={`Remove ${trackName} from playlist`}
                  >
                    <span className="remove-icon">🗑️</span>
                    Remove
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {playlist.length === 0 && (
        <div className="empty-playlist">
          <span className="empty-playlist-icon">🎵</span>
          <p className="empty-playlist-text">Your playlist is empty</p>
          <p className="empty-playlist-hint">Search and add tracks to build your playlist</p>
        </div>
      )}
    </div>
  );
};

export default DetailCard;
