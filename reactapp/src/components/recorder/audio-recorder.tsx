import { useRef, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";


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
  const recordingTimeRef = useRef(0); // ✅ new ref to track time

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [transcriptionComplete, setTranscriptionComplete] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
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

          const response = await fetch("http://localhost:5000/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) throw new Error("Upload failed");

          const result = await response.json();
          console.log("Transcription result:", result);

          if (result.transcription) {
            setTranscription(result.transcription);
            setTranscriptionComplete(true);

            toast({
              title: "Analysis Complete",
              description: "Transcription and feedback are ready!",
            });
          } else {
            console.error("No transcription returned.");
          }

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
    console.log("⏱ recordingTime:", recordingTime);
  }, [recordingTime]);

  return {
    isRecording,
    isPaused,
    transcription,
    transcriptionComplete,
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
