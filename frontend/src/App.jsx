import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import ChatPage from "./components/ChatPage";
// import HistoryPage from './HistoryPage';
import HistoryManager from "./components/HistoryManager";
import LogAnalyzerDashboard from "./components/LogAnalyzerDashboard";

export default function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          {/* <Route path="/history" element={<HistoryPage />} /> */}
          <Route path="/history" element={<HistoryManager />} />
          <Route path="/dashboard" element={<LogAnalyzerDashboard />} />
        </Routes>
      </Router>
  );
}
