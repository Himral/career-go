'use client';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { UploadCloud, FileText, X } from 'lucide-react';

export default function ResumeUpload({ onUpload, setJobPosition, setJobExperience }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      setError(null);
      if (acceptedFiles.length > 0) {
        await handleFileUpload(acceptedFiles[0]);
      }
    },
  });

  const handleFileUpload = async (file) => {
    setLoading(true);
    setFile(file);
    
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to parse resume');
      }

      const { text, position, experience } = await response.json();
      onUpload(text);
      if (position) setJobPosition(position);
      if (experience) setJobExperience(experience);
    } catch (error) {
      console.error('Error parsing resume:', error);
      setError(error.message || 'Failed to process resume');
      setFile(null);
      onUpload('');
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    onUpload('');
    setError(null);
  };

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/10' : 'border-border'
        } ${loading ? 'opacity-70 pointer-events-none' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <UploadCloud className={`h-8 w-8 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
          {loading ? (
            <p className="text-sm font-medium">Processing resume...</p>
          ) : file ? (
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{file.name}</span>
            </div>
          ) : isDragActive ? (
            <>
              <p className="text-sm font-medium">Drop the resume here</p>
              <p className="text-xs text-muted-foreground">PDF, DOC, or DOCX</p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium">Drag & drop your resume here</p>
              <p className="text-xs text-muted-foreground">or click to browse files</p>
              <p className="text-xs text-muted-foreground">Supports PDF, DOC, DOCX</p>
            </>
          )}
        </div>
      </div>

      {file && (
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="truncate max-w-xs">{file.name}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={removeFile}
            disabled={loading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}