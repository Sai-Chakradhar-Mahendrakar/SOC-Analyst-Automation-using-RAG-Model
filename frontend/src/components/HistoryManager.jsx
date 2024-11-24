import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, FileText, MessageSquare, ChevronRight, Trash2, Download } from 'lucide-react';

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

// History Manager Hook
export const useHistoryManager = () => {
  const addToHistory = (fileData, messageCount = 0, lastMessage = '') => {
    const historyItem = {
      id: Date.now(),
      fileName: fileData.name,
      fileSize: fileData.size,
      fileType: fileData.name.split('.').pop().toLowerCase(),
      timestamp: new Date().toISOString(),
      messageCount,
      lastMessage,
      downloadUrl: URL.createObjectURL(fileData)
    };

    const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    localStorage.setItem('chatHistory', JSON.stringify([historyItem, ...history]));
    return historyItem;
  };

  const updateHistory = (id, updates) => {
    const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    const updatedHistory = history.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
  };

  const deleteFromHistory = (id) => {
    const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    const updatedHistory = history.filter(item => item.id !== id);
    localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
  };

  const getHistory = () => {
    return JSON.parse(localStorage.getItem('chatHistory') || '[]');
  };

  return {
    addToHistory,
    updateHistory,
    deleteFromHistory,
    getHistory
  };
};

// History Item Component
const HistoryItem = ({ item, onDelete, onReopen }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div className="mb-4 bg-gray-800 rounded-lg border border-gray-700">
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-700/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="font-medium text-white">{item.fileName}</h3>
            <p className="text-sm text-gray-400 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {formatDate(item.timestamp)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">
            {item.messageCount} messages
          </span>
          <ChevronRight 
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 
              ${isExpanded ? 'rotate-90' : ''}`}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <MessageSquare className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">
                Last message: {item.lastMessage || 'No messages yet'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onReopen(item)}
                className="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 
                         text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Continue Chat
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="p-1.5 text-red-400 hover:text-red-300 rounded-lg 
                         hover:bg-red-400/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="text-gray-400">
                Size: {(item.fileSize / 1024 / 1024).toFixed(2)} MB
              </span>
              <span className="text-gray-400">
                Type: {item.fileType.toUpperCase()}
              </span>
            </div>
            <a
              href={item.downloadUrl}
              download={item.fileName}
              className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Original
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

// Main History Manager Component
const HistoryManager = () => {
  const navigate = useNavigate();
  const [history, setHistory] = React.useState([]);
  const { getHistory, deleteFromHistory } = useHistoryManager();

  React.useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this history item?')) {
      deleteFromHistory(id);
      setHistory(getHistory());
    }
  };

  const handleReopen = (item) => {
    navigate('/chat', { 
      state: { 
        fileName: item.fileName,
        historyId: item.id
      }
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Analysis History</h2>
      </div>
      <div>
        {history.length > 0 ? (
          history.map((item) => (
            <HistoryItem
              key={item.id}
              item={item}
              onDelete={handleDelete}
              onReopen={handleReopen}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-400 mb-2">No History Found</h3>
            <p className="text-gray-500">Upload a file to start analyzing logs</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryManager;