<div align="center">
  <a href="https://github.com/waseemqureshi04/pickaflick-backend">
    <img src="https://github.com/MohammedGhouseuddinQureshi/Logo/blob/main/pickaflick.png?raw=true" alt="Pickaflick Logo" width="300" height="auto">
  </a>

  <h1>Pickaflick Backend</h1>
  
  <p>
    <b>The Server-Side Engine for the AI-Powered Movie Companion</b>
  </p>

<p>
  <a href="https://nodejs.org/">
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  </a>
  <a href="https://expressjs.com/">
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  </a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript">
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  </a>
</p>
</div>

<br />

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#key-features">Key Features</a></li>
    <li><a href="#built-with">Built With & Dependencies</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#deployment">Deployment</a></li>
  </ol>
</details>

---

## 📖 About The Project

The **Pickaflick Backend** acts as the secure middleware for the Pickaflick ecosystem. Built on **Express 5**, it handles client requests, manages cross-origin resource sharing (CORS), and serves as a secure proxy for external API calls. This architecture ensures that sensitive API keys (such as OpenAI or TMDB credentials) remain hidden from the frontend client while delivering fast, structured data to the user.

---

## 🚀 Key Features

* **⚡ Lightweight Architecture:** Minimalist setup using Express.js for maximum speed and low overhead.
* **🔒 Secure API Proxying:** Uses server-side fetching to protect external API keys from being exposed in the browser.
* **🌐 CORS Management:** Configured to safely handle requests from the Pickaflick frontend while blocking unauthorized origins.
* **🔧 Environment Configuration:** Seamless management of sensitive configuration variables using Dotenv.

---

## 🛠️ Built With & Dependencies

This backend utilizes a lean selection of packages to maintain performance and reliability.

| Category | Package | Purpose |
| :--- | :--- | :--- |
| **Server Framework** | `express` | The web framework (v5.1.0) handling routing and middleware. |
| **Networking** | `node-fetch` | Enables the server to make HTTP requests to external APIs (OpenAI, TMDB). |
| | `cors` | Manages Cross-Origin Resource Sharing to allow frontend communication. |
| **Utilities** | `dotenv` | Loads environment variables (API keys, ports) from a `.env` file. |
| | `body-parser` | Parses incoming request bodies (JSON/URL-encoded) before your handlers. |

---

## ⚡ Getting Started

Follow these steps to get the server running locally.

### Prerequisites

* **Node.js:** Ensure Node.js (v18+ recommended) is installed.
* **npm:** The Node package manager.

### Installation

1.  **Clone the repository**
    ```sh
    git clone [https://github.com/waseemqureshi04/pickaflick-backend.git](https://github.com/waseemqureshi04/pickaflick-backend.git)
    cd pickaflick-backend
    ```

2.  **Install dependencies**
    ```sh
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory and add your keys:
    ```env
    PORT=5000
    OPENAI_API_KEY=your_key_here
    TMDB_API_KEY=your_key_here
    ```

4.  **Start the Server**
    ```sh
    node index.js
    ```
    *Note: Replace `index.js` with your entry file name (e.g., `server.js` or `app.js`) if different.*

---

## 📦 Deployment

This Express app is production-ready and can be deployed to platforms like **Heroku**, **Render**, **Vercel**, or **AWS EC2**.

Ensure you set your **Environment Variables** (Secrets) in your deployment platform's dashboard to match your local `.env` file.