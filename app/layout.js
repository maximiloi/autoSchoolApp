import { Toaster } from '@/components/ui/toaster';
import Providers from './providers';

import { jetBrainsMono } from '../components/fonts/fonts';
import './globals.css';

export const metadata = {
  title: 'Панель управление компании | Auto School App',
};

export default function RootLayout({ children, session }) {
  return (
    <Providers session={session}>
      <html lang="ru">
        <body className={`${jetBrainsMono.className} antialiased`}>
          {children}
          <Toaster />
        </body>
      </html>
    </Providers>
  );
}
