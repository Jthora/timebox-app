import { useEffect, useState } from "react";

const useAudio = (url: string) => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    //console.log(`Toggling audio: ${url}, playing: ${!playing}`);
    setPlaying(!playing);
  };

  useEffect(() => {
    if (playing) {
      //console.log(`Playing audio: ${url}`);
      audio.play().catch((error) => {
        console.error(`Error playing audio: ${url}`, error);
      });
    } else {
      //console.log(`Pausing audio: ${url}`);
      audio.pause();
    }
  }, [playing, audio]);

  useEffect(() => {
    const handleEnded = () => {
      //console.log(`Audio ended: ${url}`);
      setPlaying(false);
    };
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audio]);

  useEffect(() => {
    const handleError = (error: Event) => {
      console.error(`Audio error: ${url}`, error);
    };
    audio.addEventListener("error", handleError);
    return () => {
      audio.removeEventListener("error", handleError);
    };
  }, [audio]);

  return [playing, toggle] as const;
};

export default useAudio;