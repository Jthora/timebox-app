import { Howl } from "howler";
import completeSound from "../assets/sounds/soft-attack-alert.wav";
import startSound from "../assets/sounds/microwave-beep.wav";
import defaultButtonSound from "../assets/sounds/beep5a.wav";

class AudioPlayer {
  private static currentSounds: Howl[] = [];

  public static playSound(src: string) {
    const sound = new Howl({ src: [src] });
    sound.play();
    this.currentSounds.push(sound);
    sound.on('end', () => {
      this.currentSounds = this.currentSounds.filter(s => s !== sound);
    });
  }

  public static stopAllSounds() {
    this.currentSounds.forEach(sound => sound.stop());
    this.currentSounds = [];
  }

  public static playCompleteSound() {
    this.playSound(completeSound);
  }

  public static playStartSound() {
    this.playSound(startSound);
  }

  public static playDefaultButtonSound() {
    this.playSound(defaultButtonSound);
  }

  public static playPauseSound() {
    this.playSound(defaultButtonSound);
  }

  public static playResetSound() {
    this.playSound(defaultButtonSound);
  }
}

export default AudioPlayer;
