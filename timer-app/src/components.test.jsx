import React from "react";
import { render, screen } from "@testing-library/react";
import ProgressBar from "./ProgressBar";
import TimerItem from "./TimerItem";
import TimerModal from "./TimerModal";
afterEach(() => {
  cleanup(); // Cleans up the DOM after each test
  jest.clearAllMocks(); // Clears any mocked functions or modules
});
describe("ProgressBar Component", () => {
  it("renders with the correct progress width", () => {
    render(<ProgressBar progress={50} />);
    const progressBar = screen.getByTestId("progressbar");
    expect(progressBar.firstChild).toHaveStyle("width: 50%");
  });
});

describe("TimerItem Component", () => {
  const mockTimer = {
    id: "1",
    title: "Test Timer",
    description: "This is a test timer",
    duration: 60,
    remainingTime: 30,
    isRunning: false,
  };

  it("renders the timer title and description", () => {
    render(
      <TimerItem
        timer={mockTimer}
        onEdit={() => {}}
        onDelete={() => {}}
        onToggle={() => {}}
        onReset={() => {}}
      />
    );
    expect(screen.getByText("Test Timer")).toBeInTheDocument();
    expect(screen.getByText("This is a test timer")).toBeInTheDocument();
  });

  it("renders the remaining time", () => {
    render(
      <TimerItem
        timer={mockTimer}
        onEdit={() => {}}
        onDelete={() => {}}
        onToggle={() => {}}
        onReset={() => {}}
      />
    );
    expect(screen.getByText("00:30")).toBeInTheDocument();
  });

  it("renders the progress bar", () => {
    render(
      <TimerItem
        timer={mockTimer}
        onEdit={() => {}}
        onDelete={() => {}}
        onToggle={() => {}}
        onReset={() => {}}
      />
    );
    const progressBar = screen.getByTestId("progressbar");
    expect(progressBar).toBeInTheDocument();
  });
});

describe("TimerModal Component", () => {
  it("renders the modal when isOpen is true", () => {
    render(
      <TimerModal
        isOpen={true}
        onClose={() => {}}
        onSubmit={() => {}}
        editTimer={null}
      />
    );
    expect(screen.getByText("Add New Timer")).toBeInTheDocument();
  });

  it("renders the edit modal when editTimer is provided", () => {
    const editTimer = {
      id: "1",
      title: "Test Timer",
      description: "This is a test timer",
      duration: 60,
    };
    render(
      <TimerModal
        isOpen={true}
        onClose={() => {}}
        onSubmit={() => {}}
        editTimer={editTimer}
      />
    );
    expect(screen.getByText("Edit Timer")).toBeInTheDocument();
  });
});
