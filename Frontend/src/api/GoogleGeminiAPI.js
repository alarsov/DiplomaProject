import { GoogleGenerativeAI, FunctionDeclarationSchemaType } from "@google/generative-ai";

export class GoogleAPIHandler {
    constructor() {
        this.apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
        this.genAI = new GoogleGenerativeAI(this.apiKey);
    }

    async generateContent(modelName, prompt, generationConfig = {}) {
        const model = this.genAI.getGenerativeModel({
            model: modelName,
            generationConfig: generationConfig,
        });

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = await response.text();
            return text;
        } catch (error) {
            console.error("Error generating content:", error);
            return null;
        }
    }

    async query(data) {
        const prompt = `Summarize the following text: ${data}`;
        const text = await this.generateContent("gemini-1.5-flash", prompt);
        return text;
    }

    async flashcards(data) {
        const prompt = `
      Create 7 flashcards from the following text. Each flashcard should include a key point, fact, or explanation derived from the text. The flashcards should focus on the most important concepts, definitions, dates, and key points mentioned in the text.
      Text: ${data}
    `;

        const generationConfig = {
            responseMimeType: "application/json",
            responseSchema: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        key_point: { type: "string" },
                        fact: { type: "string" },
                        explanation: { type: "string" },
                    },
                },
            },
        };

        const text = await this.generateContent("gemini-1.5-flash", prompt, generationConfig);
        return this.parseJSONResponse(text);
    }

    async questionGenerating(data) {
        const prompt = `
      Generate ${data.numQuestions} multiple-choice questions based on the following materials:
      ${data.inputs}
      
      For each question, provide four answer options (A, B, C, D) and indicate the correct answer.
    `;

        const generationConfig = {
            responseMimeType: "application/json",
            responseSchema: {
                type: FunctionDeclarationSchemaType.ARRAY,
                items: {
                    type: FunctionDeclarationSchemaType.OBJECT,
                    properties: {
                        questionText: { type: FunctionDeclarationSchemaType.STRING },
                        answerOptions: {
                            type: FunctionDeclarationSchemaType.ARRAY,
                            items: {
                                type: FunctionDeclarationSchemaType.OBJECT,
                                properties: {
                                    answerText: { type: FunctionDeclarationSchemaType.STRING },
                                    isCorrect: { type: FunctionDeclarationSchemaType.BOOLEAN },
                                },
                            },
                        },
                    },
                },
            },
        };

        const text = await this.generateContent("gemini-1.5-flash", prompt, generationConfig);
        return this.parseJSONResponse(text);
    }

    async report(data) {
        const prompt = `
      Based on the summarized content and the user's input, generate a detailed report in JSON format that includes the following:
      1. An analysis of how much the user has learned.
      2. Specific areas where the user needs to improve.
      3. A percentage score representing how much of the summarized content the user has correctly learned.
      Summarized content: ${data.inputs}.
      User's input: ${data.userInput}.
    `;

        const generationConfig = {
            responseMimeType: "application/json",
            responseSchema: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        analysis: { type: "string" },
                        areas_for_improvement: {
                            type: "array",
                            items: { type: "string" },
                        },
                        percentage_learned: { type: "number" },
                    },
                },
            },
        };

        const text = await this.generateContent("gemini-1.5-flash", prompt, generationConfig);
        return this.parseJSONResponse(text);
    }

    parseJSONResponse(text) {
        try {
            return JSON.parse(text);
        } catch (error) {
            console.error("Error parsing JSON response:", error);
            return [];
        }
    }
}
