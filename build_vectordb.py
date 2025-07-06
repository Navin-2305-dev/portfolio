import os
import logging
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

UPLOAD_FOLDER = 'api/Uploads'
RESUME_PATH = os.path.join(UPLOAD_FOLDER, 'resume.pdf')
PERSIST_DIRECTORY = 'chroma_db'
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"

def build_and_save_vector_store():
    """
    Loads the resume, splits it, creates embeddings, and persists the vector store to disk.
    """
    try:
        if os.path.exists(PERSIST_DIRECTORY):
            logger.info(f"Vector store already exists at '{PERSIST_DIRECTORY}'. Skipping build.")
            return True

        if not os.path.exists(RESUME_PATH):
            logger.error(f"Resume not found at {RESUME_PATH}. Please make sure the file is there.")
            return False

        logger.info("Loading and splitting resume PDF...")
        loader = PyPDFLoader(RESUME_PATH)
        documents = loader.load()
        if not documents:
            logger.error("No content extracted from resume.")
            return False

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=200)
        texts = text_splitter.split_documents(documents)
        logger.info(f"Split resume into {len(texts)} text chunks.")

        logger.info(f"Initializing embedding model: {EMBEDDING_MODEL}")
        embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)

        logger.info(f"Creating and persisting vector store to '{PERSIST_DIRECTORY}'...")
        Chroma.from_documents(
            documents=texts,
            embedding=embeddings,
            persist_directory=PERSIST_DIRECTORY
        )

        logger.info("Vector store built and saved successfully!")
        return True

    except Exception as e:
        logger.error(f"An error occurred during vector store creation: {e}")
        return False

if __name__ == "__main__":
    build_and_save_vector_store()