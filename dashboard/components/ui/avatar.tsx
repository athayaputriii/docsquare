import Image from 'next/image';
import React from 'react';

type AvatarProps = {
    image: string;
};

const Avatar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & AvatarProps>(({ className, image, ...props }, ref) => (
    <div ref={ref} className='relative rounded-full w-18 h-18 overflow-hidden'>
        <Image className="object-cover" fill sizes="auto" src={image} alt="Avatar Image" />
    </div>
));

Avatar.displayName = 'Avatar';
export { Avatar };
