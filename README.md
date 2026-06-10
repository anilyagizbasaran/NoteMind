# NoteMind

**AI-powered lecture note summarizer and quiz generator**

NoteMind is a web application for students. You paste a lecture note, and the app uses Google's
Gemini model to create a **summary** (overview, key points and important terms) and a **quiz
with 5 multiple-choice questions** so you can test yourself. It works in Turkish and English.

## Features

- **Summary**: a short overview, 4-6 key points, and the important terms with definitions
- **Quiz**: 5 multiple-choice questions with instant feedback, explanations and a final score
- **Two languages**: the interface and the generated content work in Turkish and English
- **History**: old results are saved in the browser and can be opened again without a new API call
- **Cooldown**: a 15-second wait after each request, so you cannot spam the API by accident
- **AI warning**: the app reminds you to check the AI output against your original notes

## Requirements

- Node.js 18.18 or newer
- npm (comes with Node.js)
- A free Gemini API key from https://aistudio.google.com/apikey

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/anilyagizbasaran/NoteMind.git
   cd NoteMind
   ```
2. Install the packages:
   ```bash
   npm install
   ```
3. Create a file called `.env.local` in the project folder (you can copy `.env.local.example`)
   and put your API key in it:
   ```
   GEMINI_API_KEY=your_key_here
   ```
4. Start the app:
   ```bash
   npm run dev
   ```
5. Open http://localhost:3000 in your browser.

For a production build: `npm run build` and then `npm start`.

## How to Use

1. Choose your language with the **TR / EN** buttons in the top-right corner. This changes both
   the interface and the language of the generated summary and questions.
2. Paste your lecture note into the text area. The counter shows how many of the 8,000
   characters you have used.
3. Click **"Analyze Notes & Generate Quiz"**. It usually takes a few seconds.
4. Read the **Summary** tab: the overview, the key points, and the important terms.
5. Open the **Quiz** tab and answer the five questions. After every answer you directly see if
   it was correct, with a short explanation. At the end you get your score.
6. Your results are saved automatically. On the home screen, the **History** panel shows your
   old notes. Click one to open its summary and quiz again, without a new API call.

## How It Works

```
Browser (React) --> Next.js API route (/api/generate) --> Google Gemini (JSON mode)
```

The browser never calls the model directly. The API route checks the input, adds a strict
system prompt for the selected language, and calls Gemini with the API key, which only exists
on the server. The model answers in JSON, and the interface shows the result as normal
components.

Some design decisions:

- **Zero-shot**: there is no fine-tuning and there are no examples. The model does the whole
  task only from the instructions in the system prompt.
- **Strict JSON output**: `responseMimeType: "application/json"` turns on Gemini's JSON mode,
  and the prompt contains the exact format. The `answer` field must be exactly the same text as
  one of the options, so checking answers is a simple comparison.
- **Grounding**: the model only uses the note you paste, not its general knowledge, so it makes
  things up much less.
- **Small model on purpose**: Gemini Flash is fast and cheap, and for this task it is enough.

## Project Structure

```
src/
  app/api/generate/route.ts   # the server endpoint that calls the LLM
  app/page.tsx                # main page: input, tabs, cooldown, history
  lib/gemini.ts               # system prompts (TR/EN) and model settings
  lib/i18n.ts                 # all interface texts in both languages
  components/                 # NoteInput, SummaryCard, QuizModule, HistoryPanel, ...
  context/LanguageContext.tsx # TR/EN language state
```

## Common Problems

| Problem | Solution |
|---|---|
| "API Key not found / invalid" | The key in `.env.local` is missing, wrong or not active. Create a new one and restart the server. |
| "The note is too long" | The limit is 8,000 characters. Split long notes into parts. |
| "An error occurred while processing the AI response" | The model sent a broken answer or the API is overloaded. Wait a few seconds and click again. |
| Port 3000 is already used | Run `npm run dev -- -p 3001` or close the other program. |

## Note

The summary and the questions are created by an AI model. They are usually correct, but not
always. Please check them against your original notes before using them for an exam.
