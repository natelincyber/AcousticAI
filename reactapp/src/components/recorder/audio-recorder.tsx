import { useRef, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // Adjust if needed

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

const useAudioRecorder = () => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recordingTimeRef = useRef(0);

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [analysis, setAnalysis] = useState<any>(null);

  const startRecording = async () => {
    console.log("🎙 startRecording called");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      recordingTimeRef.current = 0;
    } catch (err) {
      console.error("Failed to start recording:", err);
    }
  };

  const stopRecording = async () => {
    if (!mediaRecorderRef.current) return;

    return new Promise<void>((resolve, reject) => {
      mediaRecorderRef.current.onstop = async () => {
        try {
          setIsRecording(false);
          setIsPaused(false);
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;

          streamRef.current?.getTracks().forEach((track) => track.stop());

          toast({
            title: "Processing Audio...",
            description: "Uploading your recording for analysis.",
          });

          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          const formData = new FormData();
          formData.append("audio", audioBlob, "recording.webm");

          const response = await fetch(`http://localhost:5000/upload?sid=${socket.id}`, {
            method: "POST",
            body: formData,
          });

          if (!response.ok) throw new Error("Upload failed");

          const result = await response.json();
          console.log("Upload result:", result);

          resolve();
        } catch (err) {
          console.error(err);
          toast({
            title: "Upload Failed",
            description: "Could not upload audio for analysis.",
            variant: "destructive",
          });
          reject(err);
        }
      };

      mediaRecorderRef.current.stop();
    });
  };
  useEffect(() => {
    if (analysis) {
      console.log("📊 Analysis Data:", analysis);
    }
  }, [analysis]);
  // 🍞 Toast listeners from backend
  useEffect(() => {
    socket.on("transcription_status", (data) => {
      if (data.status === "started") {
        toast({ title: "Transcription Started", description: "We're transcribing your audio..." });
      } else if (data.status === "completed") {
        toast({ title: "Transcription Complete", description: "Your transcript is ready!" });
        
      }
    });

    socket.on("emotion_status", (data) => {
      if (data.status === "started") {
        toast({ title: "Emotion Analysis Started", description: "Analyzing tone and mood..." });
      } else if (data.status === "completed") {
        toast({ title: "Emotion Analysis Complete", description: "Emotion profile is ready!" });
      }
    });

    socket.on("analysis_result", (data) => {
      if (data.status === "completed") {
        toast({ title: "Full Analysis Ready", description: "Check out your delivery feedback!" });
        setAnalysis(data.data);
        setAnalysisComplete(true);
        
      } else if (data.status === "error") {
        toast({
          title: "Analysis Failed",
          description: data.error || "Something went wrong during processing.",
          variant: "destructive",
        });
      }
    });
    

    return () => {
      socket.off("transcription_status");
      socket.off("emotion_status");
      socket.off("analysis_result");
    };
  }, []);

  return {
    analysis,
    isRecording,
    isPaused,
    analysisComplete,
    recordingTime,
    formattedTime: formatTime(recordingTime),
    startRecording,
    stopRecording,
    setIsRecording,
    setIsPaused,
    mediaRecorderRef,
    streamRef,
    audioChunksRef,
    timerRef,
  };
};

export default useAudioRecorder;
