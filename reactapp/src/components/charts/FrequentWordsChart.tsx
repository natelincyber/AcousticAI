import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface FrequentWordsChartProps {
  words: { [word: string]: number }; // Dictionary with word as key and frequency as value
}

const FrequentWordsChart: React.FC<FrequentWordsChartProps> = ({ words }) => {
  // Convert the dictionary of words into an array of objects
  const transformedData = Object.entries(words).map(([word, count]) => ({
    word: word,
    count: count,
  }));

  // Calculate the maximum count for scaling the bar height
  const maxCount = Math.max(...transformedData.map((data) => data.count));

  return (
    <Card className="w-full">
      <CardHeader className="mb-4">
        <CardTitle className="text-lg">Top Frequently Used Words</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={transformedData}
            layout="vertical"
          >
            <XAxis type="number" />
            <YAxis
              dataKey="word"
              type="category"
              tick={{ fill: "#f8fafc", fontSize: 12 }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e40af",
                borderColor: "#1e40af",
                color: "#f8fafc",
              }}
            />
            <Bar
              dataKey="count"
              fill="#0EA5E9"
              radius={[0, 4, 4, 0]}
              yAxisId={0}
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default FrequentWordsChart;