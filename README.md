
# PDF Voice Reader

PDF Voice Reader is a web application that allows users to upload PDF documents, read their contents, and listen to the extracted text using text-to-speech technology.

## Features

- Upload PDF documents.
- View PDF pages inside the application.
- Extract and display PDF text.
- Listen to PDF text using voice playback.
- Play, pause, and stop audio playback.
- Control reading speed.
- Select available reading voices.
- Navigate between PDF pages and text sections.
- Track reading progress.
- Save PDF documents in a personal browser library.
- Rename, search, open, and delete saved documents.
- Custom PDF saving popup.
- Responsive design for desktop, tablet, and mobile.
- Admin login and protected dashboard.
- View website visits, PDF uploads, and listening statistics.
- AI document summarization (Coming Soon).
- Personal AI voice cloning (Coming Soon).

## Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript
- PDF.js
- Web Speech API
- IndexedDB

### Backend
- Node.js
- Express.js
- PostgreSQL
- bcryptjs
- express-session
- Helmet
- CORS
- dotenv

## Project Structure

```text
PDF-VOICE-READER/
├── frontend/
│   ├── css/
│   ├── js/
│   ├── assets/
│   ├── index.html
│   ├── reader.html
│   ├── library.html
│   ├── admin.html
│   └── admin-login.html
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   ├── server.js
│   └── .env
├── database/
│   └── schema.sql
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## Installation

### Requirements
- Node.js
- npm
- PostgreSQL

### Setup Instructions

1. Open the project folder in your terminal.

2. Install the project dependencies:

```bash
npm install
```

3. Create a PostgreSQL database named `pdf_voice_reader`.

4. Execute the SQL commands in `database/schema.sql`.

5. Configure the environment variables in `backend/.env`.

Example configuration:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pdf_voice_reader
DB_USER=postgres
DB_PASSWORD=your_postgresql_password
SESSION_SECRET=your_secure_session_secret
```

Make sure the variable names match your backend configuration.

6. Start the application:

```bash
npm start
```

For development mode, use:

```bash
npm run dev
```

7. Open your browser and visit:

```text
http://localhost:5000
```

Use the frontend address configured in your Express server if it differs.

## Important Notes

- PDF documents saved to My Library are stored locally in the user's browser using IndexedDB.
- PostgreSQL stores backend application data and website analytics.
- Voice playback uses the browser's Web Speech API.
- Available voices depend on the user's browser and operating system.
- AI summarization and personal voice cloning are planned for future development.

## Project Status

Core application features completed and tested.

Future improvements include AI-powered PDF summarization and personal AI voice cloning.

## Version

1.0.0

## License

Developed for educational purposes.
 