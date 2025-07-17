// === File: frontend/src/components/UrlShortener.js ===
import React, { useState } from 'react';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:5000/api';

const UrlShortener = () => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState(null);
  const [previousUrl, setPreviousUrl] = useState(null);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [shortCode, setShortCode] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [fetchedUrl, setFetchedUrl] = useState(null);
  const [actionMessage, setActionMessage] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    resetStates();
    try {
      const response = await axios.post('/shorten', { url });
      setShortUrl(response.data);
      setActionMessage('Short URL created successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Server error');
    }
  };

  const handleFetch = async (e) => {
    e.preventDefault();
    resetStates();
    try {
      const response = await axios.get(`/shorten/${shortCode}`);
      setFetchedUrl(response.data);
      setActionMessage('Fetched original URL successfully.');
    } catch (err) {
      setError(err.response?.data?.error || 'Server error');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    resetStates();
    try {
      const old = await axios.get(`/shorten/${shortCode}`);
      setPreviousUrl(old.data);
      const response = await axios.put(`/shorten/${shortCode}`, { url: newUrl });
      setShortUrl(response.data);
      setActionMessage('Short URL updated successfully.');
    } catch (err) {
      setError(err.response?.data?.error || 'Server error');
    }
  };

  const handleDelete = async () => {
    resetStates();
    try {
      await axios.delete(`/shorten/${shortCode}`);
      setActionMessage(`Short URL with code "${shortCode}" deleted successfully.`);
    } catch (err) {
      setError(err.response?.data?.error || 'Server error');
    }
  };

  const fetchStats = async (shortCode) => {
    setError('');
    setStats(null);
    try {
      const response = await axios.get(`/shorten/${shortCode}/stats`);
      setStats(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Server error');
    }
  };

  const resetStates = () => {
    setError('');
    setShortUrl(null);
    setStats(null);
    setFetchedUrl(null);
    setPreviousUrl(null);
    setActionMessage('');
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-50 shadow-md rounded-md space-y-6">
      <h1 className="text-3xl font-bold text-center mb-4">🔥 URL Shortener</h1>

      {/* Create */}
      <form onSubmit={handleCreate} className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Create Short URL</h2>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL to shorten"
          className="w-full p-2 border rounded mb-2"
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Shorten
        </button>
      </form>

      {/* Fetch */}
      <form onSubmit={handleFetch} className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Fetch Original URL</h2>
        <input
          type="text"
          value={shortCode}
          onChange={(e) => setShortCode(e.target.value)}
          placeholder="Enter short code"
          className="w-full p-2 border rounded mb-2"
        />
        <button type="submit" className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700">
          Fetch
        </button>
      </form>

      {/* Update */}
      <form onSubmit={handleUpdate} className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Update Short URL</h2>
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
        <button type="submit" className="w-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600">
          Update
        </button>
      </form>

      {/* Delete */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Delete Short URL</h2>
        <input
          type="text"
          value={shortCode}
          onChange={(e) => setShortCode(e.target.value)}
          placeholder="Enter short code"
          className="w-full p-2 border rounded mb-2"
        />
        <button onClick={handleDelete} className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700">
          Delete
        </button>
      </div>

      {/* Result / Messages */}
      {actionMessage && <div className="bg-green-100 text-green-700 p-3 rounded shadow">{actionMessage}</div>}
      {error && <div className="bg-red-100 text-red-700 p-3 rounded shadow">{error}</div>}

      {/* Result Blocks */}
      {shortUrl && (
        <div className="bg-blue-50 p-4 rounded shadow">
          <p><strong>Short URL:</strong> <a href={`http://localhost:5000/${shortUrl.shortCode}`} target="_blank" rel="noreferrer" className="text-blue-600 underline">{`http://localhost:5000/${shortUrl.shortCode}`}</a></p>
          <p><strong>Original URL:</strong> {shortUrl.originalUrl}</p>
          <button onClick={() => fetchStats(shortUrl.shortCode)} className="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">View Stats</button>
        </div>
      )}

      {fetchedUrl && (
        <div className="bg-purple-50 p-4 rounded shadow">
          <p><strong>Original URL:</strong> {fetchedUrl.originalUrl}</p>
          <p><strong>Short Code:</strong> {fetchedUrl.shortCode}</p>
        </div>
      )}

      {previousUrl && shortUrl && (
        <div className="bg-yellow-50 p-4 rounded shadow">
          <p><strong>Before:</strong> {previousUrl.originalUrl}</p>
          <p><strong>After:</strong> {shortUrl.originalUrl}</p>
          <p><strong>Short Code:</strong> {shortUrl.shortCode}</p>
        </div>
      )}

      {stats && (
        <div className="bg-green-50 p-4 rounded shadow">
          <p><strong>Original URL:</strong> {stats.originalUrl}</p>
          <p><strong>Short Code:</strong> {stats.shortCode}</p>
          <p><strong>Access Count:</strong> {stats.accessCount}</p>
          <p><strong>Created At:</strong> {new Date(stats.createdAt).toLocaleString()}</p>
          <p><strong>Updated At:</strong> {new Date(stats.updatedAt).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};

export default UrlShortener;