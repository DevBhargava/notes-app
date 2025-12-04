'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, Plus, Edit2, Trash2, LogOut, Save, X } from 'lucide-react';

const API_URL = 'http://localhost:8081/api';

export default function NotesApp() {
  const [currentView, setCurrentView] = useState('signin');
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER'
  });

  const [noteForm, setNoteForm] = useState({
    id: null,
    title: '',
    description: ''
  });

  const [showNoteForm, setShowNoteForm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
      setCurrentView('dashboard');
      fetchNotes();
    }
  }, []);

  const showMessage = (msg, type = 'error') => {
    if (type === 'error') {
      setError(msg);
      setTimeout(() => setError(''), 5000);
    } else {
      setSuccess(msg);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const fetchNotes = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/notes`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch notes');

      const data = await response.json();
      setNotes(data);
    } catch (err) {
      showMessage(err.message);
    }
  };

  const handleSignUp = async () => {
    if (!authForm.name || !authForm.email || !authForm.password) {
      showMessage('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Sign up failed');
      }

      showMessage('Account created successfully! Please sign in.', 'success');
      setCurrentView('signin');
      setAuthForm({ name: '', email: '', password: '', role: 'USER' });
    } catch (err) {
      showMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!authForm.email || !authForm.password) {
      showMessage('Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: authForm.email,
          password: authForm.password
        })
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setCurrentView('dashboard');
      fetchNotes();
      showMessage('Signed in successfully!', 'success');
    } catch (err) {
      showMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setNotes([]);
    setCurrentView('signin');
    showMessage('Logged out successfully', 'success');
  };

  const handleCreateNote = async () => {
    if (!noteForm.title || !noteForm.description) {
      showMessage('Please fill all fields');
      return;
    }

    const token = localStorage.getItem('token');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: noteForm.title,
          description: noteForm.description
        })
      });

      if (!response.ok) throw new Error('Failed to create note');

      showMessage('Note created successfully!', 'success');
      setNoteForm({ id: null, title: '', description: '' });
      setShowNoteForm(false);
      fetchNotes();
    } catch (err) {
      showMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNote = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/notes/${noteForm.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: noteForm.title,
          description: noteForm.description
        })
      });

      if (!response.ok) throw new Error('Failed to update note');

      showMessage('Note updated successfully!', 'success');
      setNoteForm({ id: null, title: '', description: '' });
      setShowNoteForm(false);
      fetchNotes();
    } catch (err) {
      showMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (id) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    const token = localStorage.getItem('token');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/notes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete note');

      showMessage('Note deleted successfully!', 'success');
      fetchNotes();
    } catch (err) {
      showMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (note) => {
    setNoteForm({
      id: note.id,
      title: note.title,
      description: note.description
    });
    setShowNoteForm(true);
  };

  const cancelForm = () => {
    setNoteForm({ id: null, title: '', description: '' });
    setShowNoteForm(false);
  };

  if (currentView === 'signin' || currentView === 'signup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Notes App
          </h1>
          <p className="text-gray-600 mb-6 text-center">
            {currentView === 'signin'
              ? 'Sign in to your account'
              : 'Create a new account'}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <span className="text-green-700 text-sm">{success}</span>
            </div>
          )}

          <div>
            {currentView === 'signup' && (
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={authForm.name}
                  onChange={(e) =>
                    setAuthForm({ ...authForm, name: e.target.value })
                  }
                  onKeyPress={(e) =>
                    e.key === 'Enter' && handleSignUp()
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 caret-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your name"
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={authForm.email}
                onChange={(e) =>
                  setAuthForm({ ...authForm, email: e.target.value })
                }
                onKeyPress={(e) =>
                  e.key === 'Enter'
                    ? currentView === 'signin'
                      ? handleSignIn()
                      : handleSignUp()
                    : null
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 caret-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                value={authForm.password}
                onChange={(e) =>
                  setAuthForm({ ...authForm, password: e.target.value })
                }
                onKeyPress={(e) =>
                  e.key === 'Enter'
                    ? currentView === 'signin'
                      ? handleSignIn()
                      : handleSignUp()
                    : null
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 caret-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>

            {currentView === 'signup' && (
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Role
                </label>
                <select
                  value={authForm.role}
                  onChange={(e) =>
                    setAuthForm({ ...authForm, role: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 caret-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            )}

            <button
              onClick={currentView === 'signin' ? handleSignIn : handleSignUp}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 font-medium"
            >
              {loading
                ? 'Please wait...'
                : currentView === 'signin'
                ? 'Sign In'
                : 'Sign Up'}
            </button>
          </div>

          <div className="mt-4 text-center">
            {currentView === 'signin' ? (
              <p className="text-gray-600">
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => setCurrentView('signup')}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p className="text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => setCurrentView('signin')}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Notes Dashboard</h1>
            <p className="text-sm text-gray-600">
              Welcome, {user?.name} ({user?.role})
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <span className="text-green-700 text-sm">{success}</span>
          </div>
        )}

        <div className="mb-6">
          <button
            onClick={() => setShowNoteForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            Create New Note
          </button>
        </div>

        {showNoteForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {noteForm.id ? 'Edit Note' : 'Create Note'}
              </h2>
              <button
                onClick={cancelForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={noteForm.title}
                  onChange={(e) =>
                    setNoteForm({ ...noteForm, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 caret-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter note title"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={noteForm.description}
                  onChange={(e) =>
                    setNoteForm({ ...noteForm, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 caret-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                  placeholder="Enter note description"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={noteForm.id ? handleUpdateNote : handleCreateNote}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  <Save className="w-4 h-4" />
                  {noteForm.id ? 'Update' : 'Create'}
                </button>
                <button
                  onClick={cancelForm}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-xl font-semibold">Your Notes</h2>
          </div>

          {notes.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No notes yet. Create your first note!
            </div>
          ) : (
            <div className="divide-y">
              {notes.map((note) => (
                <div key={note.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {note.title}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(note)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-2">{note.description}</p>
                  {user?.role === 'ADMIN' && note.user && (
                    <p className="text-sm text-gray-500">
                      Created by: {note.user.name} ({note.user.email})
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
