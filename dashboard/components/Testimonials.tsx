import TestimonialsFades from '@/components/TestimonialsFades';
import React from 'react';
import BubbleMessageIcon from '@/components/icons/bubble-message.svg';
import AnimatedContainer from '@/components/AnimatedContainer';

const Testimonials = () => {
    return (
        <AnimatedContainer className="container mt-24 lg:mt-64">
            <div className="icon-box">
                <BubbleMessageIcon />
            </div>
            <h1 className="text-3xl lg:text-5xl text-surface-950 dark:text-surface-0 font-semibold max-w-xs lg:max-w-sm text-center mx-auto mt-10">What Our Clients Are Saying</h1>
            <p className="mt-6 mx-auto max-w-lg text-center text-lg lg:text-xl text-surface-500 dark:text-white/64">Hear from our satisfied clients about how our solutions have transformed their businesses and driven success.</p>
            <TestimonialsFades className="mt-8 lg:mt-16" />
        </AnimatedContainer>
    );
};

export default Testimonials;
