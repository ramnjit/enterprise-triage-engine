import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { z } from 'zod';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Configured for production deployment & local development
const corsOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({ origin: corsOrigin }));
app.use(express.json());

// System prompt abstracted for cleaner route logic
const TRIAGE_SYSTEM_PROMPT = `
  You are an expert AI Medical Scribe and Triage Agent for an urgent care clinic. 
  Your job is to read messy, unstructured patient intake emails or rushed doctor notes, 
  extract the vital information, and output it strictly adhering to the provided JSON schema.
  Always default to safe triage levels if unsure. Be aggressive with systemAlerts if you detect high-risk keywords.
`;

// Strict Zod schema for Agentic JSON enforcement
const triageSchema = z.object({
  patientInfo: z.object({
    age: z.number().nullable().describe("Patient age, if provided"),
    gender: z.string().nullable().describe("Patient gender, if provided"),
    insurance: z.string().nullable().describe("Insurance provider mentioned"),
  }),
  vitals: z.object({
    temperature: z.number().nullable(),
    bloodPressure: z.string().nullable(),
  }),
  symptoms: z.array(z.string()).describe("List of reported symptoms"),
  triageLevel: z.enum(["1", "2", "3", "4", "5"]).describe("ESI Triage Level: 1 is Resuscitation, 5 is Non-urgent"),
  systemAlerts: z.array(z.string()).describe("High-risk flags, e.g., 'Head Trauma', 'Chest Pain', 'Stroke Symptoms'"),
  recommendedAction: z.string().describe("Next steps based on triage (e.g., 'Immediate X-Ray', 'Standard Wait')"),
});

/**
 * POST /api/triage
 * Ingests unstructured clinical text and streams structured EMR JSON back to the client.
 */
app.post('/api/triage', async (req: Request, res: Response) => {
  try {
    const { clinicalText } = req.body;

    if (!clinicalText) {
      res.status(400).json({ error: 'clinicalText payload is required' });
      return;
    }

    // Establish Server-Sent Events (SSE) headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Initiate streaming LLM extraction
    const { partialObjectStream } = await streamObject({
      model: openai('gpt-4o-mini'),
      schema: triageSchema,
      system: TRIAGE_SYSTEM_PROMPT,
      prompt: `Extract EMR data from the following intake text:\n\n"${clinicalText}"`,
    });

    // Stream chunks to the client as they resolve
    for await (const partialObject of partialObjectStream) {
      res.write(`data: ${JSON.stringify(partialObject)}\n\n`);
    }

    res.end();

  } catch (error) {
    console.error("[Triage API Error]:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal Server Error processing triage stream.' });
    } else {
      res.end();
    }
  }
});

app.listen(PORT, () => {
  console.log(`Triage Engine Microservice running on port ${PORT}`);
  console.log(`Accepting requests from: ${corsOrigin}`);
});