from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
import shutil
from src.loaders.text_loader import load_text_file
from src.loaders.csv_loader import load_csv_file
from src.chains.retrieval_qa import prepare_vectorstore
from langchain.chains import RetrievalQA
from langchain_core.prompts import PromptTemplate
from langchain_ollama.llms import OllamaLLM
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI app
app = FastAPI()

# Allow requests from 'http://localhost:5173'
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Persistent global state
vectorstore = None
qa_chain = None

UPLOAD_DIRECTORY = "./uploads"
if not os.path.exists(UPLOAD_DIRECTORY):
    os.makedirs(UPLOAD_DIRECTORY)


# Input model for query requests
class QueryRequest(BaseModel):
    query: str


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Endpoint to upload a custom file for log analysis.
    """
    global vectorstore, qa_chain

    # Save the uploaded file
    file_path = os.path.join(UPLOAD_DIRECTORY, file.filename)
    try:
        with open(file_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving file: {e}")

    # Determine file type and load data
    ext = os.path.splitext(file.filename)[1].lower()
    try:
        if ext in [".txt", ".log", ".md"]:
            data = load_text_file(file_path)
        elif ext == ".csv":
            data = load_csv_file(file_path)
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported file format: {ext}")

        # Prepare the vectorstore
        vectorstore = prepare_vectorstore(data)

        # Define the QA chain
        template = """You are a Level 1 SOC analyst analyzing server logs.
        Use the context below to answer the question as precisely and concisely as possible.
        {context}
        Question: {question}
        Answer:"""

        QA_CHAIN_PROMPT = PromptTemplate(
            input_variables=["context", "question"],
            template=template,
        )

        llm = OllamaLLM(model="llama3.1")
        qa_chain = RetrievalQA.from_chain_type(
            llm,
            retriever=vectorstore.as_retriever(),
            chain_type_kwargs={"prompt": QA_CHAIN_PROMPT},
        )

        return JSONResponse(content={"message": f"File '{file.filename}' successfully processed and vectorstore initialized."})

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {e}")


@app.post("/query")
def query_logs(request: QueryRequest):
    """
    Endpoint to query the uploaded file using the RetrievalQA chain.
    """
    global qa_chain

    if qa_chain is None:
        raise HTTPException(status_code=500, detail="No file has been uploaded or processed.")

    query = request.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    try:
        result = qa_chain.invoke({"query": query})
        response_text = result.get("result", "No result found.")
        return {"query": query, "response": response_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing query: {e}")


@app.get("/")
def read_root():
    """
    Root endpoint for API health check.
    """
    return {"message": "SOC Level 1 log analysis API is running. Upload a file to get started."}
