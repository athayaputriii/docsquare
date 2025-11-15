import React from 'react';
import MagicBoxFadeIcon from '@/components/icons/magic-box-fade.svg';
import ServerBoxIcon from '@/components/icons/server-box.svg';
import CloudBoxIcon from '@/components/icons/cloud-box.svg';
import BrainBoxIcon from '@/components/icons/brain-box.svg';
import CryptoBoxIcon from '@/components/icons/crypto-box.svg';
import LifeBodyBoxIcon from '@/components/icons/life-body-box.svg';
import ServerCloudBoxIcon from '@/components/icons/server-cloud-box.svg';
import AnimatedContainer from '@/components/AnimatedContainer';

const Features = () => {
    return (
        <div className={`container lg:mt-40 mt-24`}>
            <div className="icon-box">
                <MagicBoxFadeIcon />
            </div>
            <h1 className="text-3xl lg:text-5xl text-surface-950 dark:text-surface-0 font-semibold max-w-xs lg:max-w-lg text-center mx-auto mt-10">Simplify Your Work with Our Standout Features</h1>
            <p className="mt-6 mx-auto max-w-md text-center text-lg lg:text-xl text-surface-500 dark:text-white/64">AI-Powered Automation for Clinicians. Effortless patient data capture and reporting via a simple chat.</p>
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {FeaturesData.map((item, index) => (
                    <AnimatedContainer key={index} delay={index * 200} className={`p-8 border-0 dark:border border-white/12 shadow-stroke dark:shadow-none rounded-4xl`}>
                        <div className="icon-box ml-0">
                            <item.icon />
                        </div>
                        <h5 className="text-2xl text-surface-950 dark:text-surface-0 font-semibold mt-10">{item.title}</h5>
                        <p className="mt-6 text-lg text-surface-500">{item.description}</p>
                    </AnimatedContainer>
                ))}
            </div>
        </div>
    );
};

export default Features;

const FeaturesData = [
    {
        icon: ServerBoxIcon,
        title: 'WhatsApp-Based Medical Workflow',
        description: 'Clinicians interact simply via WhatsApp chat, making adoption feel seamless and familiar.'
    },
    {
        icon: CloudBoxIcon,
        title: 'Automated Patient Record Creation',
        description: 'The bot records and organizes clinical dictations in a secure, structured workflow.'
    },
    {
        icon: BrainBoxIcon,
        title: 'Voice Dictation to Structured Reports',
        description: 'Clinicians send audio memos, automatically transcribed and converted into formal medical reports.'
    },
    {
        icon: CryptoBoxIcon,
        title: 'AI-Powered Transcription & Report Generation',
        description: 'Audio notes are transcribed, analyzed, and structured into professional documentation.'
    },
    {
        icon: LifeBodyBoxIcon,
        title: 'Secure Data Handling & Privacy Controls',
        description: 'Patient information and audio files are processed securely.'
    },
    {
        icon: ServerCloudBoxIcon,
        title: 'Audit Trails and Logging',
        description: 'Every action is logged, providing transparency and traceability for compliance.'
    }
];
