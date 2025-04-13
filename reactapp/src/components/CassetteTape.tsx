import React, { useEffect, useRef, useState } from "react";
import {
  Background,
  Buttons,
  Cassette,
  Center,
  Timebox,
  TrackTitle,
} from "./cassette/index";
import { ThemeProvider } from "../core/ThemeContext";
import useAudioRecorder from "./recorder/audio-recorder";
import Wrapper from "./Wrapper";

const CassetteTape = ({ vizColor }) => {
  const {
    isRecording,
    stopRecording,
    setIsRecording,
    mediaRecorderRef,
    streamRef,
    audioChunksRef,
    recordingTime
  } = useAudioRecorder();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [playlist, setPlaylist] = useState<string[]>([]);
  const [recordingUrls, setRecordingUrls] = useState<string[]>([]);
  const [transcription, setTranscription] = useState<string | null>(null);

  const cassetteRef = useRef(null);
  const audioRef = useRef<HTMLAudioElement>(new Audio());

  const dir = "audio/";
  const ext = ".mp3";

  useEffect(() => {
    const audio = audioRef.current;
    audio.addEventListener("ended", () => {
      audio.currentTime = 0;
      audio.play();
    });

    return () => {
      audio.removeEventListener("ended", () => {});
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (playlist[currentTrack]) {
      audio.src = dir + playlist[currentTrack] + ext;
      if (isPlaying) audio.play();
    }
  }, [currentTrack]);

  const play = () => {
    const audio = audioRef.current;

    if (playlist.length === 0) return;

    audio.src = dir + playlist[currentTrack] + ext;

    if (!isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }

    setIsPlaying((prev) => !prev);
  };

  const record = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      setIsRecording(true);
      // Request user media and setup MediaRecorder
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      audioChunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.start();
    }

    
  };

  const prevTrack = () => {
    setCurrentTrack((prev) =>
      prev > 0 ? prev - 1 : playlist.length - 1
    );
  };

  const nextTrack = () => {
    setCurrentTrack((prev) =>
      prev === playlist.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <ThemeProvider value={{ vizColor }}>
      <Wrapper ref={cassetteRef} className="cassette-wrapper" vizColor={vizColor}>
        <Cassette>
          <Center isPlaying={false} isRecording={isRecording} />
          <Timebox recordingTime={recordingTime} isRecording={isRecording}/>
          <TrackTitle title={playlist[currentTrack] || ""} />
          <Background />
          <Buttons
            play={play}
            record={record}
            stopRecording={stopRecording}
            isPlaying={false}
            isRecording={isRecording}
            prevTrack={prevTrack}
            nextTrack={nextTrack}
          />
        </Cassette>
      </Wrapper>
    </ThemeProvider>
  );
};

export default CassetteTape;
