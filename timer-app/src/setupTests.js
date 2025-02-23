import "@testing-library/jest-dom";

// Mock HTMLMediaElement methods
window.HTMLMediaElement.prototype.play = jest.fn();
window.HTMLMediaElement.prototype.pause = jest.fn();