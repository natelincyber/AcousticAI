import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Info } from "lucide-react";

interface AdviceItem {
  type: "positive" | "improvement";
  text: string;
}

interface SpeechAdviceProps {
  actionableComments: Array<{ suggestion: string; suggestion_type: boolean }>;
}

const SpeechAdvice: React.FC<SpeechAdviceProps> = ({ actionableComments }) => {
  // Map actionable comments to the expected AdviceItem structure
  const advice: AdviceItem[] = actionableComments.map((comment) => ({
    type: comment.suggestion_type ? "improvement" : "positive",
    text: comment.suggestion,
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Speech Advice</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {advice.map((item, index) => (
            <div
              key={index}
              className={`flex items-start p-4 rounded-md ${
                item.type === "positive" ? "bg-green-900/20" : "bg-amber-900/20"
              }`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full mr-3 ${
                  item.type === "positive" ? "bg-green-600" : "bg-amber-600"
                }`}
              >
                {item.type === "positive" ? (
                  <Check className="h-5 w-5 text-white" />
                ) : (
                  <Info className="h-5 w-5 text-white" />
                )}
              </div>
              <div className="flex-1">
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SpeechAdvice;
