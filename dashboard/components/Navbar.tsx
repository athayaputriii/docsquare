'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import React, { useState } from 'react';

const Navbar: React.FC<React.HTMLAttributes<HTMLElement>> = ({ className, ...props }) => {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    return (
        <nav className={'flex items-center relative z-[99999] justify-between py-6 w-[calc(100%-3rem)] max-h-[75px] mx-auto border-b border-white/10 border-dashed' + (className ? ` ${className}` : '')} {...props}>
            <Link href="/">
                <Logo />
            </Link>
            <ul className="hidden lg:flex items-center gap-3">
                <li>
                    <Link href="/about" className={`inline-flex items-center gap-2 rounded-full py-1 pr-3 pl-3 transition-all font-medium ${pathname === '/about' ? 'text-surface-950 bg-surface-200' : 'text-surface-500 hover:text-surface-950 hover:bg-surface-200'}`}>
                        About
                    </Link>
                </li>
                <li>
                    <Link href="/pricing" className={`inline-flex items-center gap-2 rounded-full py-1 pr-3 pl-3 transition-all font-medium ${pathname === '/pricing' ? 'text-surface-950 bg-surface-200' : 'text-surface-500 hover:text-surface-950 hover:bg-surface-200'}`}>
                        Pricing
                    </Link>
                </li>
                <li>
                    <Link href="/contact" className={`inline-flex items-center gap-2 rounded-full py-1 pr-3 pl-3 transition-all font-medium ${pathname === '/contact' ? 'text-surface-950 bg-surface-200' : 'text-surface-500 hover:text-surface-950 hover:bg-surface-200'}`}>
                        Contact
                    </Link>
                </li>
                <li>
                    <Link href="/dashboard" className={`inline-flex items-center gap-2 rounded-full py-1 pr-3 pl-3 transition-all font-medium ${pathname === '/dashboard' ? 'text-surface-950 bg-surface-200' : 'text-surface-500 hover:text-surface-950 hover:bg-surface-200'}`}>
                        Dashboard
                    </Link>
                </li>
            </ul>
            <ul className="hidden lg:flex items-center">
                <li>
                    <Link href="/signup" className="button-regular">Sign Up</Link>
                </li>
            </ul>
            <div className="lg:hidden block relative">
                <button onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle menu" className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-surface-0 text-surface-950">
                    <i className="pi pi-bars"></i>
                </button>
                {mobileOpen && (
                    <div className="absolute top-[calc(100%+0.5rem)] right-0 w-60 p-2 rounded-2xl shadow-blue-card flex flex-col bg-surface-0 max-h-96 overflow-auto">
                        <div className="flex flex-col">
                            <Link href="/second-pages/about" className="py-2 px-3 rounded-lg hover:bg-surface-200 font-medium text-surface-500 hover:text-surface-950" onClick={() => setMobileOpen(false)}>
                                About
                            </Link>
                            <Link href="/second-pages/pricing" className="py-2 px-3 rounded-lg hover:bg-surface-200 font-medium text-surface-500 hover:text-surface-950" onClick={() => setMobileOpen(false)}>
                                Pricing
                            </Link>
                            <Link href="/second-pages/contact" className="py-2 px-3 rounded-lg hover:bg-surface-200 font-medium text-surface-500 hover:text-surface-950" onClick={() => setMobileOpen(false)}>
                                Contact
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
