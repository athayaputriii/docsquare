import AnimatedContainer from '@/components/AnimatedContainer';
import Image from 'next/image';
import React from 'react';

const SaasStreamline = () => {
    return (
        <div className="container max-w-[72rem] flex flex-col gap-24 lg:gap-48 mt-32 lg:mt-64">
            <div className="flex items-center lg:flex-row flex-col-reverse gap-10 lg:gap-28">
                <div className="max-w-[29.3rem]">
                    <div className="badge">Maximize</div>
                    <h2 className="mt-4 text-3xl lg:text-5xl font-semibold text-surface-950 dark:text-surface-0">Save on Your Credit Card Expenses</h2>
                    <p className="mt-6 text-lg text-surface-500">Reduce your credit card costs and optimize your financial management with our innovative tools designed to help you save more.</p>
                    <ul className="mt-8 flex flex-col gap-3.5">
                        <li className="flex items-center gap-3 text-surface-500">
                            <i className="pi pi-check-circle"></i>
                            <p className="text-base lg:text-lg">Automated Spending Alerts</p>
                        </li>
                        <li className="flex items-center gap-3 text-surface-500">
                            <i className="pi pi-check-circle"></i>
                            <p className="text-base lg:text-lg">Customized Budget Planning</p>
                        </li>
                        <li className="flex items-center gap-3 text-surface-500">
                            <i className="pi pi-check-circle"></i>
                            <p className="text-base lg:text-lg">Expense Categorization</p>
                        </li>
                    </ul>
                    <button className="button-gradient mt-8">Get Started</button>
                </div>
                <AnimatedContainer visibleClass="!slide-in-from-top-0 slide-in-from-right-32" className="w-full max-w-[29.3rem] lg:max-w-none lg:flex-1 h-[23rem] lg:h-[31rem] shadow-blue-card bg-main-gradient rounded-3xl lg:rounded-4xl relative">
                    <Image className="w-[90%] h-auto absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2" sizes="100vw" width={0} height={0} src={'/pages/saas/streamline-img-1.png'} alt="Saas Streamline Image" />
                </AnimatedContainer>
            </div>
            <div className="flex flex-col-reverse lg:flex-row-reverse items-center gap-10 lg:gap-14">
                <div className="max-w-[29.3rem] lg:max-w-[33rem]">
                    <div className="badge">Maximize</div>
                    <h2 className="mt-4 text-3xl lg:text-5xl font-semibold text-surface-950 dark:text-surface-0">Streamline Your Banking Experience Effortlessly</h2>
                    <p className="mt-6 text-lg text-surface-500">Simplify your daily financial operations and boost your efficiency with our cutting-edge tools designed to make your banking seamless.</p>
                    <ul className="mt-8 flex flex-col gap-3.5">
                        <li className="flex items-center gap-3 text-surface-500">
                            <i className="pi pi-check-circle"></i>
                            <p className="text-base lg:text-lg">Instant Fund Transfers</p>
                        </li>
                        <li className="flex items-center gap-3 text-surface-500">
                            <i className="pi pi-check-circle"></i>
                            <p className="text-base lg:text-lg">Live Balance Updates</p>
                        </li>
                        <li className="flex items-center gap-3 text-surface-500">
                            <i className="pi pi-check-circle"></i>
                            <p className="text-base lg:text-lg">Detailed Spending Reports</p>
                        </li>
                    </ul>
                    <button className="button-gradient mt-8">Get Started</button>
                </div>
                <AnimatedContainer visibleClass="!slide-in-from-top-0 slide-in-from-left-32" className="w-full max-w-[29.3rem] lg:max-w-none lg:flex-1 h-[23rem] lg:h-[31rem] shadow-blue-card bg-main-gradient rounded-3xl lg:rounded-4xl relative">
                    <Image className="w-full h-auto absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2" sizes="100vw" width={0} height={0} src={'/pages/saas/streamline-img-2.png'} alt="Saas Streamline Image" />
                </AnimatedContainer>
            </div>
        </div>
    );
};

export default SaasStreamline;
