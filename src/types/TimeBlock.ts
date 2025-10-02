export class TimeBlock {
  id: string;
  time: number;
  label: string;

  constructor(id: string, time: number, label: string) {
    this.id = id;
    this.time = time;
    this.label = label;
  }

  static fromJSON(json: any): TimeBlock {
    return new TimeBlock(json.id, json.time, json.label);
  }

  toJSON() {
    return {
      id: this.id,
      time: this.time,
      label: this.label,
    };
  }
}