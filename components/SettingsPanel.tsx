
import React from 'react';
import type { GenerationOptions } from '../types';
import { MONUMENTS, OUTFITS, STYLE_MODES, POSES, TIMES_OF_DAY, CAMERA_FRAMINGS, MAX_VARIATIONS } from '../constants';
import { ImageUploader } from './ImageUploader';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface SettingsPanelProps {
    options: GenerationOptions;
    setOptions: React.Dispatch<React.SetStateAction<GenerationOptions>>;
    onGenerate: () => void;
    isLoading: boolean;
}

const SettingsSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="space-y-3 border-b border-white/10 pb-6">
        <label className="block text-sm font-medium text-gray-300">{title}</label>
        {children}
    </div>
);

const SelectInput: React.FC<{ value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: string[]; disabled?: boolean }> = ({ value, onChange, options, disabled = false }) => (
    <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full bg-gray-700/50 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed"
    >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
);

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ options, setOptions, onGenerate, isLoading }) => {
    const handleOptionChange = <K extends keyof GenerationOptions,>(key: K, value: GenerationOptions[K]) => {
        setOptions(prev => ({ ...prev, [key]: value }));
    };

    const isFramingDisabled = options.styleMode === 'Selfie';

    return (
        <div className="bg-gray-800/50 border border-white/10 p-4 rounded-xl shadow-2xl space-y-6 sticky top-24">
            
            <div className="space-y-6 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
                <SettingsSection title="Your Photo">
                    <div className="w-3/4 mx-auto">
                        <ImageUploader
                            onImageUpload={base64 => handleOptionChange('person1Image', base64)}
                        />
                    </div>
                </SettingsSection>
                
                <SettingsSection title="Destination">
                    <SelectInput value={options.monument} onChange={e => handleOptionChange('monument', e.target.value)} options={MONUMENTS} />
                </SettingsSection>
                
                <SettingsSection title="Style Mode">
                    <SelectInput value={options.styleMode} onChange={e => handleOptionChange('styleMode', e.target.value)} options={STYLE_MODES} />
                </SettingsSection>

                <SettingsSection title="Outfit">
                    <SelectInput value={options.outfit} onChange={e => handleOptionChange('outfit', e.target.value)} options={OUTFITS} />
                    {(options.outfit === 'Custom' || options.outfitDescription) &&
                        <input
                            type="text"
                            placeholder="e.g., red formal dress"
                            value={options.outfitDescription}
                            onChange={e => handleOptionChange('outfitDescription', e.target.value)}
                            className="mt-2 w-full bg-gray-700/50 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    }
                </SettingsSection>

                <SettingsSection title="Body Description">
                    <input
                        type="text"
                        placeholder="e.g., athletic build, long hair"
                        value={options.bodyDescription}
                        onChange={e => handleOptionChange('bodyDescription', e.target.value)}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </SettingsSection>

                <SettingsSection title="Pose">
                    <SelectInput value={options.pose} onChange={e => handleOptionChange('pose', e.target.value)} options={POSES} />
                    {options.pose === 'Custom' &&
                        <input
                            type="text"
                            placeholder="Describe a custom pose"
                            value={options.customPose}
                            onChange={e => handleOptionChange('customPose', e.target.value)}
                            className="mt-2 w-full bg-gray-700/50 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    }
                </SettingsSection>
                
                <SettingsSection title="Time of Day">
                    <SelectInput value={options.timeOfDay} onChange={e => handleOptionChange('timeOfDay', e.target.value)} options={TIMES_OF_DAY} />
                </SettingsSection>

                <SettingsSection title="Camera Framing">
                    <SelectInput 
                        value={options.cameraFraming} 
                        onChange={e => handleOptionChange('cameraFraming', e.target.value)} 
                        options={CAMERA_FRAMINGS}
                        disabled={isFramingDisabled}
                    />
                    {isFramingDisabled && <p className="text-xs text-gray-400 mt-2">Framing is automatically set for Selfie mode.</p>}
                </SettingsSection>

                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-300">Variations ({options.numVariations})</label>
                    <input
                        type="range"
                        min="1"
                        max={MAX_VARIATIONS}
                        value={options.numVariations}
                        onChange={e => handleOptionChange('numVariations', parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>
            </div>

            <button
                onClick={onGenerate}
                disabled={isLoading || !options.person1Image}
                className="w-full flex justify-center items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-900/50 disabled:to-indigo-900/50 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105"
            >
                {isLoading ? <><SpinnerIcon /> Generating...</> : 'Generate Photos'}
            </button>
        </div>
    );
};