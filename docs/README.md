# SOF Quiz Video Generator

Automatically generates engaging quiz videos with audio narration from JSON question data for Science Olympiad Foundation computer science questions.

## Features

- 🎥 **Animated Quiz Videos**: Creates professional-looking quiz videos
- 🔊 **Text-to-Speech Audio**: Automatic narration for questions and answers
- 🎨 **Quiz-Style Visuals**: Clean, colorful design optimized for learning
- ⏱️ **Timing Control**: Built-in thinking time and pacing
- 📝 **Explanations**: Includes detailed explanations for each answer

## Quick Start

1. **Setup**:
   ```bash
   ./setup.sh
   ```

2. **Generate Sample Video**:
   ```bash
   python3 quiz_video_generator.py
   ```
   Choose option 1 to generate a sample video.

3. **Generate All Videos**:
   ```bash
   python3 quiz_video_generator.py
   ```
   Choose option 2 to generate videos for all 20 questions.

## Files Included

- `grade3_computer_questions.json` - 20 SOF-style questions with explanations
- `quiz_video_generator.py` - Main video generation script
- `requirements.txt` - Python dependencies
- `setup.sh` - Installation script

## Video Structure

Each generated video includes:

1. **Question Display** (8+ seconds)
   - Question number and text
   - Multiple choice options (A, B, C, D)
   - Audio narration of question and options

2. **Thinking Time** (3 seconds)
   - Countdown timer (3, 2, 1)
   - Gives viewers time to think

3. **Answer Reveal** (10+ seconds)
   - Correct answer highlighted in green
   - Detailed explanation
   - Audio narration of answer and explanation

## Customization

You can modify the script to:
- Change colors and styling
- Adjust timing for each section
- Modify text-to-speech voice settings
- Add background music
- Change video resolution

## Generated Output

Videos are saved as MP4 files in the `videos/` folder:
- `question_01.mp4`, `question_02.mp4`, etc.
- Ready for upload to YouTube, social media, or educational platforms

## Technical Requirements

- Python 3.7+
- Internet connection (for text-to-speech)
- ~2GB free space for generated videos
- FFmpeg (installed automatically with moviepy)

## Troubleshooting

**Audio Issues**: Ensure internet connection for Google Text-to-Speech
**Font Issues**: Script will fall back to default fonts if system fonts aren't found
**Memory Issues**: Generate videos one at a time if you encounter memory problems