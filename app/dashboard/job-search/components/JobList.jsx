'use client';

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function JobList({ jobs }) {
  return (
    <div className="flex flex-col gap-6">
      {jobs.map((job) => (
        <Card key={job.id} className="flex flex-col md:flex-row items-start md:items-center p-4 gap-4 shadow-lg hover:shadow-xl transition-shadow duration-300">

          {/* Main Content */}
          <div className="flex flex-col flex-grow">
            <CardHeader className="p-0 mb-2">
              <CardTitle className="text-lg font-semibold">{job.company_name} - {job.title}</CardTitle>
              <p className="text-sm text-gray-500 mt-1">{job.candidate_required_location}</p>
            </CardHeader>

            <CardContent className="p-0">
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">{job.job_type}</span>
                {job.salary && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">{job.salary}</span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-2 line-clamp-3" dangerouslySetInnerHTML={{ __html: job.description }} />
            </CardContent>
          </div>

          {/* Apply Button */}
          <CardFooter className="p-0 mt-4 md:mt-0">
            <Button asChild className="w-full md:w-auto">
              <a href={job.url} target="_blank" rel="noopener noreferrer">
                Apply »
              </a>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
