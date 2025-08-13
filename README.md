
# 🤖 Career Chatbot

A personal portfolio website featuring a custom-trained chatbot powered by my professional resume and experience.

---

## ✨ Features

- **Custom-Trained Chatbot:** Trained exclusively on my professional data (skills, work experience, projects).
- **Minimalist UI:** Clean, modern, and responsive interface inspired by Google Search.
- **Free & Secure Hosting:** Hosted on Vercel with HTTPS and a custom domain.
- **Serverless Backend:** Chatbot logic runs on a Vercel Serverless Function for scalability and cost-effectiveness.

---

## 🧠 How It Works: Retrieval-Augmented Generation (RAG)

1. **User submits a question** via the web UI.
2. **Frontend** sends the question to the `/api/chat` endpoint.
3. **Backend (Vercel Serverless Function):**
	 - Loads and splits `data.txt` (your resume) into chunks.
	 - Converts chunks and the user question into embeddings (using Google Gemini/Hugging Face).
	 - Finds the most relevant chunks using vector similarity.
	 - Combines the context and question, then sends to Google Gemini for answer generation.
4. **Response** is sent back to the frontend and displayed to the user.

---

## 🗂️ Project Structure

```
career-chatbot/
│
├── api/
│   └── chat.js         # Serverless backend logic (RAG pipeline)
├── data.txt            # Your resume data (knowledge base)
├── index.html          # Main UI
├── script.js           # Frontend logic (handles chat input/output)
├── style.css           # UI styling
├── vercel.json         # Vercel deployment config
└── README.md           # Project documentation
```

---

## 🏗️ Architecture & Flow Diagram

```mermaid
graph TD
		A[User] -->|Types question| B[Frontend (index.html, script.js)]
		B -->|POST /api/chat| C[Serverless API (api/chat.js)]
		C -->|Loads| D[data.txt]
		C -->|Splits & Embeds| E[Vector Store (in-memory)]
		C -->|Finds relevant chunks| F[Retriever]
		C -->|Sends context + question| G[Google Gemini Model]
		G -->|Answer| C
		C -->|Response| B
		B -->|Displays answer| A
```

---

## 🛠️ Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Vercel Serverless Functions (Node.js)
- **AI Framework:** LangChain.js (RAG pipeline)
- **AI Models:** Hugging Face (embeddings), Google Gemini (chat)
- **Hosting:** Vercel
- **Version Control:** Git & GitHub

---

## 🚀 Deployment & Configuration

- **Vercel** auto-deploys from GitHub.
- **Environment Variables:**
	- `HUGGINGFACEHUB_API_KEY` (for embeddings)
	- `GOOGLE_API_KEY` (for Gemini chat)
- **.npmrc:** Use `legacy-peer-deps` to resolve dependency conflicts.

---

## 📚 Usage

1. Open the website.
2. Ask questions about your career, skills, or projects.
3. The chatbot responds using only the information in your resume.

---

## 📄 License

MIT License

---

*This project demonstrates how to build a personal AI chatbot using modern RAG techniques and serverless deployment. If you forget how it works, just check the diagram and flow above!*
