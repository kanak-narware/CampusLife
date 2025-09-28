'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Loader2 } from "lucide-react";
import { recommendStudyTools } from '@/ai/flows/recommend-study-tools';
import { assignments, timetable } from '@/lib/data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function StudyToolRecommender() {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState('');
  const [error, setError] = useState('');

  const handleGetRecommendation = async () => {
    setLoading(true);
    setRecommendation('');
    setError('');

    try {
      const assignmentsText = assignments.map(a => `${a.title} (Subject: ${a.subject}, Due: ${new Date(a.dueDate).toLocaleDateString()})`);
      const scheduleText = timetable.map(t => `${t.day} @ ${t.time}: ${t.subjectName}`).join('\n');
      
      const result = await recommendStudyTools({
        assignments: assignmentsText,
        classSchedule: scheduleText,
      });

      setRecommendation(result.studyToolRecommendation);
    } catch (e) {
      console.error(e);
      setError('Failed to get recommendation. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          AI Study Assistant
        </CardTitle>
        <CardDescription>Get a personalized study tool recommendation based on your current workload.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {recommendation && !loading && (
          <Alert>
            <AlertTitle>Recommendation</AlertTitle>
            <AlertDescription>{recommendation}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleGetRecommendation} disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Get Recommendation'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
