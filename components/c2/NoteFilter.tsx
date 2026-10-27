"use client";

import Link from "next/link";
import { useState } from "react";

type NoteFilterProps = {
  notes: Array<{
    slug: string;
    title: string;
    summary: string;
    category: string;
    tags: string[];
    updatedLabel: string;
  }>;
};

// Category buttons over the published notes list; filtering only hides cards on this page.
export function NoteFilter({ notes }: NoteFilterProps) {
  const [category, setCategory] = useState("");
  const categories = Array.from(new Set(notes.map((note) => note.category)));

  return (
    <>
      <div className="c2-filters" role="group" aria-label="按分类筛选">
        <button type="button" aria-pressed={category === ""} onClick={() => setCategory("")}>
          全部<span>{notes.length}</span>
        </button>
        {categories.map((item) => (
          <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)}>
            {item}
            <span>{notes.filter((note) => note.category === item).length}</span>
          </button>
        ))}
      </div>

      <div className="c2-note-list">
        {notes.map((note) => (
          <Link
            key={note.slug}
            href={`/notes/${note.slug}`}
            className="c2-card c2-note"
            hidden={category !== "" && note.category !== category}
          >
            <div className="c2-note__meta">
              <strong>{note.category}</strong>
              <span>更新 {note.updatedLabel}</span>
            </div>
            <div>
              <h2>{note.title}</h2>
              <p>{note.summary}</p>
              <div className="c2-chips">
                {note.tags.map((tag) => (
                  <span key={tag} className="c2-chip">{tag}</span>
                ))}
              </div>
            </div>
            <span className="c2-note__go" aria-hidden="true">→</span>
          </Link>
        ))}
      </div>
    </>
  );
}
