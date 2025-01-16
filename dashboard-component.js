import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';

const Dashboard = ({ onLogout }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeUsers, setActiveUsers] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const socketRef = useRef();
  const messagesEndRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    socketRef.current = io('http://localhost:5000');

    socketRef.current.emit('user_connected', userId);

    socketRef.current.on('active_users', (users) => {
      setActiveUsers(users);
    });

    socketRef.current.on('new_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const userId = localStorage.getItem('userId');
      socketRef.current.emit('send_message', {
        userId,
        content: newMessage
      });
      setNewMessage('');
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData);
      setUploadedFiles((prev) => [...prev, response.data.filename]);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Dashboard</h2>
          <nav>
            <Link
              to="/dashboard/chat"
              className={`block py-2 px-4 rounded ${
                location.pathname === '/dashboard/chat' ? 'bg-blue-500 text-white' : ''
              }`}
            >
              Chat
            </Link>
            <Link
              to="/dashboard/files"
              className={`block py-2 px-4 rounded ${
                location.pathname === '/dashboard/files' ? 'bg-blue-500 text-white' : ''
              }`}
            >
              Files
            </Link>
            <button
              onClick={onLogout}
              className="block w-full text-left py-2 px-4 text-red-500 hover:bg-red-50 rounded"
            >
              Logout
            </button>
          </nav>
        </div>
        
        {/* Active Users */}
        <div className="p-4 border-t">
          <h3 className="text-sm font-semibold mb-2">Active Users</h3>
          <ul>
            {activeUsers.map((userId) => (
              <li key={userId} className="py-1 text-sm">
                User {userId}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Routes>
          <Route
            path="chat"
            element={
              <div className="h-full flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`mb-4 ${
                        msg.sender === localStorage.getItem('userId')
                          ? 'text-right'
                          : 'text-left'
                      }`}
                    >
                      <div
                        className={`inline-block p-2 rounded-lg ${
                          msg.sender === localStorage.getItem('userId')
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200'
                        }`}
                      >
                        {msg.content}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
                  <div className="flex">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 p-2 border rounded-l focus:outline-none focus:border-blue-500"
                      placeholder="Type a message..."
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </div>
            }
          />
          
          <Route
            path="files"
            element={
              <div className="p-4">
                <h2 className="text-xl font-bold mb-4">File Sharing</h2></antArtifact>