"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Video, X, Play, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoUploadProps {
  onVideoUploaded: (videoUrl: string) => void;
  onVideoRemoved: () => void;
  existingVideoUrl?: string;
  maxSizeInMB?: number;
  maxDurationInSeconds?: number;
  className?: string;
}

export function VideoUpload({
  onVideoUploaded,
  onVideoRemoved,
  existingVideoUrl,
  maxSizeInMB = 20,
  maxDurationInSeconds = 60,
  className
}: VideoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(existingVideoUrl || null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const validateVideo = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      // Check file size
      if (file.size > maxSizeInMB * 1024 * 1024) {
        setError(`Video file size must be less than ${maxSizeInMB}MB`);
        resolve(false);
        return;
      }

      // Check file type
      if (!file.type.startsWith('video/')) {
        setError('Please select a valid video file');
        resolve(false);
        return;
      }

      // Check duration
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        
        if (video.duration > maxDurationInSeconds) {
          setError(`Video duration must be less than ${maxDurationInSeconds} seconds`);
          resolve(false);
          return;
        }
        
        setVideoDuration(video.duration);
        resolve(true);
      };

      video.onerror = () => {
        setError('Invalid video file');
        resolve(false);
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'yegebere_gebeya_videos');
    formData.append('resource_type', 'video');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload video');
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploadProgress(0);

    // Validate video
    const isValid = await validateVideo(file);
    if (!isValid) return;

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setVideoPreview(previewUrl);

    // Upload video
    setIsUploading(true);
    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const videoUrl = await uploadToCloudinary(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Clean up preview URL and use uploaded URL
      URL.revokeObjectURL(previewUrl);
      setVideoPreview(videoUrl);
      onVideoUploaded(videoUrl);
      
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload video. Please try again.');
      URL.revokeObjectURL(previewUrl);
      setVideoPreview(null);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveVideo = () => {
    if (videoPreview && videoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoPreview(null);
    setVideoDuration(null);
    setError(null);
    onVideoRemoved();
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {!videoPreview ? (
        <Card className="border-2 border-dashed border-gray-300 hover:border-green-400 transition-colors">
          <CardContent className="p-6">
            <div className="text-center">
              <Video className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Upload Video</h3>
                <p className="text-sm text-gray-600">
                  Add a video to showcase your animal (Max {maxSizeInMB}MB, {maxDurationInSeconds}s)
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="mt-4"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Video File
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <video
                ref={videoRef}
                src={videoPreview}
                controls
                className="w-full rounded-lg"
                style={{ maxHeight: '300px' }}
              >
                Your browser does not support the video tag.
              </video>
              
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleRemoveVideo}
              >
                <X className="h-4 w-4" />
              </Button>
              
              {videoDuration && (
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                  {formatDuration(videoDuration)}
                </div>
              )}
            </div>
            
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <Play className="h-4 w-4 mr-1" />
                Video uploaded successfully
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                Replace Video
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Uploading video...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="text-xs text-gray-500 space-y-1">
        <p>• Supported formats: MP4, WebM, MOV</p>
        <p>• Maximum file size: {maxSizeInMB}MB</p>
        <p>• Maximum duration: {maxDurationInSeconds} seconds</p>
        <p>• Videos will be automatically optimized for web playback</p>
      </div>
    </div>
  );
}
