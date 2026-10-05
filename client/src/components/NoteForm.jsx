import React, { useState, useEffect } from 'react';

// Form component for creating or editing a note
function NoteForm({ onSubmit, editingNote, onCancelEdit }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  // If editingNote is provided, populate form fields with its data
  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);
    } else {
      setTitle('');
      setContent('');
    }
    setError('');
  }, [editingNote]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError('Please fill in both title and content');
      return;
    }

    setError('');
    onSubmit({ title: title.trim(), content: content.trim() });

    // Clear form if not in edit mode
    if (!editingNote) {
      setTitle('');
      setContent('');
    }
  };

  return (
    <div className="note-form-card">
      <h3>{editingNote ? 'Edit Note' : 'Create New Note'}</h3>

      {error && <div className="error-msg">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="note-title">Title</label>
          <input
            id="note-title"
            type="text"
            placeholder="Enter note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="note-content">Content</label>
          <textarea
            id="note-content"
            placeholder="Write your note here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingNote ? 'Update Note' : 'Create Note'}
          </button>

          {editingNote && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default NoteForm;
