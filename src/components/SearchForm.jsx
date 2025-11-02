import React, { useState } from 'react';
import './SearchForm.css';

const SearchForm = ({ onSearch, loading }) => {
  const [formData, setFormData] = useState({
    keyword: '',
    mediaType: 'music',
    country: 'US',
    limit: '25',
    explicit: 'all'
  });

  const [errors, setErrors] = useState({});

  // Destructuring for modern JavaScript
  const { keyword, mediaType, country, limit, explicit } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!keyword.trim()) {
      newErrors.keyword = 'Search keyword is required';
    } else if (keyword.trim().length < 2) {
      newErrors.keyword = 'Keyword must be at least 2 characters';
    }

    if (!mediaType) {
      newErrors.mediaType = 'Please select a media type';
    }

    if (!country) {
      newErrors.country = 'Please select a country';
    }

    const limitNum = parseInt(limit);
    if (!limit || limitNum < 1 || limitNum > 200) {
      newErrors.limit = 'Limit must be between 1 and 200';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Pass search parameters to parent component
    onSearch(formData);
  };

  const handleReset = () => {
    setFormData({
      keyword: '',
      mediaType: 'music',
      country: 'US',
      limit: '25',
      explicit: 'all'
    });
    setErrors({});
  };

  return (
    <form className="search-form" onSubmit={handleSubmit} noValidate>
      <div className="form-header">
        <h2 className="form-title">🔍 Search Music</h2>
        <p className="form-description">Find your favorite tracks, albums, and artists</p>
      </div>

      <div className="form-grid">
        {/* Input 1: Keyword Search - Required, minLength validation */}
        <div className="form-group">
          <label htmlFor="keyword" className="form-label">
            Search Keyword <span className="required">*</span>
          </label>
          <input
            type="text"
            id="keyword"
            name="keyword"
            className={`form-input ${errors.keyword ? 'error' : ''}`}
            value={keyword}
            onChange={handleChange}
            placeholder="Enter artist, song, or album name"
            required
            minLength="2"
            maxLength="100"
            aria-required="true"
            aria-invalid={errors.keyword ? 'true' : 'false'}
            aria-describedby={errors.keyword ? 'keyword-error' : undefined}
          />
          {errors.keyword && (
            <span id="keyword-error" className="error-text" role="alert">
              {errors.keyword}
            </span>
          )}
        </div>

        {/* Input 2: Media Type Dropdown - Required */}
        <div className="form-group">
          <label htmlFor="mediaType" className="form-label">
            Media Type <span className="required">*</span>
          </label>
          <select
            id="mediaType"
            name="mediaType"
            className={`form-select ${errors.mediaType ? 'error' : ''}`}
            value={mediaType}
            onChange={handleChange}
            required
            aria-required="true"
            aria-invalid={errors.mediaType ? 'true' : 'false'}
          >
            <option value="music">Music</option>
            <option value="movie">Movie</option>
            <option value="podcast">Podcast</option>
            <option value="musicVideo">Music Video</option>
            <option value="audiobook">Audiobook</option>
            <option value="tvShow">TV Show</option>
            <option value="ebook">eBook</option>
          </select>
          {errors.mediaType && (
            <span className="error-text" role="alert">{errors.mediaType}</span>
          )}
        </div>

        {/* Input 3: Country Dropdown - Required */}
        <div className="form-group">
          <label htmlFor="country" className="form-label">
            Country <span className="required">*</span>
          </label>
          <select
            id="country"
            name="country"
            className={`form-select ${errors.country ? 'error' : ''}`}
            value={country}
            onChange={handleChange}
            required
            aria-required="true"
          >
            <option value="US">United States</option>
            <option value="GB">United Kingdom</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
            <option value="JP">Japan</option>
            <option value="KR">South Korea</option>
            <option value="ID">Indonesia</option>
            <option value="SG">Singapore</option>
            <option value="MY">Malaysia</option>
            <option value="TH">Thailand</option>
          </select>
          {errors.country && (
            <span className="error-text" role="alert">{errors.country}</span>
          )}
        </div>

        {/* Input 4: Result Limit - Number input with min/max validation */}
        <div className="form-group">
          <label htmlFor="limit" className="form-label">
            Results Limit <span className="required">*</span>
          </label>
          <input
            type="number"
            id="limit"
            name="limit"
            className={`form-input ${errors.limit ? 'error' : ''}`}
            value={limit}
            onChange={handleChange}
            min="1"
            max="200"
            required
            aria-required="true"
            aria-invalid={errors.limit ? 'true' : 'false'}
          />
          {errors.limit && (
            <span className="error-text" role="alert">{errors.limit}</span>
          )}
          <small className="form-hint">Between 1 and 200 results</small>
        </div>

        {/* Input 5: Explicit Content Filter - Radio buttons */}
        <div className="form-group">
          <label className="form-label">
            Explicit Content
          </label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="explicit"
                value="all"
                checked={explicit === 'all'}
                onChange={handleChange}
                aria-label="Show all content"
              />
              <span>All</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="explicit"
                value="yes"
                checked={explicit === 'yes'}
                onChange={handleChange}
                aria-label="Show only explicit content"
              />
              <span>Yes</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="explicit"
                value="no"
                checked={explicit === 'no'}
                onChange={handleChange}
                aria-label="Hide explicit content"
              />
              <span>No</span>
            </label>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          aria-label="Search for music"
        >
          {loading ? (
            <>
              <span className="btn-spinner"></span>
              Searching...
            </>
          ) : (
            <>
              <span>🔎</span>
              Search
            </>
          )}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleReset}
          disabled={loading}
          aria-label="Reset form"
        >
          <span>🔄</span>
          Reset
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
