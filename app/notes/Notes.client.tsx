'use client';

import css from '../page.module.css';
import { KEY } from './page';
import { getNotes } from '@/lib/api';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
// import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import NoteList from '@/components/NoteList/NoteList';

function NotesClient() {
  //   const { search = '', page: currentPage } = useParams<{
  //     search: string;
  //     page: string;
  //   }>();

  const [page, setPage] = useState(1);
  const [searchNote, setSearchNote] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSearch = useDebouncedCallback((note: string) => {
    setSearchNote(note);
    setPage(1);
  }, 1000);

  const { data, isSuccess, error, isLoading } = useQuery({
    queryKey: [KEY],
    queryFn: () => getNotes(),
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading, please wait...</p>;

  if (error || !data) return <p>Something went wrong.</p>;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        {<SearchBox onChange={handleSearch} value={searchNote} />}
        {isSuccess && data.totalPages > 1 && (
          <Pagination
            pages={data.totalPages}
            handleChangePage={(page) => setPage(page)}
            currentPage={page}
          />
        )}
        <button onClick={openModal} className={css.button}>
          Create note +
        </button>
      </header>

      {isSuccess && <NoteList notes={data.notes} />}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm closeModal={closeModal} />
        </Modal>
      )}
    </div>
  );
}

export default NotesClient;
