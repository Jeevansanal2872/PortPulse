import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TruckAnimation = () => {
    const truckRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const truck = truckRef.current;

        // Animate from right to left as user scrolls
        gsap.to(truck, {
            x: () => -window.innerWidth - 300,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5,
                markers: false
            }
        });

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <div ref={containerRef} className="w-full h-48 relative overflow-hidden my-10 bg-transparent">
            <div
                ref={truckRef}
                className="absolute right-0 bottom-10 w-80 h-48"
                style={{ transform: 'translateX(200px)' }}
            >
                <svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-full filter drop-shadow-2xl">
                    {/* Artistic Sketchy Style - Irregular lines */}
                    <defs>
                        <filter id="sketchy">
                            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" />
                            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
                        </filter>
                    </defs>

                    <g stroke="#F59E0B" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'url(#sketchy)' }}>
                        {/* Cab */}
                        <path d="M210,120 L210,70 L230,50 L270,50 L290,70 L290,140 L260,140" fill="#FDE68A" fillOpacity="0.8" />
                        <path d="M210,140 L230,140" />

                        {/* Window */}
                        <path d="M225,75 L270,75 L270,100 L225,100 Z" fill="#E0F2FE" />

                        {/* Container */}
                        <path d="M10,40 L195,40 L195,140 L40,140 L40,120" fill="#FCD34D" fillOpacity="0.9" />
                        <path d="M10,40 L10,120 L40,120" />

                        {/* Wheels */}
                        <circle cx="60" cy="140" r="18" fill="#333" stroke="#111" />
                        <circle cx="100" cy="140" r="18" fill="#333" stroke="#111" />
                        <circle cx="245" cy="140" r="18" fill="#333" stroke="#111" />

                        {/* Sketchy Details */}
                        <path d="M20,60 L180,60" strokeDasharray="10,5" strokeWidth="2" />
                        <path d="M20,90 L180,90" strokeDasharray="10,5" strokeWidth="2" />
                        <path d="M220,110 L220,120" strokeWidth="2" />

                        {/* Speed Lines */}
                        <path d="M280,40 L320,40" stroke="#CBD5E1" strokeWidth="2" opacity="0.6" />
                        <path d="M10,80 L-20,80" stroke="#CBD5E1" strokeWidth="2" opacity="0.6" />
                    </g>
                </svg>
            </div>
        </div>
    );
};

export default TruckAnimation;
