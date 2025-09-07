import React, { useEffect } from 'react';
import { CloseIcon } from './icons/CloseIcon';

interface ImageModalProps {
    src: string;
    onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ src, onClose }) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto';
        };
    }, [onClose]);

    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <style>
                {`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out forwards;
                }
                `}
            </style>
            
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-50 p-2 bg-black/30 rounded-full"
                aria-label="Close image view"
            >
                <CloseIcon />
            </button>
            
            <div 
                className="relative max-w-screen-lg max-h-[90vh]"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image itself
            >
                <img 
                    src={src} 
                    alt="Enlarged view of generated image" 
                    className="object-contain w-full h-full rounded-lg shadow-2xl"
                />
            </div>
        </div>
    );
};
