import AnimatedContainer from '@/components/AnimatedContainer';
import TakeNoteFadeIcon from '@/components/icons/take-note-fade.svg';
import Image from 'next/image';
const SaasTrends = () => {
    return (
        <div className="container mt-24 lg:mt-64">
            <div className="icon-box">
                <TakeNoteFadeIcon />
            </div>
            <h1 className="text-3xl lg:text-5xl text-surface-950 dark:text-surface-0 font-semibold max-w-sm lg:max-w-xl text-center mx-auto mt-10">Discover Expert Insights and Industry Trends</h1>
            <p className="mt-6 mx-auto max-w-sm text-center text-lg lg:text-xl text-surface-500 dark:text-white/64">Discover expert tips, industry news, and valuable insights on our blog.</p>
            <div className="max-w-[28rem] md:max-w-[68rem] mx-auto w-full mt-16 flex items-center md:flex-row flex-col gap-6 lg:gap-7">
                {saasTrendsData.map((item, index) => (
                    <AnimatedContainer delay={index * 400} key={index} className="md:flex-1 w-full relative rounded-3xl lg:rounded-4xl overflow-hidden shadow-black-card h-[30rem] lg:h-[38rem]">
                        <div className="absolute inset-0 -z-1 bg-[linear-gradient(0deg,rgba(0,0,0,0.28)_0%,rgba(0,0,0,0.28)_100%)]"></div>
                        <Image className="object-cover -z-2" fill sizes="auto" src={item.image} alt="Saas Trends Image" />
                        <div className="absolute inset-x-6 lg:inset-x-8 bottom-6 lg:bottom-8">
                            <h5 className="title text-lg lg:text-2xl font-semibold">{item.title}</h5>
                            <p className="text-sm lg:text-lg text-white/72 mt-3 lg:mt-4">{item.description}</p>
                        </div>
                    </AnimatedContainer>
                ))}
            </div>
        </div>
    );
};

export default SaasTrends;

const saasTrendsData = [
    {
        title: 'Explore Our Latest Blog Posts',
        description: 'Stay informed with the newest trends, tips, and insights from industry experts.',
        image: '/pages/saas/trends-1.jpg'
    },
    {
        title: 'Get Insights from Industry Leaders',
        description: 'Dive into our blog for expert advice, news, and strategies to enhance your business.',
        image: '/pages/saas/trends-2.jpg'
    }
];
