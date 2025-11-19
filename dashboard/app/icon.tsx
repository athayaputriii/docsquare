import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <svg viewBox="0 0 32 32" aria-hidden="true" role="img">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="8" fill="url(#grad)" />
        <path
          d="M10 16h12M16 10v12"
          stroke="#0f172a"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    size,
  );
}
