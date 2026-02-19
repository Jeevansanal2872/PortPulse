import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Layout from '../components/Layout';
import TruckAnimation from '../components/TruckAnimation';
import Footer from '../components/Footer';
import { ArrowRight, Clock, ShieldAlert, BarChart3, CloudRain } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
    const heroRef = useRef(null);
    const featuresRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline();
        // Animate children directly to avoid hiding the container
        tl.from(".hero-text", { opacity: 0, y: 30, stagger: 0.2, duration: 1, ease: 'power3.out', clearProps: 'all' });

        // Animate feature cards individually as they enter viewport
        gsap.utils.toArray('.feature-card').forEach((card) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            });
        });
    }, []);

    return (
        <Layout>
            <div className="min-h-screen flex flex-col">

                {/* Hero Section */}
                <section ref={heroRef} className="container mx-auto px-6 min-h-[90vh] flex flex-col justify-center items-start pt-20 relative">
                    <div className="absolute top-20 right-10 opacity-20 hidden md:block">
                        {/* Decorative Background Element */}
                        <div className="w-64 h-64 rounded-full bg-blue-400 blur-3xl"></div>
                    </div>

                    <h1 className="hero-text text-6xl md:text-8xl font-black text-gray-800 mb-6 tracking-tighter leading-none">
                        DEFY <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">GRAVITY.</span>
                    </h1>
                    <p className="hero-text text-xl md:text-3xl text-gray-600 max-w-2xl mb-10 font-light">
                        The World's First <span className="font-semibold text-blue-600">Anti-Gravity</span> Logistics Engine.
                        Escape the weight of demurrage and congestion.
                    </p>

                    <div className="hero-text flex items-center gap-4">
                        <Link to="/travel" className="neumorphic-btn inline-flex items-center gap-2 px-8 py-4 text-lg font-bold text-blue-600 hover:text-blue-700 transition-all hover:scale-105">
                            Launch Mission <ArrowRight className="w-5 h-5" />
                        </Link>
                        {/* Small Intro Truck */}
                        <div className="w-16 h-10 opacity-80 animate-bounce">
                            <svg viewBox="0 0 100 60" className="w-full h-full drop-shadow-md">
                                <path d="M70,40 L70,25 L75,20 L85,20 L90,25 L90,40 Z" fill="#FDE68A" stroke="#F59E0B" strokeWidth="2" />
                                <rect x="5" y="15" width="60" height="25" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2" />
                                <circle cx="20" cy="45" r="6" fill="#333" />
                                <circle cx="80" cy="45" r="6" fill="#333" />
                            </svg>
                        </div>
                    </div>
                </section>

                {/* The Problem Section */}
                <section className="py-20 bg-gray-100">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">The Gravity of Logistics</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="p-8 bg-white rounded-2xl shadow-xl">
                                <Clock className="w-12 h-12 text-red-500 mb-4" />
                                <h3 className="text-xl font-bold mb-2">The Penalty Clock</h3>
                                <p className="text-gray-600">Every second at a congested gate costs money. Demurrage fees accumulate like gravity, pulling profits down.</p>
                            </div>
                            <div className="p-8 bg-white rounded-2xl shadow-xl">
                                <CloudRain className="w-12 h-12 text-blue-500 mb-4" />
                                <h3 className="text-xl font-bold mb-2">Unpredictable Monsoon</h3>
                                <p className="text-gray-600">Weather disrupts schedules. Without real-time sync, drivers are driving blind into storms and delays.</p>
                            </div>
                            <div className="p-8 bg-white rounded-2xl shadow-xl">
                                <ShieldAlert className="w-12 h-12 text-orange-500 mb-4" />
                                <h3 className="text-xl font-bold mb-2">Blind Spots</h3>
                                <p className="text-gray-600">Lack of peer visibility means getting stuck in bottlenecks that could have been avoided.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Truck Animation Scroll Section */}
                <section className="py-32 overflow-hidden relative bg-[#e0e5ec]">
                    <div className="absolute top-10 left-0 w-full text-center">
                        <p className="text-sm font-bold tracking-widest text-gray-400 uppercase">Live Route Simulation</p>
                    </div>
                    <TruckAnimation />
                    <div className="container mx-auto px-6 text-center mt-10">
                        <p className="text-2xl font-light text-gray-600 italic">"Moving lighter, faster, and smarter."</p>
                    </div>
                </section>

                {/* The Solution (Anti-Gravity Features) */}
                <section ref={featuresRef} className="py-24 container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-center text-gray-800 mb-20">Enter <span className="text-blue-600">Anti-Gravity</span> Mode</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
                        <div className="feature-card order-2 md:order-1">
                            <h3 className="text-3xl font-bold mb-4 text-gray-800">AI-Driven Prediction Engine</h3>
                            <div className="h-1 w-20 bg-blue-500 mb-6 rounded-full"></div>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Our XGBoost model analyzes traffic density and historical patterns to predict port-specific wait times with 80%+ accuracy. It sees what Google Maps misses.
                            </p>
                        </div>
                        <div className="feature-card order-1 md:order-2 neumorphic p-8 flex justify-center items-center h-64">
                            <BarChart3 className="w-32 h-32 text-blue-400 opacity-80" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
                        <div className="feature-card neumorphic p-8 flex justify-center items-center h-64 order-2 md:order-1">
                            <div className="text-center">
                                <p className="text-6xl font-mono font-bold text-red-500 mb-2">-$0.00</p>
                                <p className="text-gray-500 font-bold uppercase">Zero Demurrage Risk</p>
                            </div>
                        </div>
                        <div className="feature-card order-1 md:order-2">
                            <h3 className="text-3xl font-bold mb-4 text-gray-800">Live Financial Risk HUD</h3>
                            <div className="h-1 w-20 bg-red-500 mb-6 rounded-full"></div>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                See the real cost of delay. Our Penalty Clock and Risk HUD keep you ahead of the "Free-Time" window expiry, saving thousands in fines.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
                        <div className="feature-card order-2 md:order-1">
                            <h3 className="text-3xl font-bold mb-4 text-gray-800">Monsoon Recalibration</h3>
                            <div className="h-1 w-20 bg-teal-500 mb-6 rounded-full"></div>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Don't let rain wash away your profits. We sync with OpenWeatherMap to automatically add "Weather Buffers" to your ETA when heavy rain is detected.
                            </p>
                        </div>
                        <div className="feature-card order-1 md:order-2 neumorphic p-8 flex justify-center items-center h-64 bg-teal-50">
                            <CloudRain className="w-32 h-32 text-teal-400 opacity-80" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="feature-card neumorphic p-8 flex justify-center items-center h-64 bg-orange-50 order-2 md:order-1">
                            <ShieldAlert className="w-32 h-32 text-orange-400 opacity-80" />
                        </div>
                        <div className="feature-card order-1 md:order-2">
                            <h3 className="text-3xl font-bold mb-4 text-gray-800">Smart-Divert System</h3>
                            <div className="h-1 w-20 bg-orange-500 mb-6 rounded-full"></div>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Gate A congested? We know before you do. The AI suggests optimized reroutes to "Gate B" to avoid bottlenecks and penalties.
                            </p>
                        </div>
                    </div>

                </section>


                <Footer />
            </div>
        </Layout >
    );
};

export default Home;
