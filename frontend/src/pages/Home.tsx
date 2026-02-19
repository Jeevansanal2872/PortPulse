import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Layout from '../components/Layout';
import TruckAnimation from '../components/TruckAnimation';
import Footer from '../components/Footer';
import truckImg from '../assets/truck.png';
import { ArrowRight, Clock, ShieldAlert, Zap, BarChart3, CloudRain, Anchor, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const ctx = gsap.context(() => {
            
            // 1. HERO REVEAL
            const tl = gsap.timeline();
            tl.from(".hero-title span", { y: 100, opacity: 0, stagger: 0.1, duration: 1, ease: "power4.out" })
              .from(".hero-sub", { opacity: 0, y: 20 }, "-=0.5")
              .from(".sketch-line", { scaleX: 0, duration: 0.8, ease: "expo.out" }, "-=0.5");

            // 2. STORY SELLING TELLING (ScrollTrigger)
            // "The Chaos" Section - Elements float erratically
            gsap.to(".chaos-element", {
                y: "random(-50, 50)",
                rotation: "random(-15, 15)",
                scrollTrigger: {
                    trigger: "#chaos-section",
                    scrub: 1,
                    start: "top bottom",
                    end: "bottom top"
                }
            });

            // 3. CARD REVEALS (Paper/Sketch Effect)
            gsap.utils.toArray(".sketch-card").forEach((card: any) => {
                gsap.from(card, {
                    y: 100,
                    opacity: 0,
                    rotation: 2,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%"
                    }
                });
            });

        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <Layout>
            <div ref={containerRef} className="min-h-screen bg-[#f0f4f8] text-gray-800 overflow-hidden font-sans">

                {/* --- HERO SECTION (Reference Layout) --- */}
                <section className="relative min-h-screen bg-white flex items-center px-6 pt-20 overflow-hidden">
                    <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
                    
                    <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 h-full">
                        
                        {/* Left Content */}
                        <div className="text-left w-full pl-6 md:pl-16">
                            <div className="mb-6 inline-block">
                                <div className="px-4 py-1 border border-gray-400 rounded-full text-xs font-mono text-gray-500 uppercase tracking-widest bg-gray-50">
                                    PortPulse OS v2.1 • Operational
                                </div>
                            </div>

                            <h1 className="hero-title text-5xl md:text-7xl font-black leading-[1.0] tracking-tight mb-8 text-[#1a202c]">
                                <span className="block">ELIMINATE</span>
                                <span className="block text-black">THE WAIT.</span>
                            </h1>
                            
                            <p className="hero-sub text-lg md:text-xl text-gray-600 font-light max-w-lg mb-10 leading-relaxed">
                                The first <span className="font-bold text-blue-700">Predictive Logistics Engine</span> built to solve port congestion.
                                Slash turnaround times with AI precision.
                            </p>
                        </div>
                        {/* Right Content - Truck Image (Bottom Right Aligned) */}
                        <div className="relative w-full flex justify-end items-end h-[50vh] lg:h-auto">
                            <img 
                                src={truckImg} 
                                alt="Modern Logistics Fleet" 
                                className="hero-image object-contain object-bottom w-full max-w-[90%] translate-y-4 translate-x-12"
                            />
                        </div>

                    </div>
                </section>


                {/* --- STORY: THE PROBLEM (The Chaos) --- */}
                <section id="chaos-section" className="py-32 bg-[#e2e8f0] relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="chaos-element absolute top-10 left-10 w-64 h-64 border-4 border-red-400 rounded-full"></div>
                        <div className="chaos-element absolute bottom-20 right-20 w-96 h-96 border-2 border-gray-400 rotate-45"></div>
                        <div className="chaos-element absolute top-1/2 left-1/3 w-32 h-32 bg-gray-300 rounded-full blur-xl"></div>
                    </div>

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="max-w-xl mb-20">
                            <h2 className="text-sm font-bold text-red-600 uppercase tracking-widest mb-4">The Cost of Congestion</h2>
                            <h3 className="text-4xl md:text-5xl font-black text-gray-800 mb-6">Supply Chains are <span className="text-red-600 italic font-serif">Breaking.</span></h3>
                            <p className="text-xl text-gray-600 leading-relaxed">
                                Unpredictable wait times are bleeding revenue. From soaring demurrage fees to missed delivery slots, the lack of visibility is the industry's biggest bottleneck.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="sketch-card bg-white p-10 rounded-3xl shadow-[8px_8px_0px_#cbd5e0] border-2 border-gray-200 hover:translate-y-[-5px] transition-transform">
                                <Clock className="w-12 h-12 text-red-500 mb-6" />
                                <h4 className="text-2xl font-bold mb-4">Demurrage Accumulation</h4>
                                <p className="text-gray-500">Every hour spent waiting at the gate eats into your margin. The penalty clock never stops ticking.</p>
                            </div>
                            <div className="sketch-card bg-white p-10 rounded-3xl shadow-[8px_8px_0px_#cbd5e0] border-2 border-gray-200 hover:translate-y-[-5px] transition-transform delay-100">
                                <CloudRain className="w-12 h-12 text-blue-500 mb-6" />
                                <h4 className="text-2xl font-bold mb-4">Environmental Disruption</h4>
                                <p className="text-gray-500">Weather events create unpredictable surges. Without predictive data, your fleet is driving blind into delays.</p>
                            </div>
                            <div className="sketch-card bg-white p-10 rounded-3xl shadow-[8px_8px_0px_#cbd5e0] border-2 border-gray-200 hover:translate-y-[-5px] transition-transform delay-200">
                                <ShieldAlert className="w-12 h-12 text-orange-500 mb-6" />
                                <h4 className="text-2xl font-bold mb-4">Gate Bottlenecks</h4>
                                <p className="text-gray-500">Peak hours create gridlock. A single stuck truck can paralyze your entire delivery schedule.</p>
                            </div>
                        </div>
                    </div>
                </section>


                {/* --- TRANSITION: THE TRUCK --- */}
                <section className="py-24 bg-white relative overflow-hidden">
                     <div className="text-center mb-10">
                        <div className="inline-block px-4 py-2 rounded-full border border-gray-300 bg-gray-50 text-xs font-bold tracking-widest text-gray-500 uppercase">
                            AI Simulation Engine Active
                        </div>
                    </div>
                    {/* The New Artistic Truck */}
                    <TruckAnimation />
                    <div className="text-center mt-12 text-gray-400 font-mono text-sm">
                        Calculating Optimal Entry Vector... <span className="animate-pulse text-green-500 font-bold">Rerouting</span>
                    </div>
                </section>


                {/* --- SOLUTION: SKEUOMORPHIC UI --- */}
                <section className="py-32 bg-[#e0e5ec]">
                    <div className="container mx-auto px-6">
                         <div className="text-center mb-24">
                            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">The Solution</h2>
                            <h3 className="text-5xl md:text-6xl font-black text-gray-800">Precision <span className="text-blue-600">Logistics</span></h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                            {/* Feature 1 */}
                            <div className="sketch-card neumorphic p-12 rounded-[3rem] flex flex-col justify-between">
                                <div>
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-8 shadow-lg shadow-blue-500/30">
                                        <BarChart3 className="w-8 h-8 text-white" />
                                    </div>
                                    <h4 className="text-4xl font-bold text-gray-800 mb-6">Predictive Gate Analytics</h4>
                                    <p className="text-xl text-gray-600 leading-relaxed mb-8">
                                        Leverage XGBoost neural models to forecast gate congestion 24 hours in advance. Accuracy driven by historical cycling data and real-time weather inputs.
                                    </p>
                                </div>
                                <div className="neumorphic-inset p-6 rounded-2xl bg-gray-100/50">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-bold text-gray-500">Wait Time Reduction</span>
                                        <span className="text-sm font-bold text-green-600">-14 mins (Est.)</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full w-[70%] bg-blue-500"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Feature 2 */}
                            <div className="sketch-card neumorphic p-12 rounded-[3rem] flex flex-col justify-between">
                                 <div>
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mb-8 shadow-lg shadow-orange-500/30">
                                        <Navigation className="w-8 h-8 text-white" />
                                    </div>
                                    <h4 className="text-4xl font-bold text-gray-800 mb-6">Dynamic Route Optimization</h4>
                                    <p className="text-xl text-gray-600 leading-relaxed mb-8">
                                        Skip the queue. Our system identifies underutilized gates in real-time and pushes rerouting instructions directly to drivers, saving thousands in delay penalties.
                                    </p>
                                </div>
                                 <div className="neumorphic-inset p-6 rounded-2xl bg-gray-100/50 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                        <Zap className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-800">Route Update: Gate B</div>
                                        <div className="text-xs text-gray-500">Avoids 45m Delay</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-24 bg-[#1a202c] text-white text-center">
                    <div className="container mx-auto px-6">
                        <Anchor className="w-20 h-20 text-blue-500 mx-auto mb-8 animate-bounce" />
                        <h2 className="text-5xl font-bold mb-8">Optimize Your Fleet.</h2>
                        <Link to="/travel" className="inline-block px-12 py-5 rounded-full bg-blue-600 hover:bg-blue-500 font-bold text-lg transition-transform hover:scale-105 shadow-xl shadow-blue-900/50">
                            Start Optimization
                        </Link>
                    </div>
                </section>

                <Footer />
            </div>
        </Layout >
    );
};

export default Home;
