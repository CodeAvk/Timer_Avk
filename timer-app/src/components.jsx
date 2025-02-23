import React, { useState, useEffect } from "react";
import { X, Play, Pause, Edit, Trash, RotateCcw } from "lucide-react";

// Utility functions
const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

// Reusable Button Component
const Button = ({ variant = 'primary', children, className = '', ...props }) => {
  const baseStyles = "rounded-lg transition-colors";
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300",
    secondary: "bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50",
    danger: "bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className} disabled:cursor-not-allowed`}
      {...props}
    >
      {children}
    </button>
  );
};

// Progress Bar Component
const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-1">
      <div
        className="h-full bg-blue-500 rounded-full transition-all duration-1000"
        style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
      />
    </div>
  );
};

// Timer Item Component
const TimerItem = ({ timer, onEdit, onDelete, onToggle, onReset }) => {
  const progress = ((timer.duration - timer.remainingTime) / timer.duration) * 100;
  const isCompleted = timer.remainingTime === 0;

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-4">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="font-medium">{timer.title}</h3>
          {timer.description && (
            <p className="text-sm text-gray-500">{timer.description}</p>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="secondary" className="p-1" onClick={onEdit}>
            <Edit size={16} />
          </Button>
          <Button variant="danger" className="p-1" onClick={onDelete}>
            <Trash size={16} />
          </Button>
          <Button variant="secondary" className="p-1" onClick={onReset}>
            <RotateCcw size={16} />
          </Button>
        </div>
      </div>

      <div className="text-3xl font-mono text-center mb-4">
  {timer.remainingTime === 0 ? (
    <span className="text-red-500 font-semibold">{timer.title} has ended!</span>
  ) : (
    formatTime(timer.remainingTime)
  )}
</div>


      <div className="space-y-4">
        <ProgressBar progress={progress} />

        <div className="flex justify-center">
          {isCompleted ? (
            <Button
              onClick={onReset}
              className="bg-green-500 text-white rounded-full p-2 hover:bg-green-600"
            >
              <RotateCcw size={24} />
            </Button>
          ) : (
            <Button
              onClick={onToggle}
              className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600"
            >
              {timer.isRunning ? <Pause size={24} /> : <Play size={24} />}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// Timer Modal Component
const TimerModal = ({ isOpen, onClose, onSubmit, editTimer = null }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editTimer) {
      setTitle(editTimer.title);
      setDescription(editTimer.description || "");
      const totalSeconds = editTimer.duration;
      setHours(Math.floor(totalSeconds / 3600));
      setMinutes(Math.floor((totalSeconds % 3600) / 60));
      setSeconds(totalSeconds % 60);
    } else {
      resetForm();
    }
  }, [editTimer, isOpen]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setHours(0);
    setMinutes(0);
    setSeconds(0);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (hours === 0 && minutes === 0 && seconds === 0) {
      newErrors.duration = "Duration must be greater than 0";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const duration = hours * 3600 + minutes * 60 + seconds;
    onSubmit({
      id: editTimer?.id,
      title,
      description,
      duration,
    });
    onClose();
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {editTimer ? "Edit Timer" : "Add New Timer"}
          </h2>
          <Button variant="secondary" onClick={onClose}>
            <X size={24} />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Timer Title *"
              className={`w-full border rounded-lg px-3 py-2 ${
                errors.title ? "border-red-500" : ""
              }`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <textarea
              placeholder="Description (optional)"
              className="w-full border rounded-lg px-3 py-2 h-20"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration *
            </label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <input
                  type="number"
                  min="0"
                  max="23"
                  placeholder="Hours"
                  className={`w-full border rounded-lg px-3 py-2 ${
                    errors.duration ? "border-red-500" : ""
                  }`}
                  value={hours}
                  onChange={(e) =>
                    setHours(Math.min(23, Math.max(0, parseInt(e.target.value) || 0)))
                  }
                />
              </div>
              <div>
                <input
                  type="number"
                  min="0"
                  max="59"
                  placeholder="Minutes"
                  className={`w-full border rounded-lg px-3 py-2 ${
                    errors.duration ? "border-red-500" : ""
                  }`}
                  value={minutes}
                  onChange={(e) =>
                    setMinutes(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))
                  }
                />
              </div>
              <div>
                <input
                  type="number"
                  min="0"
                  max="59"
                  placeholder="Seconds"
                  className={`w-full border rounded-lg px-3 py-2 ${
                    errors.duration ? "border-red-500" : ""
                  }`}
                  value={seconds}
                  onChange={(e) =>
                    setSeconds(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))
                  }
                />
              </div>
            </div>
            {errors.duration && (
              <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="secondary" onClick={onClose} className="px-4 py-2">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="px-4 py-2">
            {editTimer ? "Update Timer" : "Add Timer"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export { Button, ProgressBar, TimerItem, TimerModal, formatTime };