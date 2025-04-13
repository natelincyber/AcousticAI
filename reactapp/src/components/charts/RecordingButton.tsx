
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { toast } from "sonner"; // Changed import source

interface RecordingButtonProps {
  onTranscriptReady: (transcript: string) => void;
}

const RecordingButton: React.FC<RecordingButtonProps> = ({ onTranscriptReady }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setAudioChunks((chunks) => [...chunks, e.data]);
        }
      };
      
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        await processAudio(audioBlob);
        setAudioChunks([]);
        
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      toast.success("Recording started", {
        description: "Speak clearly into your microphone",
      });
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone", {
        description: "Please check your browser permissions",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      setIsRecording(false);
      toast.info("Processing your speech...");
    }
  };

  // In a real application, this would send the audio to a speech-to-text service
  // For this demo, we'll simulate a response with mock data
  const processAudio = async (audioBlob: Blob) => {
    try {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock transcript - in a real app, you'd get this from a speech-to-text API
      const mockTranscript = 
        "Um, I think that, you know, the project we're working on is really important for users " +
        "because, like, it helps them understand their speech patterns better. I, I, I believe " +
        "that this tool can really help people become more confident speakers. Um, you know, " +
        "when people speak more clearly and confidently, it has a positive effect on their " +
        "mental health and well-being. So, uh, yeah, I'm really excited about what we're building here.";
      
      onTranscriptReady(mockTranscript);
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Error processing audio:", error);
      toast.error("Error processing your speech", {
        description: "Please try again",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Button
        onClick={isRecording ? stopRecording : startRecording}
        className={`h-24 w-24 rounded-full ${
          isRecording 
            ? "bg-red-500 hover:bg-red-600 recording-pulse" 
            : "bg-primary hover:bg-primary/90"
        }`}
        aria-label={isRecording ? "Stop recording" : "Start recording"}
      >
        {isRecording ? (
          <MicOff className="h-10 w-10" />
        ) : (
          <Mic className="h-10 w-10" />
        )}
      </Button>
      <p className="mt-4 text-lg font-medium">
        {isRecording ? "Tap to stop recording" : "Tap to start recording"}
      </p>
    </div>
  );
};

export default RecordingButton;
