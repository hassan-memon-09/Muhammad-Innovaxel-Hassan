import React, { useState } from 'react';
import axios from 'axios';

const UrlShortener = () => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState(null);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShortUrl(null);
    setStats(null);

    try {
      const response = await axios.post('http://localhost:5000/api/shorten', { url });
      setShortUrl(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Server error');
    }
  };

  const fetchStats = async (shortCode) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/shorten/${shortCode}/stats`);
      setStats(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Server error');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">URL Shortener</h1>
      <div className="mb-4">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleSubmit}
          className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Shorten
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {shortUrl && (
        <div className="mt-4">
          <p>
            Short URL:{' '}
            <a
              href={`http://localhost:5000/api/${shortUrl.shortCode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {`http://localhost:5000/api/${shortUrl.shortCode}`}
            </a>
          </p>
          <button
            onClick={() => fetchStats(shortUrl.shortCode)}
            className="mt-2 bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            View Stats
          </button>
        </div>
      )}
      {stats && (
        <div className="mt-4">
          <p>Original URL: {stats.originalUrl}</p>
          <p>Short Code: {stats.shortCode}</p>
          <p>Access Count: {stats.accessCount}</p>
          <p>Created At: {new Date(stats.createdAt).toLocaleString()}</p>
          <p>Updated At: {new Date(stats.updatedAt).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};

export default UrlShortener;