import React from "react";

type TimeboxProps = {
  recordingTime: number;
  isRecording: boolean;
};

const Timebox: React.FC<TimeboxProps> = ({ recordingTime, isRecording }) => (
  <g id="timebox" transform="translate(234 178)">
    <rect id="timebox-bg" width={135} height={20} fill="#0A0D10" rx={4} />
    <text
      id="recordingText"
      x="67.5"
      y="10"
      fill={isRecording ? "#FF4D4D" : "#36C77C"}
      fontFamily="Helvetica"
      fontSize={13}
      textAnchor="middle"
      dominantBaseline="middle"
    >
      {isRecording ? "Recording" : "Ready!"}
      {isRecording && (
        <animate
          attributeName="opacity"
          values="1;0.3;1"
          dur="1.2s"
          repeatCount="indefinite"
        />
      )}
    </text>
  </g>
);

export default Timebox;
