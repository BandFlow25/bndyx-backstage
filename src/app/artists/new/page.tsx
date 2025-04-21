import { redirect } from 'next/navigation';

export default function NewArtistRedirect() {
  redirect('/artists/create');
  return null;
}
