# TalkCollect

TalkCollect is an AI-powered audio collection and analysis tool designed to integrate with "Talk to the City". It allows administrators to create projects and groups, and enables participants to easily record conversations via a mobile-friendly web interface. Recordings are automatically transcribed and uploaded to the admin's Google Drive.

## Features

- **Admin Dashboard**: Manage projects and groups.
- **Participant Interface**: Simple, mobile-friendly recording page.
- **Automatic Transcription**: Uses OpenAI's Whisper to transcribe audio immediately after recording.
- **Google Drive Integration**: Uploads both audio and transcript files to a specified Google Drive folder.
- **Secure Authentication**: Google OAuth2 login for administrators.

## Tech Stack

- **Backend**: FastAPI (Python), SQLAlchemy, SQLite, Google Drive API, OpenAI API.
- **Frontend**: React (Vite), Vanilla CSS (Premium Dark Theme).

## Prerequisites

- Python 3.9+
- Node.js 16+
- Google Cloud Project with Drive API enabled (Client ID & Secret).
- OpenAI API Key.

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Common-Good-AI/TalkCollect.git
cd TalkCollect
```

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure Environment:
   Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```
   *Update `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `OPENAI_API_KEY`.*

5. Run the Server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend will start at `http://localhost:8000`.

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Development Server:
   ```bash
   npm run dev
   ```
   The frontend will start at `http://localhost:5173`.

### Quick Start (After Setup)

To run both backend and frontend with a single command:
```bash
./start.sh
```

## Usage Flow

1. **Admin**: Log in using Google at the root URL.
2. **Admin**: Create a new Project on the Dashboard.
3. **Admin**: (Optional) Create Groups within the project.
4. **Participant**: Access the recording link (e.g., `http://localhost:5173/project/{project_id}`).
5. **Participant**: Select a group (optional), record audio, and submit.
6. **System**: Audio is uploaded to the Admin's Google Drive and transcribed.

## License

[MIT](LICENSE)
