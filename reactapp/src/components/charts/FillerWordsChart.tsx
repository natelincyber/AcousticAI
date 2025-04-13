import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface FillerWordsChartProps {
  words: { [word: string]: number };
}

const FillerWordsChart: React.FC<FillerWordsChartProps> = ({ words }) => {
  const COLORS = ["#0EA5E9", "#3B82F6", "#1E40AF", "#1E3A8A", "#0C4A6E"];

  const transformedData = Object.entries(words)
    .map(([word, count]) => ({ word, count }))
    .filter((item) => item.count > 0); // avoid zero-values

  return (
    <Card className="w-full">
      <CardHeader className="mb-4">
        <CardTitle className="text-lg">Filler Words</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        {transformedData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={transformedData}
                dataKey="count"
                nameKey="word"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ word, percent }) =>
                  `${word}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {transformedData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-muted-foreground">No filler words found.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default FillerWordsChart;
