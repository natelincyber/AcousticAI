
import React from "react";
import { Mic, MicOff, Pause, Play, Square } from "lucide-react";

interface RecordingControlsProps {
  isRecording: boolean;
  isPaused: boolean;
  onRecord: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

const RecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  isPaused,
  onRecord,
  onPause,
  onResume,
  onStop,
}) => {
  return (
    <div className="cassette-controls flex justify-center items-center gap-6 relative">
      {/* Decorative knobs and elements */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-10 bg-gradient-to-b from-slate-500 to-slate-700 rounded-full border border-slate-600"></div>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-10 bg-gradient-to-b from-slate-500 to-slate-700 rounded-full border border-slate-600"></div>
      
      {/* Control panel texture */}
      <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none">
        <div className="w-full h-full bg-repeat" style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"20\" height=\"20\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M0 0h20v20H0z\" fill=\"%23FFFFFF\" fill-opacity=\"0.1\"/%3E%3Cpath d=\"M0 10h20v1H0z\" fill=\"%23FFFFFF\" fill-opacity=\"0.15\"/%3E%3Cpath d=\"M10 0v20h1V0z\" fill=\"%23FFFFFF\" fill-opacity=\"0.15\"/%3E%3C/svg%3E')"
        }}></div>
      </div>
      
      {/* Buttons with analog design */}
      {!isRecording ? (
        <button
          className="control-button control-button-record relative overflow-hidden"
          onClick={onRecord}
          aria-label="Start Recording"
        >
          <span className="control-button-highlight"></span>
          <span className="control-button-shadow"></span>
          <Mic size={24} />
        </button>
      ) : (
        <>
          {isPaused ? (
            <button
              className="control-button control-button-play relative overflow-hidden"
              onClick={onResume}
              aria-label="Resume Recording"
            >
              <span className="control-button-highlight"></span>
              <span className="control-button-shadow"></span>
              <Play size={24} />
            </button>
          ) : (
            <button
              className="control-button control-button-pause relative overflow-hidden"
              onClick={onPause}
              aria-label="Pause Recording"
            >
              <span className="control-button-highlight"></span>
              <span className="control-button-shadow"></span>
              <Pause size={24} />
            </button>
          )}
          <button
            className="control-button control-button-stop relative overflow-hidden"
            onClick={onStop}
            aria-label="Stop Recording"
          >
            <span className="control-button-highlight"></span>
            <span className="control-button-shadow"></span>
            <Square size={20} />
          </button>
        </>
      )}
      
      {/* Additional decorative elements */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-slate-400/30 to-transparent"></div>
    </div>
  );
};

export default RecordingControls;
