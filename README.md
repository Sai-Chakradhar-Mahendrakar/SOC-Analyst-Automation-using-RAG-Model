# SOC Automation Platform

An intelligent automation platform designed to enhance SOC Level 1 analyst operations using advanced AI and vector search capabilities.

## Overview

This project leverages state-of-the-art AI models and vector search technologies to automate routine SOC Level 1 analyst tasks, improving efficiency, accuracy, and response times in security operations.

### Key Features

- Automated log analysis and categorization
- Real-time threat detection with reduced latency
- Interactive dashboard for log visualization
- AI-powered insights using LAMA 3.1
- Efficient vector search using FAISS
- Advanced text preprocessing with BERT-based embeddings

## Architecture

The system implements a sophisticated pipeline combining several cutting-edge technologies:

1. **Log Ingestion Interface**
   - User-friendly interface for log file uploads
   - Supports multiple log formats
   - Streamlined data input process

2. **Log Processing Engine**
   - Intelligent log chunking for optimal processing
   - BERT-based text embeddings using Nomic
   - Advanced preprocessing for enhanced accuracy

3. **Vector Storage and Search**
   - FAISS-powered vector database
   - Efficient similarity search capabilities
   - Optimized for large-scale log data

4. **AI Analysis Engine**
   - LAMA 3.1 integration
   - Retrieval-Augmented Generation (RAG) implementation
   - Contextual understanding of security events

5. **Visualization Dashboard**
   - Real-time log categorization
   - Interactive metrics and statistics
   - Customizable views and filters

## Installation

```bash
# Clone the repository
git clone https://github.com/Sai-Chakradhar-Mahendrakar/SOC-Analyst-Automation-using-RAG-Model.git

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

## Configuration

1. Create a `.env` file in the project root:
```env
LAMA_API_KEY=your_api_key
NOMIC_API_KEY=your_nomic_key
```

2. Configure the vector database settings in `config/faiss_config.yaml`

## Usage

1. Start the application:
```bash
python app.py
```

2. Access the web interface at `http://localhost:8000`

3. Upload log files through the interface

4. View results in the dashboard

## Dependencies

- Python 3.8+
- LAMA 3.1
- FAISS
- Nomic Embedded Text
- BERT Transformers
- React + Vite
- Additional requirements listed in `requirements.txt`

## Project Structure

```
soc-automation/
├── app/
│   ├── core/
│   │   ├── log_processor.py
│   │   ├── vector_store.py
│   │   └── ai_engine.py
│   ├── api/
│   │   └── routes.py
│   └── dashboard/
│       └── views.py
├── config/
│   └── faiss_config.yaml
├── tests/
├── requirements.txt
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- LAMA team for their excellent language model
- FAISS team for the vector similarity search engine
- Nomic for their embedded text processing capabilities

## Contact

For questions and support, please open an issue in the GitHub repository or contact the maintainers.
