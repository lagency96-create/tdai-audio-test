
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getFocusRecommendation = async (task: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `L'utilisateur exprime son état actuel ou sa tâche de manière brute (peut être mal écrit, confus ou fragmenté) : "${task}". 
      
      En tant qu'intelligence TDAI-Core (Expert en Neuro-diversité), vous devez :
      1. Reformuler avec une empathie profonde ce que l'utilisateur traverse pour prouver que vous avez compris son intention réelle (max 25 mots).
      2. Fournir une micro-stratégie ADHD spécifique pour réussir (max 15 mots).
      3. Un mantra court et puissant.
      4. Choisir le mode sonore : FOCUS (travail intense), RELAX (anxiété/pause), MOVE (énergie/tâches ménagères), SLEEP (repos).
      
      Répondez strictement en JSON en français.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            understanding: { type: Type.STRING, description: "Reformulation empathique du besoin de l'utilisateur." },
            strategy: { type: Type.STRING, description: "Micro-conseil actionnable." },
            mantra: { type: Type.STRING, description: "Phrase de motivation." },
            mode: { type: Type.STRING, enum: ["FOCUS", "RELAX", "MOVE", "SLEEP"] }
          },
          required: ["understanding", "strategy", "mantra", "mode"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      understanding: "Je perçois votre besoin de clarté. Nous allons structurer cet instant ensemble.",
      strategy: "Commencez par 2 minutes d'action, juste pour amorcer la pompe.",
      mantra: "Le mouvement crée la motivation.",
      mode: "FOCUS"
    };
  }
};
