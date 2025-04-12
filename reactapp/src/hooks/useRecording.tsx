import { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AnalysisResultsData } from "@/components/AnalysisResults";

export const useRecording = () => {
  const [transcription, setTranscription] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResultsData | null>(null);
  const [transcriptionComplete, setTranscriptionComplete] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current?.state !== "inactive") {
        mediaRecorderRef.current?.stop();
      }
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      setAnalysisResults(null);
      setTranscriptionComplete(false); 

      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast({
        title: "Recording Started",
        description: "Speak clearly into your microphone.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Microphone access denied or unavailable.",
      });
      console.error(err);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);

      toast({
        title: "Recording Paused",
        description: "Press resume to continue.",
      });
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast({
        title: "Recording Resumed",
        description: "Continue speaking clearly.",
      });
    }
  };

  const stopRecording = async () => {
    if (!mediaRecorderRef.current) return;
  
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    setIsPaused(false);
    if (timerRef.current) clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach(track => track.stop());
  
    toast({
      title: "Processing Audio...",
      description: "Uploading your recording for analysis.",
    });
  
    // Wait for data to finish writing
    setTimeout(async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
  
      try {
        const response = await fetch("http://localhost:5000/upload", {
          method: "POST",
          body: formData,
        });
  
        if (!response.ok) throw new Error("Upload failed");
  
        const result = await response.json();
        
        // Log the result to verify its content
        console.log("Transcription result:", result);
  
        toast({
          title: "Transcription Complete!",
        });
  
        // Ensure the transcription exists before setting the state
        if (result.transcription) {
          setTranscription(result.transcription);
        } else {
          console.error("Transcription is empty or missing.");
        }
        setTranscriptionComplete(true);
  
        // Optional: save the transcription if needed
        // setTranscription(result.transcription);
  
        // Simulate analysis with mock data
        setTimeout(() => {
          const mockResults: AnalysisResultsData = {
            confidenceScore: Math.floor(Math.random() * 30) + 65,
            fillerWordCount: Math.floor(Math.random() * 12),
            paceRating: ["Steady", "Fast", "Slow", "Variable"][Math.floor(Math.random() * 4)],
            toneBalance: ["Balanced", "Monotone", "Expressive"][Math.floor(Math.random() * 3)],
            improvementTips: [
              "Reduce filler words like 'um' and 'uh'",
              "Vary your tone for emphasis",
              "Speak more slowly for clarity",
              "Project your voice more confidently",
            ],
          };
  
          setAnalysisResults(mockResults);
        }, 1500);
      } catch (err) {
        console.error(err);
        toast({
          title: "Upload Failed",
          description: "Could not upload audio for analysis.",
        });
      }
    }, 500);
  };

  return {
    isRecording,
    isPaused,
    recordingTime,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    analysisResults,
    transcription,
    transcriptionComplete,
  };
};
