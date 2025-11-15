import { HeroContainerStyleType, PrimaryColorType, SurfaceColorType } from '@/lib/types';
import { applyTheme } from '@/lib/utils';
import type { Metadata } from 'next';
import './fonts/fonts.css';
import './globals.css';

export const metadata: Metadata = {
    title: 'DocSquare | AI Medical Consultation Platform',
    description: 'Monitor WhatsApp consultations and generated reports in real time.',
    openGraph: {
        title: 'DocSquare | AI Medical Consultation Platform',
        description: 'Monitor WhatsApp consultations and generated reports in real time.',
        images: 'https://primefaces.org/cdn/primereact/images/templates/genesis/genesis-meta.jpg'
    }
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const themeProps:{
        primary:PrimaryColorType;
        surface:SurfaceColorType;
        heroContainerType:HeroContainerStyleType;
    } = {
        primary: 'blue',
        surface: 'slate',
        heroContainerType: 'wide'
    };

    const primaryVariables = applyTheme({ type: 'primary', color: themeProps.primary });
    const surfaceVariables = applyTheme({ type: 'surface', color: themeProps.surface });

    return (
        <html lang="en" style={{ ...primaryVariables, ...surfaceVariables }} suppressHydrationWarning>
            <body className={`antialiased pb-6 relative`} suppressHydrationWarning>
              {children}
            </body>
        </html>
    );
}
