import { Toaster } from '@/components/ui/toaster';
import Providers from './providers';

import { jetBrainsMono } from '../components/fonts/fonts';
import './globals.css';

export const metadata = {
  title: 'Панель управление компании | Auto School App',
};

export default function RootLayout({ children, session }) {
  return (
    <html lang="ru">
      <body className={`${jetBrainsMono.className} antialiased`}>
        <Providers session={session}>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
