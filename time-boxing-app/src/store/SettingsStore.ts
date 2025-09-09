import { makeAutoObservable } from "mobx";
import { TimeBlock } from "../types/TimeBlock"; // Import TimeBlock class

class SettingsStore {
    isDragEnabled: boolean;
    defaultTimeBlocks: TimeBlock[];
    timeBlocks: TimeBlock[]; // observable current editable list
    logs: string[] = [];

    constructor() {
        this.isDragEnabled = true;
    this.defaultTimeBlocks = [
        new TimeBlock('1', 15 * 60, '15 mins'),
        new TimeBlock('2', 30 * 60, '30 mins'),
        new TimeBlock('3', 60 * 60, '1 hr'),
        new TimeBlock('4', 2.5 * 60 * 60, '2.5 hrs'),
        new TimeBlock('5', 4 * 60 * 60, '4 hrs'),
        ];
    this.timeBlocks = [...this.defaultTimeBlocks];
        this.logs = [];
        makeAutoObservable(this);
        this.initialize();
    }

    async initialize() {
        this.isDragEnabled = await this.loadFromLocalStorage("isDragEnabled", true);
        const storedBlocks = await this.loadFromLocalStorage("timeBlocks", this.defaultTimeBlocks);
        this.defaultTimeBlocks = storedBlocks; // keep original semantic
        this.timeBlocks = storedBlocks;
        this.logs = await this.loadFromLocalStorage("logs", []);
    }

    async loadFromLocalStorage<T>(key: string, defaultValue: T): Promise<T> {
        try {
        const storedValue = localStorage.getItem(key);
        console.log(`Loaded ${key} from localStorage`);
        if (storedValue) {
            const parsedValue = JSON.parse(storedValue);
            if (key === "timeBlocks") {
            return parsedValue.map((block: any) => TimeBlock.fromJSON(block)) as unknown as T;
            }
            return parsedValue;
        } else {
            console.log(`Default TimeBlocks Saved on Load from Local Storage ${key} from localStorage`);
            await this.saveToLocalStorage(key, defaultValue);
            return defaultValue;
        }
        } catch (error) {
        console.error(`Error loading ${key} from localStorage`, error);
        return defaultValue;
        }
    }

    async saveToLocalStorage(key: string, value: any): Promise<void> {
        try {
        localStorage.setItem(key, JSON.stringify(value));
        console.log(`Saved ${key} to localStorage`);
        } catch (error) {
        console.error(`Error saving ${key} to localStorage`, error);
        }
    }

    async toggleDragEnabled(): Promise<void> {
        this.isDragEnabled = !this.isDragEnabled;
        console.log(`toggleDragEnabled: ${this.isDragEnabled}`);
        await this.saveToLocalStorage("isDragEnabled", this.isDragEnabled);
    }

    getDefaultTimeBlocks(): TimeBlock[] {
        return this.defaultTimeBlocks;
    }

    async getTimeBlocks(): Promise<TimeBlock[]> {
        // Return in-memory observable list (already synced on mutations)
        return this.timeBlocks;
    }

    async setTimeBlocks(blocks: TimeBlock[]): Promise<void> {
        if (Array.isArray(blocks) && blocks.every(block => block.id && block.label && block.time)) {
        this.timeBlocks = blocks;
        await this.saveToLocalStorage("timeBlocks", blocks.map(block => block.toJSON()));
        console.log("Time blocks updated successfully");
        } else {
        console.error("Invalid TimeBlock array");
        }
    }

    async clearSessionHistory(): Promise<void> {
        console.log("clearSessionHistory");
        await this.saveToLocalStorage("logs", []);
    }

    async addLog(log: string): Promise<void> {
        const currentTime = new Date().toISOString();
        this.logs.push(`${currentTime}: ${log}`);
        await this.saveToLocalStorage("logs", this.logs);
    }

    getLogs(): string[] {
        return this.logs;
    }
}

const settingsStore = new SettingsStore();
export default settingsStore;
