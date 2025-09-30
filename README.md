# Interactive Quiz Application

A modern, TV-friendly HTML quiz application with timer-based questions, automatic progression, and audio feedback.

## Features

- **Timer-based Questions**: 15-second countdown for each question
- **Auto-progression**: Questions advance automatically after timeout
- **Split-screen Layout**: Question on left (50%), explanation on right (50%) after timeout
- **Audio Feedback**: Ticker sounds during countdown, achievement sounds for answers
- **TV-optimized Design**: Large fonts, no scrollbars, fits single screen
- **Clean UI**: Corner-positioned timer and question counter
- **Smooth Animations**: Visual transitions and answer highlighting

## Getting Started

1. Open `src/quiz.html` in any modern web browser
2. The quiz will start automatically with audio enabled
3. Click an answer option or wait for timeout to see explanations
4. Questions automatically advance after 10 seconds of explanation viewing

## Project Structure

```
├── src/
│   └── quiz.html          # Main quiz application
├── docs/
│   └── README.md          # Original documentation
├── requirements.txt       # Dependencies (minimal)
└── README.md             # This file
```

## Technical Details

- **No Dependencies**: Pure HTML5, CSS3, and JavaScript
- **Web Audio API**: For programmatic sound generation
- **Responsive Design**: Optimized for large displays and TV viewing
- **Cross-browser Compatible**: Works in all modern browsers

## Audio Features

- Automatic audio enablement on page load
- Fallback to user interaction if browser blocks autoplay
- Ticker sounds only during main question countdown (not next question timer)
- Achievement sounds when answers are revealed

## License

Open source - feel free to use and modify.