import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TimerApp from "./TimerApp";

describe("TimerApp Component", () => {
  it("renders the Timer App title", () => {
    render(<TimerApp />);
    expect(screen.getByText("Timer App")).toBeInTheDocument();
  });

  it("opens the modal when 'Add Timer' button is clicked", () => {
    render(<TimerApp />);
    fireEvent.click(screen.getByText("Add Timer"));
    expect(screen.getByText("Add New Timer")).toBeInTheDocument();
  });

  it("adds a new timer when the form is submitted", () => {
    render(<TimerApp />);
    fireEvent.click(screen.getByText("Add Timer"));

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText("Timer Title *"), {
      target: { value: "Test Timer" },
    });
    fireEvent.change(screen.getByPlaceholderText("Hours"), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByPlaceholderText("Minutes"), {
      target: { value: "30" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Add Timer"));

    // Check if the timer is added
    expect(screen.getByText("Test Timer")).toBeInTheDocument();
  });

  it("deletes a timer when the delete button is clicked", () => {
    render(<TimerApp />);
    fireEvent.click(screen.getByText("Add Timer"));

    // Add a timer
    fireEvent.change(screen.getByPlaceholderText("Timer Title *"), {
      target: { value: "Test Timer" },
    });
    fireEvent.change(screen.getByPlaceholderText("Hours"), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByPlaceholderText("Minutes"), {
      target: { value: "30" },
    });
    fireEvent.click(screen.getByText("Add Timer"));

    // Delete the timer
    fireEvent.click(screen.getByLabelText("Delete"));
    expect(screen.queryByText("Test Timer")).not.toBeInTheDocument();
  });
});