import { motion, AnimatePresence } from "framer-motion";

interface TranscriptionDisplayProps {
  transcription: string | null;
  transcriptionComplete: boolean;
}

const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({
  transcription,
  transcriptionComplete,
}) => {
  console.log("Transcription:", transcription);
  console.log("Complete:", transcriptionComplete);

  const show = transcriptionComplete && !!transcription;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="transcription"
          className="mt-8 max-w-6xl mx-auto p-6 bg-gray-800 text-white text-xl font-medium rounded-xl shadow-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.6 }}
        >
          {/* Transcription Title */}
          <h3 className="text-2xl font-bold mb-4 text-center">Transcription</h3>

          {/* Transcription Text */}
          <div className="text-center whitespace-pre-wrap">
            {transcription}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TranscriptionDisplay;
