import React, { useState } from 'react';
import axios from 'axios';

const UrlShortener = () => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState(null);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [shortCode, setShortCode] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [fetchedUrl, setFetchedUrl] = useState(null);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setShortUrl(null);
    setStats(null);
    setFetchedUrl(null);

    try {
      const response = await axios.post('/api/shorten', { url });
      setShortUrl(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Server error');
    }
  };

  const handleFetch = async (e) => {
    e.preventDefault();
    setError('');
    setFetchedUrl(null);
    setStats(null);

    try {
      const response = await axios.get(`/api/shorten/${shortCode}`);
      setFetchedUrl(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Server error');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setShortUrl(null);
    setStats(null);
    setFetchedUrl(null);

    try {
      const response = await axios.put(`/api/shorten/${shortCode}`, { url: newUrl });
      setShortUrl(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Server error');
    }
  };

  const handleDelete = async () => {
    setError('');
    setShortUrl(null);
    setStats(null);
    setFetchedUrl(null);

    try {
      await axios.delete(`/api/shorten/${shortCode}`);
      setError('Short URL deleted successfully');
    } catch (err) {
      setError(err.response?.data?.error || 'Server error');
    }
  };

  const fetchStats = async (shortCode) => {
    setError('');
    setStats(null);

    try {
      const response = await axios.get(`/api/shorten/${shortCode}/stats`);
      setStats(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Server error');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">URL Shortener</h1>

      {/* Create Short URL */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Create Short URL</h2>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL to shorten"
          className="w-full p-2 border rounded mb-2"
        />
        <button
          onClick={handleCreate}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Shorten
        </button>
      </div>

      {/* Fetch Original URL */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Fetch Original URL</h2>
        <input
          type="text"
          value={shortCode}
          onChange={(e) => setShortCode(e.target.value)}
          placeholder="Enter short code"
          className="w-full p-2 border rounded mb-2"
        />
        <button
          onClick={handleFetch}
          className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
        >
          Fetch URL
        </button>
      </div>

      {/* Update Short URL */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Update Short URL</h2>
        <input
          type="text"
          value={shortCode}
          onChange={(e) => setShortCode(e.target.value)}
          placeholder="Enter short code"
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="text"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder="Enter new URL"
          className="w-full p-2 border rounded mb-2"
        />
        <button
          onClick={handleUpdate}
          className="w-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
        >
          Update URL
        </button>
      </div>

      {/* Delete Short URL */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Delete Short URL</h2>
        <input
          type="text"
          value={shortCode}
          onChange={(e) => setShortCode(e.target.value)}
          placeholder="Enter short code"
          className="w-full p-2 border rounded mb-2"
        />
        <button
          onClick={handleDelete}
          className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >
          Delete URL
        </button>
      </div>

      {/* Display Results */}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {shortUrl && (
        <div className="mt-4">
          <p>
            Short URL:{' '}
            <a
              href={`/api/${shortUrl.shortCode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {`${window.location.origin}/api/${shortUrl.shortCode}`}
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
      {fetchedUrl && (
        <div className="mt-4">
          <p>Original URL: {fetchedUrl.originalUrl}</p>
          <p>Short Code: {fetchedUrl.shortCode}</p>
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