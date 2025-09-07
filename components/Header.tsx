import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="bg-gray-900/70 backdrop-blur-lg sticky top-0 z-10 border-b border-white/10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                 <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                    Pose at World Monuments
                </h1>
                <p className="text-sm text-gray-400 mt-1">Create your dream travel photos with AI</p>
            </div>
        </header>
    );
};