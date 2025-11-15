import React from 'react';
import { Accordion, AccordionItem } from './ui/accordion';
import QuestionsCommentsIcon from '@/components/icons/questions-comments.svg';
import AnimatedContainer from './AnimatedContainer';

const FAQ: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
    return (
        <div className={'max-w-[58rem] px-4 mx-auto' + (className ? ` ${className}` : '')} {...props}>
            <div className="icon-box">
                <QuestionsCommentsIcon />
            </div>
            <h1 className="mt-10 text-center text-3xl lg:text-5xl font-semibold text-surface-950 dark:text-surface-0 leading-tight">
                Frequently <br /> Asked Questions
            </h1>
            <p className="text-xl text-center text-surface-500 dark:text-white/64 mt-6">Find quick answers to common questions about docsquare platform.</p>
            <Accordion className="mt-14">
                {faqData.map((item, index) => (
                    <AnimatedContainer key={index} delay={150 * index} visibleClass="!slide-in-from-top-20">
                        <AccordionItem {...item} />
                    </AnimatedContainer>
                ))}
            </Accordion>
        </div>
    );
};

export default FAQ;

const faqData = [
    {
        title: 'What is docsquare?',
        content: 'docsquare is an artificial intelligence (AI) powered medical scribing solution designed to assist healthcare professionals with documentation tasks, allowing them to focus more on patient care.'
    },
    {
        title: 'How does docsquare work?',
        content: 'docsquare is an artificial intelligence (AI) powered medical scribing solution designed to assist healthcare professionals with documentation tasks, allowing them to focus more on patient care.'
    },
    {
        title: 'Is patient data safe with docsquare?',
        content: 'docsquare is an artificial intelligence (AI) powered medical scribing solution designed to assist healthcare professionals with documentation tasks, allowing them to focus more on patient care.'
    },
    {
        title: 'Do you offer customer support?',
        content: 'docsquare is an artificial intelligence (AI) powered medical scribing solution designed to assist healthcare professionals with documentation tasks, allowing them to focus more on patient care.'
    }
];
