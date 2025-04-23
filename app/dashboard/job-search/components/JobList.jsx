'use client';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function JobList({ jobs }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Recommended Jobs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <Card key={job.id} className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
              <p className="text-sm text-gray-600">{job.company.display_name}</p>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm mb-2">
                <span className="font-medium">Location:</span> {job.location.display_name}
              </p>
              <p className="text-sm mb-2">
                <span className="font-medium">Salary:</span> {job.salary_min ? `${job.salary_min} - ${job.salary_max} ${job.salary_currency}` : 'Not specified'}
              </p>
              <div className="text-sm line-clamp-3" dangerouslySetInnerHTML={{ __html: job.description }} />
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <a href={job.redirect_url} target="_blank" rel="noopener noreferrer">
                  View Job
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}