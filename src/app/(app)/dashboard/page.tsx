'use client';
import { PageHeader } from '@/components/page-header';
import { DailyOverview } from '@/components/dashboard/daily-overview';
import { UpcomingAssignments } from '@/components/dashboard/upcoming-assignments';
import { AttendanceSummary } from '@/components/dashboard/attendance-summary';
import { StudyToolRecommender } from '@/components/dashboard/study-tool-recommender';

export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader title="Welcome!" description="Here's your overview for today." />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <DailyOverview />
          <UpcomingAssignments />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <AttendanceSummary />
          <StudyToolRecommender />
        </div>
      </div>
    </div>
  );
}
