import React, { useState } from 'react';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { ExpandIcon } from './icons/ExpandIcon';
import { ImageModal } from './ImageModal';

interface ImageGalleryProps {
    images: string[];
    isLoading: boolean;
    error: string | null;
    numVariations: number;
}

const Placeholder: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="bg-gray-800/50 border border-white/10 aspect-square rounded-lg flex items-center justify-center p-4">
        {children}
    </div>
);

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, isLoading, error, numVariations }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleDownload = (e: React.MouseEvent, src: string, index: number) => {
        e.stopPropagation(); // Prevent modal from opening
        const link = document.createElement('a');
        link.href = src;
        link.download = `monument-pose-${index + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const renderContent = () => {
        if (isLoading) {
            return Array.from({ length: numVariations }).map((_, index) => (
                <Placeholder key={index}>
                    <div className="text-center text-gray-400">
                        <SpinnerIcon />
                        <p className="mt-2 text-sm">Generating image {index + 1}...</p>
                    </div>
                </Placeholder>
            ));
        }

        if (error) {
            return (
                <div className="lg:col-span-full bg-red-900/20 border border-red-500 text-red-300 p-6 rounded-lg text-center">
                    <h3 className="font-bold text-lg mb-2">Generation Failed</h3>
                    <p className="text-sm">{error}</p>
                </div>
            );
        }

        if (images.length > 0) {
            return images.map((src, index) => (
                <div 
                    key={index} 
                    className="group relative bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105 cursor-pointer"
                    onClick={() => setSelectedImage(src)}
                    role="button"
                    tabIndex={0}
                    aria-label={`View generated variation ${index + 1}`}
                >
                    <img src={src} alt={`Generated variation ${index + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-x-4">
                        <button
                            onClick={(e) => handleDownload(e, src, index)}
                            className="bg-white/20 hover:bg-white/30 text-white font-bold p-3 rounded-full backdrop-blur-sm transition"
                            aria-label="Download image"
                        >
                            <DownloadIcon />
                        </button>
                        <button
                             className="bg-white/20 hover:bg-white/30 text-white font-bold p-3 rounded-full backdrop-blur-sm transition"
                             aria-label="Expand image"
                        >
                             <ExpandIcon />
                        </button>
                    </div>
                </div>
            ));
        }
        
        return (
             <div className="lg:col-span-full flex items-center justify-center bg-gray-800/50 border border-white/10 rounded-lg min-h-[60vh]">
                <div className="text-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-300">Your generated images will appear here</h3>
                    <p className="mt-1 text-sm text-gray-500">Fill out the options and click "Generate Photos".</p>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className={`grid grid-cols-1 ${images.length > 1 ? 'sm:grid-cols-2' : ''} gap-4 lg:gap-6`}>
                {renderContent()}
            </div>
            {selectedImage && <ImageModal src={selectedImage} onClose={() => setSelectedImage(null)} />}
        </>
    );
};