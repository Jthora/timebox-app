import { fireEvent, render, screen } from "@testing-library/react";
import { runInAction } from "mobx";
import HomePage from "../pages/HomePage/HomePage";
import { TimeBlockContext } from "../context/TimeBlockContext";
import settingsStore from "../store/SettingsStore";
import { TimeBlock } from "../types/TimeBlock";

jest.mock("../components/TimerDisplay/TimerDisplay", () => ({
  __esModule: true,
  default: () => <div data-testid="timer-display" />,
}));

jest.mock("../components/TimeBoxButtons/TimeBoxButtons", () => ({
  __esModule: true,
  default: ({ isDragEnabled }: { isDragEnabled: boolean }) => (
    <div data-testid="timebox-buttons">{isDragEnabled ? "drag-on" : "drag-off"}</div>
  ),
}));

const mockTimeBlocks = [new TimeBlock("1", 15 * 60, "15 mins")];

const renderHomePage = () => {
  const contextValue = {
    timeBlocks: mockTimeBlocks,
    setTimeBlocks: jest.fn(),
  };

  return render(
    <TimeBlockContext.Provider value={contextValue}>
      <HomePage />
    </TimeBlockContext.Provider>
  );
};

describe("Queue reordering toggle", () => {
  let toggleSpy: jest.SpyInstance;

  beforeEach(() => {
    localStorage.clear();
    runInAction(() => {
      settingsStore.isDragEnabled = true;
    });
    toggleSpy = jest.spyOn(settingsStore, "toggleDragEnabled").mockImplementation(async () => {
      runInAction(() => {
        settingsStore.isDragEnabled = !settingsStore.isDragEnabled;
      });
    });
  });

  afterEach(() => {
    toggleSpy.mockRestore();
  });

  it("reflects the unlocked state when dragging is enabled", () => {
    renderHomePage();
    const toggle = screen.getByRole("checkbox", { name: /unlocked/i });
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("reflects the locked state when dragging is disabled", () => {
    runInAction(() => {
      settingsStore.isDragEnabled = false;
    });
    renderHomePage();
    const toggle = screen.getByRole("checkbox", { name: /locked/i });
    expect(toggle).toHaveAttribute("aria-checked", "true");
  });

  it("toggles between locked and unlocked states when clicked", async () => {
    renderHomePage();
    const toggle = screen.getByRole("checkbox", { name: /unlocked/i });
    fireEvent.click(toggle);
    const lockedToggle = await screen.findByRole("checkbox", { name: /locked/i });
    expect(lockedToggle).toHaveAttribute("aria-checked", "true");
    expect(toggleSpy).toHaveBeenCalled();
  });
});
