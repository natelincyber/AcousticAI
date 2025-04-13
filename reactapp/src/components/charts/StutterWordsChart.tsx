import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface StutterWord {
  word: string;
  num_stutter: number; // updated key
}

interface StutterWordsChartProps {
  words: StutterWord[];
}

const StutterWordsChart: React.FC<StutterWordsChartProps> = ({ words }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Stuttered Words</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={words}
            margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
          >
            <XAxis
              dataKey="word"
              tick={{ fill: "#f8fafc" }}
              angle={-45}
              textAnchor="end"
              height={70}
            />
            <YAxis tick={{ fill: "#f8fafc" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1E293B",
                borderColor: "#334155",
                color: "#f8fafc",
              }}
            />
            <Bar
              dataKey="num_stutter" // updated here
              fill="#1E40AF"
              radius={[4, 4, 0, 0]}
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default StutterWordsChart;
