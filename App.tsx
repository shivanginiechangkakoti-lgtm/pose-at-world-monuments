
import React, { useState, useCallback } from 'react';
import { SettingsPanel } from './components/SettingsPanel';
import { ImageGallery } from './components/ImageGallery';
import { Header } from './components/Header';
import { generateScene } from './services/geminiService';
import type { GenerationOptions } from './types';

const App: React.FC = () => {
    const [options, setOptions] = useState<GenerationOptions>({
        person1Image: null,
        monument: 'Eiffel Tower (France)',
        outfit: 'Casual',
        outfitDescription: 'White t-shirt and blue jeans',
        bodyDescription: '',
        styleMode: 'Photo (Daylight / Clear Sky)',
        pose: 'Standing naturally',
        customPose: '',
        timeOfDay: 'Daylight',
        cameraFraming: 'Full Body Shot',
        numVariations: 1,
    });

    const [generatedImages, setGeneratedImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!options.person1Image) {
            setError('Please upload your photo.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedImages([]);

        try {
            const promises = Array.from({ length: options.numVariations }, () => generateScene(options));
            const results = await Promise.all(promises);
            const validImages = results.filter((img): img is string => img !== null);
            
            if(validImages.length < results.length) {
                 setError('Some images could not be generated. Please try again.');
            }

            setGeneratedImages(validImages);

        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred during image generation.');
        } finally {
            setIsLoading(false);
        }
    }, [options]);

    return (
        <div className="min-h-screen bg-gray-900 font-sans text-gray-200">
            <Header />
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                    <div className="lg:col-span-4 xl:col-span-3">
                        <SettingsPanel
                            options={options}
                            setOptions={setOptions}
                            onGenerate={handleGenerate}
                            isLoading={isLoading}
                        />
                    </div>
                    <div className="lg:col-span-8 xl:col-span-9">
                        <ImageGallery
                            images={generatedImages}
                            isLoading={isLoading}
                            error={error}
                            numVariations={options.numVariations > 0 ? options.numVariations : 1}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;