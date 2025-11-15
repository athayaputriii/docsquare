'use client';

import AnimatedContainer from '@/components/AnimatedContainer';
import CirclePattern from '@/components/CirclePattern';
import FloatingCustomers from '@/components/FloatingCustomers';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import React from 'react';

const Hero = () => {
    return (
        <AnimatedContainer visibleClass="!slide-in-from-top-0" className='bg-main-gradient shadow-black-card overflow-hidden'>
            <div className="container">
                <div className={`relative h-[58rem] lg:h-[52rem]`}>
                    <Navbar />
                    <div className="px-6 mt-10 lg:mt-24 lg:ml-28 relative z-10">
                        <h1 className="title text-4xl lg:text-left text-center lg:text-6xl max-w-lg mx-auto lg:mx-0 !leading-tight">Transform Your WhatsApp Into AI Medical Scribe</h1>
                        <p className="mt-6 text-base lg:text-xl text-white/64 max-w-md mx-auto lg:mx-0 lg:text-left text-center">Instantly generate structured clinical reports from audio notes. No extra apps, no hassle.</p>
                        <div className="flex lg:justify-start justify-center max-w-lg mx-auto lg:mx-0 items-center mt-8 gap-3">
                            <button className="button-regular lg:min-w-36">Get Started</button>
                            <button className="button-outlined lg:min-w-36">See How It Works</button>
                        </div>
                    </div>
                    <div className="absolute bottom-6 lg:bottom-20 inset-x-0">
                        <FloatingCustomers />
                    </div>
                    <div className="top-[40rem] lg:top-[30rem] -left-[45rem] lg:-left-[60rem] absolute ">
                        <CirclePattern className="w-[60rem] lg:w-[80rem]" />
                    </div>
                    <div className="top-[40rem] lg:top-[32rem] -right-[45rem] lg:-right-[60rem] absolute ">
                        <CirclePattern className="w-[60rem] lg:w-[80rem]" />
                    </div>
                    <Image
                        className="w-[359px] mt-6 lg:mt-0 mx-auto lg:mx-0 h-auto lg:absolute top-[145px] right-[132px] rounded-2xl shadow-[0px_2px_5px_0px_rgba(255,255,255,0.06)_inset,0px_12px_20px_0px_rgba(0,0,0,0.06)]"
                        width={359}
                        height={600}
                        sizes="(max-width: 1024px) 100vw, 359px"
                        src={'/docsquare-mockup-1.png'}
                        alt="Hero Image"
                    />

                    {/* <div className="w-[300px] -mt-16 lg:mt-0 mx-auto lg:mx-0 h-auto relative lg:absolute lg:top-[406px] lg:right-[243px]">
                        <div className="w-full h-[102.44px] bg-white/12 backdrop-blur-[32px] absolute top-0 left-0 rounded-[20px]"></div>
                        <Image
                            className="w-full max-w-none h-auto absolute top-0 left-0 rounded-2xl shadow-[0px_2px_5px_0px_rgba(255,255,255,0.06)_inset,0px_12px_20px_0px_rgba(0,0,0,0.06)]"
                            width={0}
                            height={0}
                            sizes="100vw"
                            src={'/pages/enterprise/hero-img-2.png'}
                            alt="Hero Image"
                        />
                    </div> */}
                </div>
            </div>
        </AnimatedContainer>
    );
};

export default Hero;
