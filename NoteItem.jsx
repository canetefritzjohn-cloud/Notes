export default function NoteItem({ note, onEdit, onDelete }) {
  return (
    <article className="note-card">
      <div className="note-card-accent" aria-hidden="true" />
      <h3>{note.title}</h3>
      <p className="note-description">{note.description}</p>
      <div className="note-actions">
        <button
          className="edit-button"
          type="button"
          onClick={() => onEdit(note)}
          aria-label={`Edit ${note.title}`}
        >
          Edit
        </button>
        <button
          className="delete-button"
          type="button"
          onClick={() => onDelete(note.id)}
          aria-label={`Delete ${note.title}`}
        >
          Delete
        </button>
      </div>
    </article>
  );
}
