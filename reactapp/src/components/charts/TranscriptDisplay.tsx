
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface TranscriptDisplayProps {
  transcript: string;
}

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ transcript }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Your Speech Transcript</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea 
          value={transcript} 
          readOnly 
          className="h-32 resize-none bg-speech-card/50 text-foreground" 
        />
      </CardContent>
    </Card>
  );
};

export default TranscriptDisplay;
