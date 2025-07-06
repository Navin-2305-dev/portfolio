import os
import json
import logging
from http.server import BaseHTTPRequestHandler
import google.generativeai as genai
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
PERSIST_DIRECTORY = os.path.join(os.path.dirname(__file__), '..', 'chroma_db')
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"

vector_db = None
initialization_error = None
try:
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY not found in environment variables.")
    genai.configure(api_key=GEMINI_API_KEY)

    if not os.path.exists(PERSIST_DIRECTORY):
        raise FileNotFoundError(f"Vector store directory not found at {PERSIST_DIRECTORY}. Did you run build_vectordb.py?")
    
    embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)
    vector_db = Chroma(persist_directory=PERSIST_DIRECTORY, embedding_function=embeddings)
    logger.info("Vector store loaded successfully.")
except Exception as e:
    logger.error(f"Fatal error during initialization: {e}", exc_info=True)
    initialization_error = str(e)


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
            - Skills, Projects, Experience, Education, Certifications, Awards, Social Profiles

            If the question is unrelated or out of scope, respond with:
            ❝I'm here to provide information about Navin B's skills, projects, experience, education, certifications, awards, or social profiles. Please ask a relevant question.❞

            ------------------------------
            Tone & Personality:
            - Clear, professional, and confident
            - Friendly and engaging, reflecting Navin’s passion for technology and problem-solving
            - Use first-person voice ("I") when answering to represent Navin directly

            ------------------------------
            Response Format:
            - Be brief but informative
            - Use bullet points or small paragraphs
            - Never guess or fabricate information not found in the context

            ------------------------------

            Input:
            **Question:** {query}
            Output:
            **Answer:**
        """
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        return response.text.strip() if response.text else "I'm sorry, I couldn't generate a response."
    except Exception as e:
        logger.error(f"Error generating response from Gemini: {e}")
        return "I'm sorry, there was an issue with the AI model. Please try again later."


# Vercel looks for a class named `handler` that inherits from BaseHTTPRequestHandler
class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        # Check if the server failed to initialize
        if initialization_error or vector_db is None:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            response_body = {"response": f"Server initialization failed: {initialization_error}"}
            self.wfile.write(json.dumps(response_body).encode('utf-8'))
            return

        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data)
            query = data.get("query", "").strip()

            if not query:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"response": "Query cannot be empty."}).encode('utf-8'))
                return

            logger.info(f"Received query: '{query}'")
            results = vector_db.similarity_search(query, k=3)
            context = "\n\n".join([doc.page_content for doc in results])
            
            ai_response = generate_response(query, context)

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"response": ai_response}).encode('utf-8'))

        except Exception as e:
            logger.error(f"Error in do_POST handler: {e}", exc_info=True)
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"response": "An internal server error occurred."}).encode('utf-8'))

    # This handles pre-flight requests from the browser for CORS
    def do_OPTIONS(self):
        self.send_response(200, "ok")
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()