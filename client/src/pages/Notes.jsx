import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import NoteForm from '../components/NoteForm';
import NoteCard from '../components/NoteCard';

const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/notes`;

// Main Notes Page: Handles CRUD operations
function Notes({ user, token, onLogout }) {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all notes for the current user
  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(API_BASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          onLogout(); // Token expired or invalid
          return;
        }
        throw new Error('Failed to fetch notes');
      }

      const data = await response.json();
      setNotes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  // 1. CREATE NOTE
  const handleCreateNote = async (newNoteData) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newNoteData),
      });

      const savedNote = await response.json();

      if (!response.ok) {
        throw new Error(savedNote.message || 'Failed to create note');
      }

      // Add newly created note to the top of the list
      setNotes([savedNote, ...notes]);
    } catch (err) {
      alert(err.message);
    }
  };

  // 2. EDIT NOTE (Update existing note)
  const handleUpdateNote = async (updatedData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${editingNote._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      const savedNote = await response.json();

      if (!response.ok) {
        throw new Error(savedNote.message || 'Failed to update note');
      }

      // Replace updated note in state
      setNotes(
        notes.map((note) => (note._id === savedNote._id ? savedNote : note))
      );
      setEditingNote(null);
    } catch (err) {
      alert(err.message);
    }
  };

  // 3. DELETE NOTE
  const handleDeleteNote = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this note?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete note');
      }

      // Remove deleted note from state
      setNotes(notes.filter((note) => note._id !== id));

      // If user was currently editing this note, reset editing mode
      if (editingNote && editingNote._id === id) {
        setEditingNote(null);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <Navbar user={user} onLogout={onLogout} />

      <main className="container">
        {/* Note Create / Edit Form */}
        <NoteForm
          onSubmit={editingNote ? handleUpdateNote : handleCreateNote}
          editingNote={editingNote}
          onCancelEdit={() => setEditingNote(null)}
        />

        {/* Notes List Section */}
        <section>
          <div className="notes-header">
            <h3>My Notes ({notes.length})</h3>
          </div>

          {error && <div className="error-msg">{error}</div>}

          {loading ? (
            <p>Loading your notes...</p>
          ) : notes.length === 0 ? (
            <div className="empty-state">
              <p>No notes yet. Create your first note above!</p>
            </div>
          ) : (
            <div className="notes-grid">
              {notes.map((note) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  onEdit={(noteToEdit) => setEditingNote(noteToEdit)}
                  onDelete={handleDeleteNote}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Notes;
