import type { Perspective } from './types';

export const images = [
  './img/img1.webp',
  './img/img2.webp',
  './img/img3.webp',
  './img/img4.webp',
  './img/img5.webp',
  './img/img6.webp',
  './img/img7.webp',
  './img/img8.webp',
  './img/img9.webp',
  './img/img10.webp',
  './img/img11.webp',
  './img/img12.webp',
];

export const perspectives: Perspective[] = [
  {
    title: 'SS25',
    description: 'Earthwork',
    position: 'top',
  },
  {
    title: 'Made to last',
    description: 'Hover. Slow. Discover.',
    position: 'center',
  },
  {
    title: 'Cloth & time',
    description: '12 pieces. One collection.',
    position: 'center',
  },
  {
    title: 'Click to enter',
    position: 'bottom',
  },
];

export const cylinderConfig = {
  radius: 2.5,
  height: 2,
  radialSegments: 64,
  heightSegments: 1,
};

export const particleConfig = {
  numParticles: 12,
  particleRadius: 3.3,
  segments: 20,
  angleSpan: 0.3,
};

export const imageConfig = {
  width: 1024,
  height: 1024,
};
