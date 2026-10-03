"use client";

import { useEffect, useState } from "react";
import NoteItem from "./components/NoteItem";

const STORAGE_KEY = "my-notes";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [storageReady, setStorageReady] = useState(false);
  const [canSave, setCanSave] = useState(false);
  const [storageMessage, setStorageMessage] = useState("");

  useEffect(() => {
    try {
      const savedNotes = window.localStorage.getItem(STORAGE_KEY);
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes);
        if (!Array.isArray(parsedNotes)) {
          throw new Error("Saved notes must be a list.");
        }
        setNotes(parsedNotes);
      }
      setCanSave(true);
    } catch {
      setStorageMessage(
        "Saved notes could not be loaded. You can still use this page, but changes may not be saved."
      );
    } finally {
      setStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!storageReady || !canSave) return;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      setStorageMessage("");
    } catch {
      setStorageMessage(
        "Your latest changes could not be saved in this browser. Try freeing some storage space."
      );
    }
  }, [notes, storageReady, canSave]);

  function resetForm() {
    setTitle("");
    setDescription("");
    setEditingNoteId(null);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const cleanTitle = title.trim();
    const cleanDescription = description.trim();

    if (!cleanTitle || !cleanDescription) return;

    if (editingNoteId !== null) {
      setNotes((currentNotes) =>
        currentNotes.map((note) =>
          note.id === editingNoteId
            ? { ...note, title: cleanTitle, description: cleanDescription }
            : note
        )
      );
    } else {
      setNotes((currentNotes) => [
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          title: cleanTitle,
          description: cleanDescription,
        },
        ...currentNotes,
      ]);
    }

    resetForm();
  }

  function handleEdit(note) {
    setTitle(note.title);
    setDescription(note.description);
    setEditingNoteId(note.id);
  }

  function handleDelete(noteId) {
    setNotes((currentNotes) =>
      currentNotes.filter((note) => note.id !== noteId)
    );
    if (editingNoteId === noteId) resetForm();
  }

  return (
    <main className="page-shell">
      <div className="page-content">
        <header className="page-header">
          <div className="brand-mark" aria-hidden="true">N</div>
          <p className="eyebrow">A LITTLE SPACE FOR YOUR IDEAS</p>
          <h1>My Notes</h1>
          <p className="page-subtitle">
            Keep the thoughts you want to come back to.
          </p>
        </header>

        <section className="composer panel" aria-labelledby="composer-heading">
          <div className="section-heading">
            <div>
              <p className="section-kicker">
                {editingNoteId !== null ? "MAKE A CHANGE" : "START WRITING"}
              </p>
              <h2 id="composer-heading">
                {editingNoteId !== null ? "Edit your note" : "Create a note"}
              </h2>
            </div>
            <span className="pen-icon" aria-hidden="true">✎</span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="field-group">
              <label htmlFor="note-title">Title</label>
              <input
                id="note-title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Give your note a name"
                maxLength={100}
                required
              />
            </div>
            <div className="field-group">
              <label htmlFor="note-description">Description</label>
              <textarea
                id="note-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="What's on your mind?"
                rows={4}
                required
              />
            </div>
            <div className="form-actions">
              <button className="primary-button" type="submit">
                {editingNoteId !== null ? "Update Note" : "Add Note"}
                <span aria-hidden="true">→</span>
              </button>
              {editingNoteId !== null && (
                <button
                  className="cancel-button"
                  type="button"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="notes-section" aria-labelledby="notes-heading">
          <div className="notes-heading">
            <div>
              <p className="section-kicker">YOUR COLLECTION</p>
              <h2 id="notes-heading">All notes</h2>
            </div>
            <span className="note-count">
              {notes.length} {notes.length === 1 ? "note" : "notes"}
            </span>
          </div>

          {storageMessage && (
            <p className="storage-message" role="status">
              {storageMessage}
            </p>
          )}

          {!storageReady ? (
            <div className="empty-state" role="status">
              <span className="empty-icon" aria-hidden="true">…</span>
              <p>Loading your notes…</p>
            </div>
          ) : notes.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon" aria-hidden="true">✧</span>
              <h3>A fresh page</h3>
              <p>Your notes will find a home here when you add one.</p>
            </div>
          ) : (
            <div className="notes-grid">
              {notes.map((note) => (
                <NoteItem
                  key={note.id}
                  note={note}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>

        <footer className="page-footer">
          <span className="footer-sparkle" aria-hidden="true">✳</span>
          A calm corner for your busy mind
        </footer>
      </div>
    </main>
  );
}
