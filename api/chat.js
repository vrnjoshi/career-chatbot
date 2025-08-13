import 'dotenv/config';

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import path from 'path';

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
    const filePath = path.resolve(process.cwd(), 'api', 'data.txt');
    
    const loader = new TextLoader(filePath);
    const docs = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const splitDocs = await splitter.splitDocuments(docs);

    const embeddings = new HuggingFaceInferenceEmbeddings({
      apiKey: process.env.HUGGINGFACEHUB_API_KEY,
    });
    const vectorStore = await MemoryVectorStore.fromDocuments(
      splitDocs,
      embeddings
    );
    const retriever = vectorStore.asRetriever();

    const promptTemplate = PromptTemplate.fromTemplate(
      `Answer the user's question only based on the following context:
      
      {context}
      
      Question: {question}
      `
    );

    // Use Gemini for the chat model
    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
      model: "gemini-1.5-flash-latest",
      temperature: 0,
    });

    const formatDocs = (docs) => docs.map((doc) => doc.pageContent).join("\n\n");

    const ragChain = RunnableSequence.from([
      {
        context: RunnableSequence.from([
          (input) => input.question,
          retriever,
          formatDocs,
        ]),
        question: (input) => input.question,
      },
      promptTemplate,
      model,
      new StringOutputParser(),
    ]);

    const result = await ragChain.invoke({ question: prompt });

    response.status(200).json({ response: result });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Failed to process the request.' });
  }
}