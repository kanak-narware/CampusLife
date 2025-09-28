'use server';

/**
 * @fileOverview This file defines a Genkit flow for recommending study tools based on current assignments and class schedule.
 *
 * The flow takes assignments and class schedule as input and returns a recommendation for study tools.
 * - recommendStudyTools - A function that handles the study tool recommendation process.
 * - RecommendStudyToolsInput - The input type for the recommendStudyTools function.
 * - RecommendStudyToolsOutput - The return type for the recommendStudyTools function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendStudyToolsInputSchema = z.object({
  assignments: z
    .array(z.string())
    .describe('A list of current assignments.'),
  classSchedule: z
    .string()
    .describe('The current class schedule.'),
});
export type RecommendStudyToolsInput = z.infer<typeof RecommendStudyToolsInputSchema>;

const RecommendStudyToolsOutputSchema = z.object({
  studyToolRecommendation: z
    .string()
    .describe('A recommendation for a study tool based on the assignments and class schedule.'),
});
export type RecommendStudyToolsOutput = z.infer<typeof RecommendStudyToolsOutputSchema>;

export async function recommendStudyTools(input: RecommendStudyToolsInput): Promise<RecommendStudyToolsOutput> {
  return recommendStudyToolsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendStudyToolsPrompt',
  input: {schema: RecommendStudyToolsInputSchema},
  output: {schema: RecommendStudyToolsOutputSchema},
  prompt: `You are a study tool recommendation expert.

Based on the current assignments and class schedule, recommend a study tool that will help the student optimize their study sessions and improve their academic performance.

Assignments: {{{assignments}}}
Class Schedule: {{{classSchedule}}}

Recommendation:`,
});

const recommendStudyToolsFlow = ai.defineFlow(
  {
    name: 'recommendStudyToolsFlow',
    inputSchema: RecommendStudyToolsInputSchema,
    outputSchema: RecommendStudyToolsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
