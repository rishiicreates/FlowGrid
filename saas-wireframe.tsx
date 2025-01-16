import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, MessageSquare, FileText, Settings, Upload, Download, Trash2, User } from "lucide-react";

const WireframePrototype = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const LoginPage = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Input type="email" placeholder="Email" className="w-full" />
            </div>
            <div>
              <Input type="password" placeholder="Password" className="w-full" />
            </div>
            <Button 
              className="w-full"
              onClick={() => setIsLoggedIn(true)}
            >
              Login
            </Button>
            <div className="flex justify-between text-sm text-gray-600">
              <button className="hover:underline">Sign Up</button>
              <button className="hover:underline">Forgot Password?</button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const Dashboard = () => (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
        <div className="flex-1 space-y-2">
          <button className="flex items-center space-x-2 w-full p-2 rounded hover:bg-gray-100">
            <MessageSquare size={20} />
            <span>Chat</span>
          </button>
          <button className="flex items-center space-x-2 w-full p-2 rounded hover:bg-gray-100">
            <FileText size={20} />
            <span>Files</span>
          </button>
          <button className="flex items-center space-x-2 w-full p-2 rounded hover:bg-gray-100">
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </div>
        <button 
          className="flex items-center space-x-2 w-full p-2 rounded hover:bg-gray-100 text-gray-600"
          onClick={() => setIsLoggedIn(false)}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Chat Panel */}
        <div className="w-1/2 border-r border-gray-200 flex flex-col">
          {/* User List */}
          <div className="p-4 border-b border-gray-200">
            <div className="space-y-2">
              {['Alice Smith', 'Bob Johnson', 'Carol Williams'].map((user) => (
                <div key={user} className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
                  <User size={20} className="text-gray-400" />
                  <span>{user}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 p-4 bg-gray-50">
            <div className="space-y-4">
              <div className="bg-white p-3 rounded-lg shadow-sm max-w-[80%]">
                Hello! How can I help you today?
              </div>
              <div className="bg-blue-50 p-3 rounded-lg shadow-sm max-w-[80%] ml-auto">
                I need help with the new feature.
              </div>
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200">
            <Input placeholder="Type your message..." className="w-full" />
          </div>
        </div>

        {/* Files Panel */}
        <div className="w-1/2 p-4 bg-gray-50">
          {/* Upload Zone */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-white">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drag and drop files here, or click to select files
            </p>
          </div>

          {/* File List */}
          <div className="mt-6 space-y-2">
            {['Document.pdf', 'Image.png', 'Presentation.pptx'].map((file) => (
              <div key={file} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <span className="flex items-center space-x-2">
                  <FileText size={20} className="text-gray-400" />
                  <span>{file}</span>
                </span>
                <div className="flex space-x-2">
                  <button className="p-1 hover:text-blue-600">
                    <Download size={20} />
                  </button>
                  <button className="p-1 hover:text-red-600">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return isLoggedIn ? <Dashboard /> : <LoginPage />;
};

export default WireframePrototype;