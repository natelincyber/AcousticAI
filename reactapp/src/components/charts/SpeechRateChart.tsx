import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Data interface for pitch chart
interface PitchDataPoint {
  time: number;  // time in seconds
  pitch: number; // pitch value
}

interface PitchChartProps {
  pitchList: number[];  // array of pitch values
  timeList: number[];   // array of time values
  avgPitch: number;     // average pitch value
}

const PitchChart: React.FC<PitchChartProps> = ({ pitchList, timeList, avgPitch }) => {
  // Convert pitch data into the format needed for the chart
  const data: PitchDataPoint[] = pitchList.map((pitch, index) => ({
    time: timeList[index], // time from pitch_timelist
    pitch,                // corresponding pitch from pitch_list
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Pitch Analysis (Hz)</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <div className="mb-4 text-center">
          <div className="text-2xl font-bold">{avgPitch.toFixed(2)} Hz</div>
          <div className="text-sm text-muted-foreground">Average pitch</div>
        </div>
        <ResponsiveContainer width="100%" height="70%">
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" tick={{ fill: "#f8fafc" }} />
            <YAxis tick={{ fill: "#f8fafc" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1E293B",
                borderColor: "#334155",
                color: "#f8fafc",
              }}
            />
            <Line
              type="monotone"
              dataKey="pitch"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ r: 4, fill: "#0EA5E9" }}
              activeDot={{ r: 6, fill: "#0EA5E9" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PitchChart;
