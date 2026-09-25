# LifeShield: Health & Personal Finance Support

LifeShield is a mobile-first companion designed to help people organize health concerns, manage insurance and personal finances, track wellness, and connect with support. The project includes an AI herbal medicine and home-care information assistant powered by the Google Gemini API.

> **Important:** AI-generated health information is for general informational purposes only. It is not a diagnosis, medical advice, or a prescription. Consult a qualified healthcare professional before acting on health or herbal-remedy information. In an emergency, contact local emergency services.

## Help Improve This Repository

**If something does not work, please help us fix it and submit the corrected repository back to the project.**

You are welcome to test the application, identify bugs, fix errors, improve documentation, and contribute changes. If you find a problem:

1. Check the existing issues to see whether it has already been reported.
2. Open an issue describing what failed, what you expected to happen, and how to reproduce it.
3. If you can fix it, fork the repository and create a branch for your changes.
4. Test your changes and include the commands you ran and their results.
5. Submit a pull request back to this repository explaining the fix.

Please include relevant error messages or screenshots when reporting a problem. **Never include API keys, passwords, personal health information, or other secrets** in an issue, screenshot, commit, or pull request.

## Features and Project Details

- Mobile-first web application built with React and Vite.
- Express server for backend routes.
- Gemini-powered herbal medicine and home-care information endpoint.
- Wellness, health-support, insurance, and personal-finance support concept.

Some features may be incomplete or may require configuration. Please report anything that is missing, broken, or behaving unexpectedly.

## Requirements

- Node.js (a current LTS release is recommended)
- npm, or Bun if you prefer using the included `bun.lock`
- A Google Gemini API key for AI assistant requests

## Run Locally

1. Clone your fork or the repository:

   ```bash
   git clone <YOUR_REPOSITORY_URL>
   cd <REPOSITORY_FOLDER>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

   Or, with Bun:

   ```bash
   bun install
   ```

3. Create a local environment file by copying `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

   On Windows Command Prompt, use:

   ```bat
   copy .env.example .env
   ```

4. Open `.env` and replace the placeholder `GEMINI_API_KEY` with your own Gemini API key. Keep the key private. Do not commit `.env` or share your key publicly.

5. Start the development server:

   ```bash
   npm run dev
   ```

   Or, with Bun:

   ```bash
   bun run dev
   ```

   Open the local address printed in your terminal.

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Starts the Express server with Vite development middleware. |
| `npm run build` | Builds the frontend for production. |
| `npm start` | Starts the server. Set `NODE_ENV=production` when running the production build. |
| `npm run preview` | Runs Vite's preview server for the built frontend. |
| `npm run lint` | Runs TypeScript checking with `tsc --noEmit`. |
| `npm run clean` | Removes generated build/server output (uses a Unix-style command). |

## Production Build

Build the frontend:

```bash
npm run build
```

Then start the server in production mode:

```bash
NODE_ENV=production npm start
```

On Windows PowerShell, set the environment variable for the current session and start the server:

```powershell
$env:NODE_ENV="production"
npm start
```

Configure `PORT` and `GEMINI_API_KEY` in the deployment environment. Never place secrets in frontend code or commit them to the repository.

## Reporting Bugs and Submitting Fixes

When opening an issue, please include:

- A short, descriptive title.
- Your operating system and Node.js/npm or Bun versions.
- The steps needed to reproduce the issue.
- What you expected and what actually happened.
- Relevant sanitized logs or screenshots.

When submitting a pull request:

- Explain what was changed and why.
- Keep the change focused on the issue.
- Run the relevant checks, such as `npm run build` and `npm run lint`, and report whether they pass.
- Update the README or other documentation if your changes affect setup or usage.
- Do not include generated files, credentials, `.env` files, or private user data.

If you cannot fix the issue yourself, please still open an issue with the details. Bug reports and tested fixes are both appreciated.

## Safety and Privacy

LifeShield deals with health-related and financial topics. Do not use it as a replacement for professional medical, insurance, legal, or financial advice. Verify important information with qualified professionals and trusted sources.

Do not submit real personal, medical, insurance, or financial information when testing or reporting bugs. Use fictional test data.

## Project Link

The app is available in Google AI Studio:

https://ai.studio/apps/22298ea6-fab0-4438-99da-1a1f89007831
