# api/chatbot.py

import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
import google.generativeai as genai
from dotenv import load_dotenv

# --- Vercel-Specific Setup ---
# The Flask app instance should be named 'app' for Vercel's WSGI handler
app = Flask(__name__)
# The CORS setup is still good practice, especially for local testing
CORS(app)

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# --- Model and Vector Store Initialization ---
vector_db = None
initialization_error = None

def initialize_vector_store():
    global vector_db, initialization_error
    try:
        if vector_db is not None:
            logger.info("Vector store already initialized.")
            return True

        gemini_api_key = os.getenv("GEMINI_API_KEY")
        if not gemini_api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        genai.configure(api_key=gemini_api_key)
        logger.info("Gemini API key configured.")

        current_dir = os.path.dirname(os.path.abspath(__file__))
        resume_path = os.path.join(current_dir, 'Uploads', 'resume.pdf')
        
        if not os.path.exists(resume_path):
            raise FileNotFoundError(f"Resume not found at {resume_path}")
        
        logger.info("Loading and processing resume...")
        loader = PyPDFLoader(resume_path)
        documents = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=200)
        texts = text_splitter.split_documents(documents)
        
        embedding_model = "sentence-transformers/all-MiniLM-L6-v2"
        embeddings = HuggingFaceEmbeddings(model_name=embedding_model)
        
        # This will be an in-memory vector store for each function invocation (or warm instance)
        vector_db = Chroma.from_documents(texts, embeddings, collection_name="navin_resume")
        logger.info("Vector store initialized successfully.")
        return True
    except Exception as e:
        logger.error(f"FATAL: Error initializing vector store: {e}", exc_info=True)
        initialization_error = str(e)
        return False

# Eagerly initialize the vector store when the function is loaded (cold start)
initialize_vector_store()


def generate_response(query, context):
    try:
        prompt = f"""
            You are **Navin Assistant** – a professional, conversational AI trained to speak on behalf of Navin B. Your job is to provide **accurate, confident, and concise answers** based solely on the resume context provided.

            ------------------------------
            Context:
            {context}
            ------------------------------

            Purpose:
            Help recruiters, collaborators, or interested professionals learn about **Navin B’s profile** based only on his verified resume data.

            ------------------------------
            You MUST answer questions ONLY related to:
            - Skills
            - Projects
            - Experience
            - Education
            - Certifications
            - Awards
            - Social Profiles

            If the question is unrelated or out of scope, respond with:
            ❝I'm here to provide information about Navin B's skills, projects, experience, education, certifications, awards, or social profiles. Please ask a relevant question.❞

            ------------------------------
            Tone & Personality:
            - Clear, professional, and confident
            - Friendly and engaging, reflecting Navin’s passion for **technology, innovation, and problem-solving**
            - Use first-person voice ("I") when answering to represent Navin directly

            ------------------------------
            Response Format:
            - Be brief but informative
            - Use bullet points or small paragraphs
            - Never guess or fabricate information not found in the context

            ------------------------------

            📥 Input:  
            **Question:** {query}  
            📤 Output:  
            **Answer:**
        """
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        logger.error(f"Error generating Gemini response: {e}")
        return "I'm sorry, an error occurred while generating a response. Please ask a different question about Navin's skills or experience."

# This is the main API route that Vercel will expose.
# The route is now '/api/chatbot' because the file is 'api/chatbot.py'.
@app.route("/api/chatbot", methods=["POST"])
def chatbot_handler():
    global vector_db, initialization_error
    
    if vector_db is None:
        logger.error(f"Vector DB not available. Error: {initialization_error}")
        return jsonify({"response": f"The chatbot is currently unavailable due to an initialization error. Details: {initialization_error}"}), 503

    try:
        data = request.get_json()
        query = data.get("query", "").strip()
        if not query:
            return jsonify({"response": "Query cannot be empty."}), 400

        logger.info(f"Received query: '{query}'")
        
        results = vector_db.similarity_search(query, k=3)
        context = "\n".join([doc.page_content for doc in results])
        
        response_text = generate_response(query, context)
        
        return jsonify({"response": response_text})
    except Exception as e:
        logger.error(f"Error in chatbot handler: {e}", exc_info=True)
        return jsonify({"response": "I'm sorry, a server error occurred. Please try again later."}), 500

# DO NOT include app.run() - Vercel handles this.