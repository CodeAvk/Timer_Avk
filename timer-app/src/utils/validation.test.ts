import { validateTimerForm } from "./validation";

describe("validateTimerForm", () => {
  it("should return an error if the title is empty", () => {
    const values = { title: "", hours: 1, minutes: 0, seconds: 0 };
    const errors = validateTimerForm(values);
    expect(errors.title).toBe("Title is required");
  });

  it("should return an error if the duration is zero", () => {
    const values = { title: "Test Timer", hours: 0, minutes: 0, seconds: 0 };
    const errors = validateTimerForm(values);
    expect(errors.duration).toBe("Duration must be greater than 0");
  });

  it("should return no errors if the form is valid", () => {
    const values = { title: "Test Timer", hours: 1, minutes: 30, seconds: 0 };
    const errors = validateTimerForm(values);
    expect(Object.keys(errors)).toHaveLength(0);
  });
});