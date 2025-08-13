import 'dotenv/config';

import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import path from 'path';

let ragChainPromise = null;

async function initializeChain() {
  // This function is called only once to initialize the RAG chain
  try {
    console.log("Initializing RAG chain...");
    const filePath = path.resolve(process.cwd(), "data.txt");
    console.log(`Attempting to load data from: ${filePath}`);

    const loader = new TextLoader(filePath);
    const docs = await loader.load();
    console.log(`Successfully loaded ${docs.length} document(s).`);

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const splitDocs = await splitter.splitDocuments(docs);
    console.log(`Split document into ${splitDocs.length} chunks.`);

    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY,
      model: "embedding-001",
    });
    console.log("Creating vector store and embeddings. This may take a moment...");
    const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings);
    const retriever = vectorStore.asRetriever();
    console.log("Vector store created successfully.");

    const promptTemplate = PromptTemplate.fromTemplate(
      `Answer the user's question only based on the following context:\n\n{context}\n\nQuestion: {question}`
    );

    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
      model: "gemini-1.5-flash-latest",
      temperature: 0,
    });

    const formatDocs = (docs) => docs.map((doc) => doc.pageContent).join("\n\n");

    const retrieverChain = RunnableSequence.from([
        (input) => input.question,
        retriever,
        formatDocs
    ]);

    const chain = RunnableSequence.from([
        {
            context: retrieverChain,
            question: (input) => input.question
        },
        promptTemplate,
        model,
        new StringOutputParser()
    ]);
    console.log("RAG chain initialized successfully.");
    return chain;
  } catch (error) {
    console.error("Failed to initialize RAG chain:", error);
    throw error; // Propagate the error to prevent the server from starting in a bad state
  }
}

const getRagChain = () => {
    if (!ragChainPromise) {
        ragChainPromise = initializeChain();
    }
    return ragChainPromise;
};

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { prompt } = request.body;
  if (!prompt) {
    response.status(400).json({ error: 'Prompt is required in the request body.' });
    return;
  }

  try {
    const ragChain = await getRagChain();
    const result = await ragChain.invoke({ question: prompt });

    response.status(200).json({ response: result });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'An internal error occurred while processing the request.' });
  }
}