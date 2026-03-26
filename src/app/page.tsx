import { redirect } from 'next/navigation';

// Root page — always redirect to the admin dashboard
export default function RootPage() {
  redirect('/admin-v3');
}
