import React, { Component } from "react";
import { ThemeConsumer } from "../core/ThemeContext";
import debounce from "lodash/debounce";

class AudioVisualization extends Component {
  constructor(props) {
    super(props);
    this.state = { width: window.innerWidth, height: window.innerHeight };
    this.canvasRef = React.createRef();
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.bufferLength = 0;
    this.dataArray = null;
    this.initUpdateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.updateWindowDimensions = debounce(this.updateWindowDimensions.bind(this), 200);
  }

  componentDidMount() {
    this.initUpdateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
    this.setupAudio();
    this.animate();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
    if (this.microphoneStream) {
      this.microphoneStream.getTracks().forEach(track => track.stop());
    }
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  setupAudio() {
    // Get audio stream from microphone
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(stream => {
        const source = this.audioContext.createMediaStreamSource(stream);
        source.connect(this.analyser);
        this.analyser.fftSize = 2048; // Set FFT size to determine how finely the frequency data is divided
        this.bufferLength = this.analyser.frequencyBinCount;
        
        // Initialize the data array to store the frequency data
        this.dataArray = new Uint8Array(this.bufferLength);
      })
      .catch(err => {
        console.error("Audio input failed:", err);
      });
  }

  animate() {
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear canvas
    ctx.clearRect(0, 0, this.state.width, this.state.height);

    // Get frequency data from the analyser
    this.analyser.getByteFrequencyData(this.dataArray);

    // Visualize the data
    ctx.fillStyle = "#FFFFFF";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#FFFFFF";
    ctx.beginPath();

    const barWidth = (this.state.width / this.bufferLength) * 2.5;
    let x = 0;

    for (let i = 0; i < this.bufferLength; i++) {
      const barHeight = this.dataArray[i];

      // Draw each bar of the frequency spectrum
      ctx.fillRect(x, this.state.height - barHeight, barWidth, barHeight);

      x += barWidth + 1;
    }

    // Request the next frame
    requestAnimationFrame(this.animate.bind(this));
  }

  render() {
    const { width, height } = this.state;

    return (
      <ThemeConsumer>
        {context => (
          <div style={{ backgroundColor: context.vizColor }}>
            <canvas
              ref={this.canvasRef}
              width={width}
              height={height}
              style={{ backgroundColor: context.vizColor }}
            />
          </div>
        )}
      </ThemeConsumer>
    );
  }
}

export default AudioVisualization;
