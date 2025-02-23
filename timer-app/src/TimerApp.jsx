import React, { useState, useEffect, useRef } from "react";
import { Button, ProgressBar, TimerItem, TimerModal, formatTime } from "./components";
import { X, Play, Pause, Edit, Trash, RotateCcw } from "lucide-react";

const TimerApp = () => {
  const [timers, setTimers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTimer, setEditingTimer] = useState(null);
  const [snackbar, setSnackbar] = useState(null);
  const audioRef = useRef(new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"));
  const snackbarIntervalRef = useRef(null);

  // Load timers from localStorage on initial mount
  useEffect(() => {
    const savedTimers = localStorage.getItem("timers");
    if (savedTimers) {
      setTimers(JSON.parse(savedTimers));
    }
  }, []);

  // Save timers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("timers", JSON.stringify(timers));
  }, [timers]);

  // Timer update interval
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prevTimers) =>
        prevTimers.map((timer) => {
          if (!timer.isRunning) return timer;

          const newRemainingTime = Math.max(0, timer.remainingTime - 1);

          if (newRemainingTime === 0 && timer.remainingTime !== 0) {
            showSnackbar(`Timer "${timer.title}" has ended!`, timer.id);
          }
          

          return {
            ...timer,
            remainingTime: newRemainingTime,
            isRunning: newRemainingTime > 0,
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Snackbar and audio notification management
  useEffect(() => {
    if (snackbar) {
      audioRef.current.play().catch(error => {
        console.error("Audio playback failed:", error);
      });
      
      snackbarIntervalRef.current = setInterval(() => {
        audioRef.current.play().catch(error => {
          console.error("Audio replay failed:", error);
        });
      }, 3000);
    }

    return () => {
      if (snackbarIntervalRef.current) {
        clearInterval(snackbarIntervalRef.current);
      }
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    };
  }, [snackbar]);


  const showSnackbar = (message, timerId) => {
    setSnackbar({ message, timerId });
  };

  const handleSnackbarDismiss = () => {
    if (snackbarIntervalRef.current) {
      clearInterval(snackbarIntervalRef.current);
      snackbarIntervalRef.current = null;
    }
  
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  
    setSnackbar(null);
  };
  
  

  const handleAddOrUpdateTimer = (timerData) => {
    if (timerData.id) {
      // Update existing timer
      setTimers((prev) =>
        prev.map((t) =>
          t.id === timerData.id
            ? {
                ...t,
                ...timerData,
                remainingTime: timerData.duration,
                isRunning: false,
              }
            : t
        )
      );
    } else {
      // Add new timer
      const timer = {
        ...timerData,
        id: Date.now().toString(),
        remainingTime: timerData.duration,
        isRunning: false,
      };
      setTimers((prev) => [...prev, timer]);
    }
  };

  const handleEdit = (timer) => {
    setEditingTimer(timer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTimer(null);

    
    // Add audio cleanup when closing modal
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      // Clear any active snackbar intervals
      if (snackbarIntervalRef.current) {
        clearInterval(snackbarIntervalRef.current);
        snackbarIntervalRef.current = null;
      }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Timer App</h1>
        <Button onClick={() => setIsModalOpen(true)} className="px-4 py-2">
          Add Timer
        </Button>
      </div>

      {timers.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          <div className="w-24 h-24 mx-auto mb-4 border-2 border-gray-300 rounded-full flex items-center justify-center">
            <span className="text-4xl">⏰</span>
          </div>
          <p>No timers yet. Add one to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {timers.map((timer) => (
            <TimerItem
              key={timer.id}
              timer={timer}
              onEdit={() => handleEdit(timer)}
              onDelete={() => {
                setTimers((prev) => {
                  const newTimers = prev.filter((t) => t.id !== timer.id);
                  
                  // Check if the deleted timer matches the snackbar's timer ID
                  if (snackbar?.timerId === timer.id) {
                    handleSnackbarDismiss();
                  }
                  
                  return newTimers;
                });
              }}
              
              onToggle={() => {
                setTimers((prev) =>
                  prev.map((t) =>
                    t.id === timer.id ? { ...t, isRunning: !t.isRunning } : t
                  )
                );
              }}
              onReset={() => {
                setTimers((prev) =>
                  prev.map((t) =>
                    t.id === timer.id
                      ? { ...t, remainingTime: t.duration, isRunning: false }
                      : t
                  )
                );
              }}
            />
          ))}
        </div>
      )}

      <TimerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddOrUpdateTimer}
        editTimer={editingTimer}
      />

      {snackbar && (
        <div
          className={`fixed ${
            window.innerWidth > 768 ? "top-4 right-4" : "bottom-4 left-4 right-4"
          } bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center justify-between min-w-[200px] z-50 shadow-lg`}
        >
          <span>{snackbar.message}</span>
          <button
            onClick={handleSnackbarDismiss}
            className="ml-4 hover:text-gray-300 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default TimerApp;