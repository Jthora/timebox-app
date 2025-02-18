import { useEffect, useState } from "react";
import AudioPlayer from "../utils/AudioPlayer";

const useAudio = (url: string) => {
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    if (playing) {
      AudioPlayer.stopAllSounds();
    }
    setPlaying(!playing);
  };

  useEffect(() => {
    if (playing) {
      AudioPlayer.playSound(url);
    }
  }, [playing, url]);

  return [playing, toggle] as const;
};

export default useAudio;