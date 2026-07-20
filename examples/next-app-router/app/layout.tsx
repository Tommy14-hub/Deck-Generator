import '@ultraviolet/fonts/fonts.css'
import '@ultraviolet/ui/styles'
import '@ultraviolet/themes/global'
import './globals.css'
import { ThemeRegistry } from '@ultraviolet/nextjs'
import { consoleLightTheme, generateObjectStyleFromTheme } from '@ultraviolet/themes'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  description: 'Generate client proposals and internal QBR presentations as downloadable PowerPoint decks.',
  title: 'Scaleway Deck Generator',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link
          as="font"
          crossOrigin="anonymous"
          href="https://assets.scaleway.com/fonts/inter/Inter-Variable.woff2"
          rel="preload"
          type="font/woff2"
        />
        <link
          as="font"
          crossOrigin="anonymous"
          href="https://assets.scaleway.com/fonts/space-grotesk/SpaceGrotesk-Variable.woff2"
          rel="preload"
          type="font/woff2"
        />
        <style id="uv-current-theme">{generateObjectStyleFromTheme(consoleLightTheme)}</style>
      </head>
      <body>
        <ThemeRegistry theme={consoleLightTheme}>{children}</ThemeRegistry>
      </body>
    </html>
  )
}
