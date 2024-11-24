import csv
from langchain.docstore.document import Document

def load_csv_file(file_path):
    documents = []
    with open(file_path, "r", encoding="utf-8") as csv_file:
        reader = csv.reader(csv_file)
        headers = next(reader)  # Read the header row
        for row in reader:
            row_dict = dict(zip(headers, row))
            row_text = "\n".join([f"{key}: {value}" for key, value in row_dict.items()])
            documents.append(Document(
                page_content=row_text,
                metadata={
                    "source": file_path,
                    "headers": headers
                }
            ))
    return documents
