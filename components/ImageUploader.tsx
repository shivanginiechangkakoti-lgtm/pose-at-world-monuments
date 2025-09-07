
import React, { useState, useRef, DragEvent } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { TrashIcon } from './icons/TrashIcon';

interface ImageUploaderProps {
    onImageUpload: (base64: string | null) => void;
    title?: string;
    isDisabled?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, title, isDisabled = false }) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processFile = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setImagePreview(base64String);
            onImageUpload(base64String);
        };
        reader.readAsDataURL(file);
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const handleClick = () => {
        if (isDisabled) return;
        fileInputRef.current?.click();
    };

    const handleClearImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setImagePreview(null);
        onImageUpload(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    const handleDragEvents = (e: DragEvent<HTMLDivElement>, isOver: boolean) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDisabled) {
            setIsDraggingOver(isOver);
        }
    }

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        handleDragEvents(e, false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            processFile(file);
        }
    }

    const borderStyle = isDraggingOver
        ? 'border-blue-500'
        : 'border-gray-600';
    
    const hoverStyle = isDisabled
        ? 'opacity-50 cursor-not-allowed'
        : 'hover:border-blue-500 hover:text-blue-400 cursor-pointer';

    return (
        <div className="w-full">
             {title && <label className="block text-xs font-medium text-gray-400 mb-2">{title}</label>}
            <div
                onClick={handleClick}
                onDragEnter={(e) => handleDragEvents(e, true)}
                onDragLeave={(e) => handleDragEvents(e, false)}
                onDragOver={(e) => handleDragEvents(e, true)}
                onDrop={handleDrop}
                className={`group relative w-full aspect-square bg-gray-700/50 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-400 transition ${borderStyle} ${hoverStyle}`}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp"
                    disabled={isDisabled}
                />
                {imagePreview ? (
                    <>
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                        {!isDisabled && (
                             <>
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                    Change
                                </div>
                                <button
                                    onClick={handleClearImage}
                                    className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-red-500/80 transition-colors"
                                    aria-label="Remove image"
                                >
                                    <TrashIcon />
                                </button>
                             </>
                        )}
                    </>
                ) : (
                    <div className="text-center pointer-events-none">
                        <UploadIcon />
                        <p className="mt-2 text-xs">
                           {isDraggingOver ? "Drop image here" : "Click or drag to upload"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
