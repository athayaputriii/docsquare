import AnimatedContainer from '@/components/AnimatedContainer';
import Image from 'next/image';
import React from 'react';

const Solutions = () => {
    return (
        <AnimatedContainer className={`container mt-24 lg:mt-64  `}>
            <div className="bg-main-gradient relative rounded-3xl lg:rounded-4xl shadow-black-card px-4 py-14 lg:p-20 flex flex-col gap-18">
                <div className="flex lg:flex-row flex-col items-center justify-between gap-16 lg:gap-0">
                    <div className="flex-1">
                        <Image className="w-[295px] h-auto mx-auto" width={0} height={0} sizes="100vw" src={'/pages/enterprise/solutions-img-1.png'} alt="Solution Image" />
                    </div>
                    <div className="">
                        {/* <span className="badge dark:bg-surface-0 dark:text-surface-950">Business</span> */}
                        <h2 className="text-3xl lg:text-5xl font-semibold title max-w-lg mt-4 !leading-tight">Spend Less Time On Paperwork</h2>
                        <p className="text-lg text-white/64 mt-6 max-w-md">Automate documentation with AI-powered transcription and structured report generation.</p>
                        <ul className="flex flex-col gap-3.5 mt-8">
                            <li className="inline-flex items-center gap-3 text-white/64">
                                <i className="pi pi-check-circle"></i>
                                <span className="text-lg ">Automated Transcription</span>
                            </li>
                            <li className="inline-flex items-center gap-3 text-white/64">
                                <i className="pi pi-check-circle"></i>
                                <span className="text-lg ">Instant Report Generation</span>
                            </li>
                            <li className="inline-flex items-center gap-3 text-white/64">
                                <i className="pi pi-check-circle"></i>
                                <span className="text-lg ">Reduce Admin Time</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-dashed border-white/16 w-full h-px"></div>
                <div className="lg:pl-4 flex lg:flex-row flex-col-reverse items-center justify-between gap-16 lg:gap-0">
                    <div>
                        {/* <span className="badge dark:bg-surface-0 dark:text-surface-950">Business</span> */}
                        <h2 className="text-3xl lg:text-5xl font-semibold title max-w-lg mt-4 !leading-tight">Seamlessly Integrate Into Your Daily Routine</h2>
                        <p className="text-lg text-white/64 mt-6 max-w-md">Leverage familiar WhatsApp messaging to capture notes and generate reports.</p>
                        <ul className="flex flex-col gap-3.5 mt-8">
                            <li className="inline-flex items-center gap-3 text-white/64">
                                <i className="pi pi-check-circle"></i>
                                <span className="text-lg ">WhatsApp-Based Workflow</span>
                            </li>
                            <li className="inline-flex items-center gap-3 text-white/64">
                                <i className="pi pi-check-circle"></i>
                                <span className="text-lg ">Easy Data Entry</span>
                            </li>
                            <li className="inline-flex items-center gap-3 text-white/64">
                                <i className="pi pi-check-circle"></i>
                                <span className="text-lg ">Fast Report Delivery</span>
                            </li>
                        </ul>
                    </div>
                    <div className="flex-1">
                        <Image className="w-[440px] h-auto mx-auto" width={0} height={0} sizes="100vw" src={'/pages/enterprise/solutions-img-2.png'} alt="Solution Image" />
                    </div>
                </div>
            </div>
        </AnimatedContainer>
    );
};

export default Solutions;
