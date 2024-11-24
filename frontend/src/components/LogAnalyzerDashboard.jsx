import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  AlertTriangle,
  Clock,
  Server,
  Activity,
  Upload,
  ArrowLeft,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";

const MetricCard = ({ icon: Icon, title, value, color }) => (
  <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 hover:border-blue-400 transition-colors">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-2xl font-semibold text-white">{value}</p>
      </div>
    </div>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
    <h2 className="text-lg font-semibold text-white mb-6">{title}</h2>
    <div className="h-[300px] w-full">
      <ResponsiveContainer>{children}</ResponsiveContainer>
    </div>
  </div>
);

const LogAnalyzerDashboard = () => {
  const [logData, setLogData] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  const timeSeriesData = useMemo(() => {
    const timeGroups = {};
    logData.forEach((log) => {
      const hour = new Date(log.timestamp).getHours();
      timeGroups[hour] = (timeGroups[hour] || 0) + 1;
    });

    return Object.entries(timeGroups).map(([hour, count]) => ({
      hour: `${hour}:00`,
      count,
    }));
  }, [logData]);

  const severityData = useMemo(() => {
    const severityCounts = {};
    logData.forEach((log) => {
      severityCounts[log.severity] = (severityCounts[log.severity] || 0) + 1;
    });

    return Object.entries(severityCounts).map(([severity, count]) => ({
      name: severity,
      value: count,
    }));
  }, [logData]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleFileUpload = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      const parsedLogs = text
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => {
          try {
            const timestamp =
              line.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/) ||
              line.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);
            const severity = line.match(/ERROR|WARN|INFO|DEBUG/i);

            return {
              timestamp: timestamp ? timestamp[0] : new Date().toISOString(),
              severity: severity ? severity[0].toUpperCase() : "INFO",
              message: line,
            };
          } catch (error) {
            return null;
          }
        })
        .filter((log) => log);

      setLogData(parsedLogs);
    };

    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <header className="border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </Link>
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-400" />
              <h1 className="text-lg font-semibold text-white">
                Log Analysis Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-2">
                <Link
                  to="/chat"
                  className="flex items-center gap-2 text-gray-400 hover:text-white"
                >
                  <Clock className="w-5 h-5" />
                  Security Log Analysis
                </Link>
              </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* File Upload Area */}
        <div
          className={`relative border-4 border-dashed rounded-xl p-8 text-center transition-all duration-200 ease-in-out
            ${isDragging ? "border-blue-400 bg-blue-400/10" : "border-gray-600 hover:border-gray-500"}
            ${logData.length > 0 ? "bg-green-400/10 border-green-400" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            onChange={(e) => handleFileUpload(e.target.files[0])}
            accept=".log,.txt,.csv,.md"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center gap-4">
            <Upload className="w-16 h-16 text-gray-400" />
            <p className="text-xl font-medium text-white">
              Drop your log file here or click to upload
            </p>
            <p className="text-gray-400">
              Supported formats: LOG, TXT, CSV, MD
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            icon={Activity}
            title="Total Logs"
            value={logData.length}
            color="bg-blue-500"
          />
          <MetricCard
            icon={AlertTriangle}
            title="Errors"
            value={logData.filter((log) => log.severity === "ERROR").length}
            color="bg-red-500"
          />
          <MetricCard
            icon={Clock}
            title="Time Range"
            value={
              logData.length
                ? `${new Date(logData[0].timestamp).getHours()}:00 - ${new Date(
                    logData[logData.length - 1].timestamp
                  ).getHours()}:00`
                : "N/A"
            }
            color="bg-yellow-500"
          />
          <MetricCard
            icon={Server}
            title="Success Rate"
            value={
              logData.length
                ? `${(
                    (1 -
                      logData.filter((log) => log.severity === "ERROR").length /
                        logData.length) *
                    100
                  ).toFixed(1)}%`
                : "N/A"
            }
            color="bg-green-500"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Log Activity Over Time">
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="hour"
                stroke="#9CA3AF"
                tick={{ fill: "#9CA3AF" }}
              />
              <YAxis stroke="#9CA3AF" tick={{ fill: "#9CA3AF" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "0.5rem",
                }}
                itemStyle={{ color: "#9CA3AF" }}
                labelStyle={{ color: "#F9FAFB" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3B82F6"
                strokeWidth={2}
              />
            </LineChart>
          </ChartCard>

          <ChartCard title="Severity Distribution">
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {severityData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "0.5rem",
                }}
                itemStyle={{ color: "#9CA3AF" }}
                labelStyle={{ color: "#F9FAFB" }}
              />
              <Legend />
            </PieChart>
          </ChartCard>
        </div>

        {/* Recent Logs Table */}
        <div className="bg-gray-900/50 border border-gray-700 rounded-xl overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white">Recent Logs</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                    Severity
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                    Message
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {logData.slice(0, 10).map((log, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {log.timestamp}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          log.severity === "ERROR"
                            ? "bg-red-500/10 text-red-400"
                            : log.severity === "WARN"
                            ? "bg-yellow-500/10 text-yellow-400"
                            : "bg-green-500/10 text-green-400"
                        }`}
                      >
                        {log.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {log.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LogAnalyzerDashboard;