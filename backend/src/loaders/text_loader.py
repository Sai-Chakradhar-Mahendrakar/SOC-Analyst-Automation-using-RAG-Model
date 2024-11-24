from langchain_community.document_loaders.text import TextLoader

def load_text_file(file_path):
    loader = TextLoader(file_path)
    return loader.load()
