import Providers from './providers';
import Navbar from './components/layout/Navbar';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });
const body_styles = {
  background: "#f4f1de",
  color: "#574a38"
}

export const metadata = {
  title: 'Notes App',
  description: 'A simple application to manage your notes',
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} `} style={body_styles}>
        <Providers>
          <Navbar />
          <main>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}