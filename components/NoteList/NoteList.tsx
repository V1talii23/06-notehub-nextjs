'use client';

// import NoteItem from '../NoteItem/NoteItem';

import Link from 'next/link';
import css from './NoteList.module.css';
import type { Note } from '@/types/note';
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { KEY } from '@/app/notes/page';
import { deleteNote } from '@/lib/api';

interface NoteListProps {
  notes: Note[];
}

function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (id: Note['id']) => deleteNote(id),
    onSuccess: (id) => {
      console.log('Deleted note:', id);
      queryClient.invalidateQueries({ queryKey: [KEY] });
    },
  });

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <Link className={css.link} href={`/notes/${note.id}`}>
              View details
            </Link>
            <button
              disabled={isPending}
              onClick={() => mutate(note.id)}
              className={css.button}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default NoteList;
