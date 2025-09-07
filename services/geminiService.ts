
import { GoogleGenAI, Modality } from "@google/genai";
import type { GenerationOptions } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const buildPrompt = (options: GenerationOptions): string => {
    // START WITH THE MOST CRITICAL INSTRUCTION
    let prompt = `CRITICAL INSTRUCTION: Your highest priority is to perfectly replicate the facial identity of the person in the provided reference photo. The face MUST be an exact match. Do NOT change their facial features, structure, or identity under any circumstances. This is a non-negotiable requirement. Any deviation from the provided face is a failure.

`;

    let stylePromptPart = `Generate a new image with a ${options.styleMode.toLowerCase()} aesthetic. `;
    let framingPromptPart = `The camera framing is a ${options.cameraFraming.toLowerCase()}. `;

    if (options.styleMode === 'iPhone') {
        stylePromptPart = `Generate a new image that looks like it was taken on a modern smartphone (like an iPhone). It should be high-quality but natural, not like an overly-produced 4K professional DSLR photo. `;
    } else if (options.styleMode === 'Selfie') {
        stylePromptPart = `Generate a new image that looks like a selfie taken by the person in the photo. The aesthetic should be natural. `;
        // Selfie overrides the framing choice
        framingPromptPart = `The camera framing is a close-up or medium shot, typical for a selfie, capturing the person's expression with the monument in the background. `;
    }

    prompt += stylePromptPart;
    prompt += `The scene is at the ${options.monument} during ${options.timeOfDay.toLowerCase()}. `;
    
    const poseDescription = options.pose === 'Custom' ? options.customPose : options.pose;
    prompt += `The person from the image is in the scene. Their pose is: ${poseDescription.toLowerCase()}. `;

    if (options.bodyDescription.trim()) {
        prompt += `Their body description is: ${options.bodyDescription.toLowerCase()}. `;
    }

    prompt += `They are wearing ${options.outfitDescription.toLowerCase()}. `;
    prompt += framingPromptPart;
    
    prompt += `The lighting on the person must perfectly match the ambient lighting of the ${options.monument} scene. `;
    
    prompt += `The person's scale, perspective, and proportions must be realistically integrated into the background. Pay extremely close attention to making the person's size believable in relation to the vastness and distance of the ${options.monument}. Avoid any visual mismatch that makes the person look like a giant or unnaturally small. The proportions must be accurate. `;

    prompt += `Do not use the background from the original image; create a completely new, high-quality background featuring the ${options.monument}. `;
    prompt += `The monument must be clearly recognizable. Block any misuse involving celebrities or public figures.

`;

    // REITERATE THE MOST IMPORTANT INSTRUCTION AT THE END
    prompt += `REMINDER: The absolute most important rule is to maintain the exact facial identity from the reference photo. Do not generate a new person; use the face provided.`;

    return prompt;
};

const base64ToGeminiPart = (base64: string) => {
    // Expected format: data:image/jpeg;base64,....
    const match = base64.match(/^data:(image\/\w+);base64,(.*)$/);
    if (!match) {
        throw new Error('Invalid base64 string format');
    }
    return {
        inlineData: {
            mimeType: match[1],
            data: match[2],
        },
    };
};

export const generateScene = async (options: GenerationOptions): Promise<string | null> => {
    try {
        if (!options.person1Image) {
            throw new Error("Main person's image is required.");
        }

        const prompt = buildPrompt(options);
        const imageParts = [base64ToGeminiPart(options.person1Image)];

        const contents = {
            parts: [...imageParts, { text: prompt }],
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: contents,
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
        if (imagePart?.inlineData) {
            const base64ImageBytes = imagePart.inlineData.data;
            const mimeType = imagePart.inlineData.mimeType;
            return `data:${mimeType};base64,${base64ImageBytes}`;
        }

        return null;
    } catch (error) {
        console.error("Error generating scene with Gemini:", error);
        throw new Error("Failed to generate image. The model may have refused the request. Please adjust your inputs and try again.");
    }
};