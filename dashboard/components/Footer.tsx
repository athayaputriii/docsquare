import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import AnimatedContainer from './AnimatedContainer';
import CirclePattern from './CirclePattern';
import Logo from './Logo';

type FooterProps = {
    image?: string;
    transparent?: boolean;
    noContainer?: boolean;
};

const Footer: React.FC<React.HTMLAttributes<HTMLElement> & FooterProps> = ({ className, image, transparent = false, noContainer, children, ...props }) => {
    return (
        <AnimatedContainer>
            <footer className={`${noContainer ? '' : 'container'}`} {...props}>
                <div className={cn('w-full px-5 pt-5 lg:pt-[5.5rem] pb-10 rounded-3xl lg:rounded-4xl overflow-hidden relative', image || transparent ? 'shadow-none' : 'bg-main-gradient shadow-black-card', className)}>
                    {children}
                    {image && !transparent ? (
                        <>
                            <div className="absolute -z-1 inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.56)_0%,rgba(0,0,0,0.56)_49%,rgba(0,0,0,0.00)_100%)]" />
                            <Image className="object-cover -z-2" fill sizes="auto" src={image} alt="Footer Image" />
                        </>
                    ) : !transparent ? (
                        <CirclePattern className="absolute -bottom-12 opacity-50 translate-y-1/2 w-[50rem] lg:w-[80rem] -translate-x-1/2 left-1/2" />
                    ) : null}
                    <div className="max-w-[64rem] mx-auto flex lg:flex-row flex-col">
                        <div className="flex-1 flex flex-col justify-between gap-4 py-4 lg:px-0 px-4">
                            <Link href={''}>
                                <Logo />
                            </Link>
                            <div className="hidden lg:flex items-center gap-2">
                                {socials.map((item, index) => (
                                    <Link key={index} href={item.link} className="h-8 px-4 flex items-center justify-center rounded-full backdrop-blur-sm text-surface-0 border border-white/12 bg-white/4 hover:bg-white/12 transition-all">
                                        <i className={`${item.icon} text-sm`}></i>
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-wrap items-start justify-between gap-x-28 gap-y-7">
                            {footerNavsData.map((data, index) => (
                                <div key={index} className="p-2 flex flex-col gap-2">
                                    <div className="px-3 py-2 text-surface-0 text-xl font-medium">{data.title}</div>
                                    <div className="flex flex-col gap-2">
                                        {data.items.map((item, j) => (
                                            <Link key={j} href={item.to} className="px-3 py-2 w-fit text-white/72 hover:text-white hover:bg-white/10 rounded-full transition-all">
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="lg:hidden flex items-center justify-center gap-2 mt-52">
                        {socials.map((item, index) => (
                            <Link key={index} href={item.link} className="h-8 px-4 flex items-center justify-center rounded-full backdrop-blur-sm text-surface-0 border border-white/12 bg-white/4 hover:bg-white/12 transition-all">
                                <i className={`${item.icon} text-sm`}></i>
                            </Link>
                        ))}
                    </div>
                    <div className="w-full lg:w-[calc(100%-5rem)] mt-8 lg:mt-32 pt-10 flex items-center justify-center text-surface-0 border-t border-dashed border-white/10">© {new Date().getFullYear()} PrimeTek</div>
                </div>
            </footer>
        </AnimatedContainer>
    );
};

export default Footer;

const socials = [
    {
        icon: 'pi pi-youtube',
        link: ''
    },
    {
        icon: 'pi pi-twitter',
        link: ''
    },
    {
        icon: 'pi pi-discord',
        link: ''
    }
];

const footerNavsData = [
    {
        title: 'Landings',
        items: [
            {
                label: 'Travel',
                to: '/pages/travel'
            },
            {
                label: 'SaaS',
                to: '/pages/saas'
            },
            {
                label: 'Startup',
                to: '/pages/startup'
            },
            {
                label: 'Enterprise',
                to: '/pages/enterprise'
            },
            {
                label: 'E-Learning',
                to: '/pages/e-learning'
            },
            {
                label: 'Real Estate',
                to: '/pages/real-estate'
            },
            {
                label: 'Logistics',
                to: '/pages/logistic'
            },
            {
                label: 'Agency',
                to: '/pages/agency'
            }
        ]
    },
    {
        title: 'Secondary Pages',
        items: [
            {
                label: 'About',
                to: '/second-pages/about'
            },
            {
                label: 'Pricing',
                to: '/second-pages/pricing'
            },
            {
                label: 'Blog',
                to: '/second-pages/blog'
            },
            {
                label: 'Blog Detail',
                to: '/second-pages/blog/detail'
            },
            {
                label: 'Contact',
                to: '/second-pages/contact'
            }
        ]
    },
    {
        title: 'Account Pages',
        items: [
            {
                label: 'Sign Up',
                to: '/second-pages/signup'
            },
            {
                label: 'Sign In',
                to: '/second-pages/signin'
            },
            {
                label: 'Error',
                to: '/second-pages/404'
            },
            {
                label: 'Password Reset',
                to: '/second-pages/reset-password'
            },
            {
                label: 'Account General',
                to: '/second-pages/account'
            }
        ]
    }
];
