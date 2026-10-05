import React from 'react';

// Single Note Card component displaying title, content, date, and Edit/Delete buttons
function NoteCard({ note, onEdit, onDelete }) {
  // Format createdAt date for readable display
  const formattedDate = new Date(note.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="note-card">
      <div>
        <h4 className="note-card-title">{note.title}</h4>
        <p className="note-card-content">{note.content}</p>
      </div>

      <div className="note-card-footer">
        <span className="note-date">{formattedDate}</span>
        <div className="card-actions">
          <button
            onClick={() => onEdit(note)}
            className="btn btn-secondary btn-sm"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(note._id)}
            className="btn btn-danger btn-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default NoteCard;
