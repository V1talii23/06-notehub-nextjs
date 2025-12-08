import {
  dehydrate,
  QueryClient,
  HydrationBoundary,
} from '@tanstack/react-query';
import { getNotes } from '@/lib/api';
import NotesClient from './Notes.client';

export const KEY = 'notes';

type NotesProps = { params: Promise<{ search: string; page: string }> };

async function Notes({ params }: NotesProps) {
  const { search, page } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [KEY],
    queryFn: () => getNotes(search, +page),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient />
    </HydrationBoundary>
  );
}

export default Notes;
