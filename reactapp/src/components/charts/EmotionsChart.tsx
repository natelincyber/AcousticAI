import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smile, Frown, Meh, ThermometerSun } from "lucide-react";

// Define the emotion data structure
interface Emotion {
  emotion: string;
  value: number;
}

interface EmotionsChartProps {
  emotions: Record<string, number>; // Data as a record with emotion names as keys and percentage values
}

const EmotionIcon = ({ emotion }: { emotion: string }) => {
  const emotionLower = emotion.toLowerCase(); // Convert the emotion to lowercase
  switch (emotionLower) {
    case "happy":
      return <Smile className="h-4 w-4 text-yellow-400" />;
    case "sad":
      return <Frown className="h-4 w-4 text-blue-400" />;
    case "angry":
      return <Meh className="h-4 w-4 text-red-400" />;
    case "neutral":
      return <ThermometerSun className="h-4 w-4 text-gray-400" />;
    default:
      return <ThermometerSun className="h-4 w-4 text-gray-400" />;
  }
};

const EmotionsChart: React.FC<EmotionsChartProps> = ({ emotions }) => {
  // Convert the `emotions` object into an array of { emotion, value }
  const emotionData = Object.entries(emotions).map(([emotion, value]) => ({
    emotion,
    value,
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Emotions Detected</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <h3 className="text-base font-medium mb-3">Emotion Intensity</h3>
          <div className="space-y-3">
            {emotionData.map((emotion) => (
              <div key={emotion.emotion} className="flex items-center">
                <div className="w-8 flex justify-center">
                  <EmotionIcon emotion={emotion.emotion} />
                </div>
                <div className="ml-2 flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{emotion.emotion}</span>
                    <span className="text-sm text-muted-foreground">{emotion.value}%</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full"
                      style={{ width: `${emotion.value}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionsChart;
