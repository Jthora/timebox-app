import { TimeBlock } from "../types/TimeBlock"; // Import TimeBlock type

class GlobalTimer {
  private static instance: GlobalTimer;
  private interval: NodeJS.Timeout | null = null;
  private timeLeft: number = 0;
  private isRunning: boolean = false;
  private onTickCallback: ((timeLeft: number) => void) | null = null;
  private onCompleteCallback: ((currentTimeBlock: TimeBlock) => void) | null = null;
  private currentTimeBlock: TimeBlock | null = null;

  private constructor() {}

  public static getInstance(): GlobalTimer {
    if (!GlobalTimer.instance) {
      GlobalTimer.instance = new GlobalTimer();
    }
    return GlobalTimer.instance;
  }

  public start(time: number, currentTimeBlock: TimeBlock, onTick: (timeLeft: number) => void, onComplete: (currentTimeBlock: TimeBlock) => void): void {
    this.timeLeft = time;
    this.currentTimeBlock = currentTimeBlock;
    this.onTickCallback = onTick;
    this.onCompleteCallback = onComplete;
    this.isRunning = true;

    this.interval = setInterval(() => {
      this.timeLeft -= 1;
      if (this.onTickCallback) {
        this.onTickCallback(this.timeLeft);
      }
      if (this.timeLeft <= 0) {
        this.stop();
        if (this.onCompleteCallback) {
          this.onCompleteCallback(this.currentTimeBlock!);
        }
      }
    }, 1000);
  }

  public stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isRunning = false;
  }

  public getTimeLeft(): number {
    return this.timeLeft;
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }
}

export default GlobalTimer;
