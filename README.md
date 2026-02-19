# F1 Hub - Formula 1 Blog & Forum

A simple, responsive web application for Formula 1 news and discussions. Built with HTML, Tailwind CSS, and vanilla JavaScript.

## Features

- **Homepage**: Latest F1 news feed (mocked data).
- **Forum**: Discussion threads with a "New Thread" feature (mocked).
- **Authentication**: Mock login and registration pages.
- **Responsive Design**: Works on mobile and desktop.

## Setup

1. Clone the repository.
2. Open `index.html` in your browser.
   - *Note*: For the best experience with `fetch` requests (loading news/forum threads), serve the project directory using a local server (e.g., standard generic python server `python3 -m http.server`, `live-server`, or similar). 
   - Opening the file directly (`file://`) may block `fetch` requests due to CORS policies in some browsers.

## Project Structure

- `index.html`: Homepage.
- `forum.html`: Forum discussions.
- `login.html` / `register.html`: Authentication pages.
- `script.js`: Core logic and mock API interaction.
- `db.json`: Mock database for news and threads.
- `styles.css`: Custom styles.

## Technologies

- HTML5
- Tailwind CSS (via CDN)
- JavaScript (ES6+)
