export interface TimerFormValues {
  title: string;
  hours: number;
  minutes: number;
  seconds: number;
}

export const validateTimerForm = (values: TimerFormValues) => {
  const errors: { [key: string]: string } = {};

  if (!values.title.trim()) {
    errors.title = "Title is required";
  }

  if (values.hours === 0 && values.minutes === 0 && values.seconds === 0) {
    errors.duration = "Duration must be greater than 0";
  }

  return errors;
};