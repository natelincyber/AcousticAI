
import React, { useState } from "react";
import CassetteTape from "@/components/CassetteTape";

const Index = () => {

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-800">
      {/* Background texture overlay */}
      <div className="fixed inset-0 pointer-events-none grain-overlay"></div>
      <div className="fixed inset-0 pointer-events-none opacity-30" 
           style={{ 
             backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\" fill=\"%23333333\" fill-opacity=\"0.15\" fill-rule=\"evenodd\"/%3E%3C/svg%3E')"
           }}></div>

      {/* Header */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2">
          {/* <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-0.5 shadow-lg shadow-purple-500/30">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
            </div>
          </div> */}
          <div className={`cassette-reel w-20 h-20 z-30 relative`}>
              <div className="reel-hole"></div>
              <div className="reel-spoke"></div>
              <div className="reel-spoke transform rotate-45"></div>
              <div className="reel-spoke transform rotate-90"></div>
              <div className="reel-spoke transform rotate-[135deg]"></div>
              <div className="reel-teeth"></div>
              <div className="reel-shine"></div>
          </div>
          <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">SpeakUp</span>
        </div>
        <nav>
          <button className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-md shadow-purple-500/20 transition-all hover:shadow-lg hover:shadow-purple-500/30">
            Sign In
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-4 py-12 md:py-20 flex flex-col items-center relative z-10">
        {/* Hero Text */}
        <div className="text-center mb-12 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gradient relative">
            {/* <span className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-xl"></span> */}
            <span className="relative">Sound Confident. Speak with Power.</span>
          </h1>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Get real-time analysis of your speech patterns and actionable feedback to improve your delivery and tone.
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <span className="px-4 py-1 bg-purple-900/40 rounded-full text-sm text-purple-200 backdrop-blur-sm border border-purple-700/30">Voice Analysis</span>
            <span className="px-4 py-1 bg-pink-900/40 rounded-full text-sm text-pink-200 backdrop-blur-sm border border-pink-700/30">Speech Coaching</span>
            <span className="px-4 py-1 bg-indigo-900/40 rounded-full text-sm text-indigo-200 backdrop-blur-sm border border-indigo-700/30">Instant Feedback</span>
          </div>
        </div>

        {/* Cassette Recorder Component */}
        <div className="w-full max-w-6xl relative">
          <div className="relative">
            <CassetteTape />
          </div>
        </div>

        
        <p className="mt-8 text-center text-purple-200 bg-slate-800/50 px-6 py-3 rounded-full backdrop-blur-sm shadow-inner max-w-lg mx-auto border border-purple-500/20">
          Record your voice and get instant feedback on your confidence level.
        </p>
      </main>

      {/* Testimonials Section */}
      <section className="py-16 relative z-10" style={{
        backgroundImage: "linear-gradient(to bottom, rgba(30, 30, 60, 0.5), rgba(20, 20, 40, 0.7)), url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.1\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
      }}>
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
            Transforming How People Speak
          </h2>
          <div className="w-24 h-1 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-12"></div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/50 to-pink-600/50 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="glass-panel p-6 relative">
                  <div className="absolute top-0 right-0 -mt-3 -mr-3 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-xs font-bold">{index + 1}</span>
                  </div>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-lg shadow-md">
                      {testimonial.initials}
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-purple-100">{testimonial.name}</h3>
                      <p className="text-sm text-purple-300">{testimonial.title}</p>
                    </div>
                  </div>
                  <p className="text-slate-300 relative">
                    <span className="absolute -left-2 -top-2 text-purple-500/40 text-4xl font-serif">"</span>
                    <span className="relative">{testimonial.quote}</span>
                    <span className="absolute -right-2 bottom-0 text-purple-500/40 text-4xl font-serif">"</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-purple-800/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
              <span className="font-bold text-gradient">SpeakConfident</span>
            </div>
            <div className="flex gap-4">
              <button className="w-8 h-8 rounded-full bg-slate-800/70 flex items-center justify-center hover:bg-purple-900/70 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </button>
              <button className="w-8 h-8 rounded-full bg-slate-800/70 flex items-center justify-center hover:bg-purple-900/70 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </button>
              <button className="w-8 h-8 rounded-full bg-slate-800/70 flex items-center justify-center hover:bg-purple-900/70 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </button>
            </div>
            <p className="text-slate-400 text-sm">© 2025 SpeakConfident. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const testimonials = [
  {
    name: "Alex Morgan",
    initials: "AM",
    title: "Marketing Director",
    quote: "This app helped me identify my filler words and improve my presentation skills dramatically in just two weeks."
  },
  {
    name: "Jamie Chen",
    initials: "JC",
    title: "Startup Founder",
    quote: "The real-time feedback during my pitch practice sessions was invaluable. I secured funding after refining my delivery."
  },
  {
    name: "Riley Taylor",
    initials: "RT",
    title: "Graduate Student",
    quote: "As someone with social anxiety, this tool gave me concrete ways to sound more confident during my thesis defense."
  }
];

export default Index;
