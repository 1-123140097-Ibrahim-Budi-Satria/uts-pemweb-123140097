import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🎵</span>
            <h1 className="logo-text">My Musik</h1>
          </div>
          <nav className="nav" role="navigation" aria-label="Main navigation">
            <ul className="nav-list">
              <li className="nav-item">
                <a href="#search" className="nav-link">Search</a>
              </li>
              <li className="nav-item">
                <a href="#playlist" className="nav-link">Playlist</a>
              </li>
            </ul>
          </nav>
        </div>
        <p className="header-subtitle">Discover music, albums, and artists</p>
      </div>
    </header>
  );
};

export default Header;
