from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import OllamaEmbeddings
from src.utils.suppress_stdout import SuppressStdout

def prepare_vectorstore(data, model_name="nomic-embed-text"):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=0)
    all_splits = text_splitter.split_documents(data)

    with SuppressStdout():
        local_embeddings = OllamaEmbeddings(model=model_name)
        vectorstore = FAISS.from_documents(all_splits, local_embeddings)

    return vectorstore
