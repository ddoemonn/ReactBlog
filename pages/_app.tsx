import type { AppProps } from 'next/app';

import { ThemeProvider } from '@/components/theme-provider';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
