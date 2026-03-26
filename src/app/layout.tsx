import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ARC 1 Admin',
  description: 'ARC 1 Configuration Authority — Developer Only',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
