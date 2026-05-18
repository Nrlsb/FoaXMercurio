import './globals.css';
import type { Metadata } from 'next';
import { DM_Sans, Cormorant_Garamond } from 'next/font/google';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-sans',
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'Mercurio × Casa FOA 2026 | Una jornada para ver diferente',
  description: 'Pinturerías Mercurio y Alba te invitan a descubrir las tendencias de diseño, arquitectura y color en Casa FOA Córdoba 2026.',
  keywords: 'Casa FOA 2026, Pinturerias Mercurio, Alba AkzoNobel, Diseño de Interiores, Arquitectura Córdoba, Colores de Tendencia',
  authors: [{ name: 'Pinturerías Mercurio × Alba' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${dmSans.variable} ${cormorantGaramond.variable} scroll-smooth`}>
      <head>
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎨</text></svg>" />
      </head>
      <body className="font-sans font-light bg-mercu-dark text-mercu-cream overflow-x-hidden antialiased">
        {children}
      </body>
    </html>
  );
}
