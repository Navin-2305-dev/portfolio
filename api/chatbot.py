import os
import json
import logging
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
import google.generativeai as genai
from dotenv import load_dotenv

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

load_dotenv()
app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "9f8b2a7c4d3e1f6a8b9c0d2e4f7a1b3c5d6e8f9a0b1c2d3e4f5")
gemini_api_key = os.getenv("GEMINI_API_KEY")
if not gemini_api_key:
    logger.error("GEMINI_API_KEY not found in environment variables")
    raise ValueError("GEMINI_API_KEY is required")
genai.configure(api_key=gemini_api_key)
logger.info("Gemini API configured")
CORS(app, resources={r"/api/*": {"origins": "*"}})
logger.info("Flask app initialized")

UPLOAD_FOLDER = 'Uploads'
RESUME_PATH = os.path.join(UPLOAD_FOLDER, 'resume.pdf')
embedding_model = "sentence-transformers/all-MiniLM-L6-v2"
embeddings = HuggingFaceEmbeddings(model_name=embedding_model)

vector_db = None
def initialize_vector_store():
    global vector_db
    try:
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        if not os.path.exists(RESUME_PATH):
            logger.error(f"Resume not found at {RESUME_PATH}")
            return False

        logger.debug("Loading and splitting resume")
        loader = PyPDFLoader(RESUME_PATH)
        documents = loader.load()
        if not documents:
            logger.error("No content extracted from resume")
            return False

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=200)
        texts = text_splitter.split_documents(documents)
        logger.debug(f"Split resume into {len(texts)} chunks")
        
        logger.debug("Generating embeddings and initializing Chroma")
        vector_db = Chroma.from_documents(texts, embeddings, collection_name="navin_resume")
        logger.info("Vector store initialized with resume data")
        return True
    except Exception as e:
        logger.error(f"Error initializing vector store: {e}")
        return False

# Initialize vector store on startup
if not initialize_vector_store():
    logger.error("Failed to initialize vector store. Chatbot will not function correctly.")

# Generate response using Gemini API
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
        logger.debug(f"Prompt length: {len(prompt)} characters")
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        if not response.text:
            logger.warning("Empty response from Gemini API")
            return "I'm sorry, I couldn't process that request. Please try again or ask about Navin B's skills, projects, or experience."
        logger.info(f"Generated response: {response.text[:100]}...")
        return response.text.strip()
    except Exception as e:
        logger.error(f"Error generating response: {e}")
        return "I'm sorry, I couldn't process that request. Please try again or ask about Navin B's skills, projects, or experience."

@app.route("/api/chatbot", methods=["POST"])
def chatbot():
    logger.debug("Received POST request to /api/chatbot")
    try:
        # Log raw request data
        logger.debug(f"Raw request data: {request.get_data(as_text=True)}")

        if request.content_type != "application/json":
            logger.error(f"Invalid content type: {request.content_type}")
            return jsonify({"response": "Invalid content type: Expected application/json."}), 400

        data = request.get_json(silent=True)
        if data is None:
            logger.error("Failed to parse JSON request")
            return jsonify({"response": "Invalid request: Malformed JSON."}), 400

        query = data.get("query", "").strip()
        if not query:
            logger.error("Empty or missing query in request")
            return jsonify({"response": "Invalid request: Query cannot be empty."}), 400

        logger.info(f"Received query: '{query}'")

        # Initialize session chat history
        if "chat_history" not in session:
            session["chat_history"] = []
            logger.debug("Initialized new session chat history")

        if vector_db is None:
            logger.error("Vector store not initialized")
            return jsonify({"response": "Resume data not available. Please ensure the resume is uploaded."}), 500

        # Retrieve context and generate response
        logger.debug("Performing similarity search")
        results = vector_db.similarity_search(query, k=3)
        context = "\n".join([doc.page_content for doc in results])
        logger.debug(f"Retrieved context: {context[:100]}...")

        response = generate_response(query, context)

        # Update chat history
        session["chat_history"].append({"query": query, "response": response})
        session.modified = True
        logger.debug(f"Updated chat history: {len(session['chat_history'])} entries")

        return jsonify({"response": response})
    except Exception as e:
        logger.error(f"Error in chatbot endpoint: {str(e)}")
        return jsonify({"response": "I'm sorry, I couldn't process that request. Please try again or ask about Navin B's skills, projects, or experience."}), 500

if __name__ == "__main__":
    logger.info("Starting Flask server on port 5000")
    app.run(debug=True, port=5000)