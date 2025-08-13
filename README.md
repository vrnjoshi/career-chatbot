🤖 Career Chatbot
A personal portfolio website featuring a custom-trained chatbot powered by my professional resume and experience.

✨ Features
Custom-Trained Chatbot: The chatbot is trained exclusively on my professional data, including my skills, work experience, and projects.

Minimalist UI: A clean, modern, and responsive user interface inspired by the Google search page.

Free & Secure Hosting: The website is hosted for free on Vercel with a custom varunjoshi.vercel.app domain and HTTPS.

Serverless Backend: The chatbot's logic runs on a Vercel Serverless Function, making it scalable and cost-effective.

🧠 How It Works: Retrieval-Augmented Generation (RAG)
The chatbot's core functionality is built using a modern AI technique called Retrieval-Augmented Generation (RAG).

Data Source: My resume data is stored in a data.txt file in the project's backend.

Document Loading: When a user asks a question, the API first loads and splits the resume data into smaller chunks.

Embeddings: The chunks of data are converted into numerical representations called embeddings using a Hugging Face model.

Retrieval: The user's question is also converted into an embedding, which is then used to find the most relevant chunks from my resume.

Generation: The most relevant chunks are combined with the user's original question and sent to a Google Gemini model. The model then generates an answer based only on the provided context.

This process ensures the chatbot's responses are accurate, factual, and specific to my experience.

🛠️ Technologies Used
Frontend: HTML, CSS, JavaScript

Backend: Vercel Serverless Functions (Node.js)

AI Framework: LangChain.js (for building the RAG pipeline)

Hosting: Vercel (free tier)

AI Models:

Hugging Face (for document embeddings)

Google Gemini (for conversational chat)

Version Control: Git and GitHub

🚀 Deployment & Configuration
To deploy the project, I used Vercel's platform, which automatically integrates with GitHub. The project required the following environment variables to be set in the Vercel dashboard and a local .npmrc file to handle dependency conflicts:

HUGGINGFACEHUB_API_KEY: Used by Hugging Face for embeddings.

GOOGLE_API_KEY: Used by Google Gemini for chat.

.npmrc: A file that forces npm install to use the legacy-peer-deps flag to resolve package conflicts.
