import React, { useEffect, useState } from 'react';
import { User, MessageCircle, UserPlus, Clock, Send, Smile, Paperclip, X } from 'lucide-react';
import axios from 'axios'
const mockFriends = [
  {
    id: '1',
    fullName: 'Alice Johnson',
    username: '@alice_j',
    profilePic: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    isOnline: true,
  },
  {
    id: '2',
    fullName: 'Bob Smith',
    username: '@bob_smith',
    profilePic: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    isOnline: false,
    lastSeen: '2 hours ago',
  },
  {
    id: '3',
    fullName: 'Carol Davis',
    username: '@carol_d',
    profilePic: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    isOnline: true,
  },
  {
    id: '4',
    fullName: 'David Wilson',
    username: '@david_w',
    profilePic: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    isOnline: false,
    lastSeen: '1 day ago',
  }
];

const mockPendingRequests = [
  {
    id: '5',
    fullName: 'Emma Brown',
    username: '@emma_b',
    profilePic: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    isOnline: true,
  },
  {
    id: '6',
    fullName: 'Frank Miller',
    username: '@frank_m',
    profilePic: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    isOnline: false,
    lastSeen: '30 minutes ago',
  }
];

const mockSentRequests = [
  {
    id: '7',
    fullName: 'Grace Lee',
    username: '@grace_lee',
    profilePic: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    isOnline: true,
  },
  {
    id: '8',
    fullName: 'Henry Taylor',
    username: '@henry_t',
    profilePic: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    isOnline: false,
    lastSeen: '5 minutes ago',
  }
];

const mockMessages = [
  {
    id: '1',
    senderId: 'me',
    content: 'Hey! How are you doing?',
    timestamp: new Date('2025-01-27T10:30:00'),
    isRead: true,
  },
  {
    id: '2',
    senderId: '1',
    content: 'Hi! I\'m doing great, thanks for asking! How about you?',
    timestamp: new Date('2025-01-27T10:31:00'),
    isRead: true,
  },
  {
    id: '3',
    senderId: 'me',
    content: 'I\'m good too! Working on some exciting projects.',
    timestamp: new Date('2025-01-27T10:32:00'),
    isRead: true,
  },
  {
    id: '4',
    senderId: '1',
    content: 'That sounds awesome! Would love to hear more about it sometime.',
    timestamp: new Date('2025-01-27T10:33:00'),
    isRead: false,
  }
];

function FriendCard({ friend, showMessageButton = false, onMessage }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <img
            src={friend.profilePic}
            alt={friend.fullName}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-100"
          />
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
            friend.isOnline ? 'bg-green-500' : 'bg-gray-400'
          } transition-colors duration-200`}></div>
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg">{friend.fullName}</h3>
          <p className="text-gray-500 text-sm">{friend.username}</p>
          {!friend.isOnline && friend.lastSeen && (
            <p className="text-gray-400 text-xs mt-1">Last seen {friend.lastSeen}</p>
          )}
          {friend.isOnline && (
            <p className="text-green-500 text-xs mt-1 font-medium">Online</p>
          )}
        </div>
        
        {showMessageButton && (
          <button
            onClick={() => onMessage && onMessage(friend)}
            className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-all duration-200 transform hover:scale-110 active:scale-95"
          >
            <MessageCircle size={20} />
          </button>
        )}
      </div>
    </div>
  );
}

function MessagePanel({ friend, isOpen, onClose }) {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message = {
      id: Date.now().toString(),
      senderId: 'me',
      content: newMessage,
      timestamp: new Date(),
      isRead: false,
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Simulate typing indicator
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replyMessage = {
        id: (Date.now() + 1).toString(),
        senderId: friend?.id || '1',
        content: 'Thanks for your message! 😊',
        timestamp: new Date(),
        isRead: false,
      };
      setMessages(prev => [...prev, replyMessage]);
    }, 2000);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Message Panel */}
      <div className={`fixed right-0 top-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {friend && (
          <>
            {/* Header */}
            <div className="bg-blue-500 text-white p-6 flex items-center space-x-4">
              <img
                src={friend.profilePic}
                alt={friend.fullName}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-white/20"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{friend.fullName}</h3>
                <p className="text-blue-100 text-sm">{friend.username}</p>
                <div className="flex items-center mt-1">
                  <div className={`w-2 h-2 rounded-full mr-2 ${friend.isOnline ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                  <span className="text-blue-100 text-xs">
                    {friend.isOnline ? 'Online' : `Last seen ${friend.lastSeen}`}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="h-[calc(100%-180px)] overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                >
                  <div className={`max-w-[80%] p-3 rounded-2xl ${
                    message.senderId === 'me'
                      ? 'bg-blue-500 text-white ml-4'
                      : 'bg-gray-100 text-gray-800 mr-4'
                  } shadow-sm`}>
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.senderId === 'me' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start animate-pulse">
                  <div className="bg-gray-100 text-gray-800 p-3 rounded-2xl mr-4 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors duration-200">
                  <Paperclip size={20} />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors duration-200"
                />
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors duration-200">
                  <Smile size={20} />
                </button>
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-full transition-all duration-200 transform hover:scale-110 active:scale-95 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function App() {

  async function getfriend(){
    try {
      const friends = await axios.get("/api/v1/user/getfriends");
      // console.log("hii getfriend")
      console.log(friends.data.data)
      mockFriends.push(...(friends.data.data || []))
    } catch (error) {
      console.log(error)
    }
  }
  async function pendingRequest(){
    try {
      const friends = await axios.get("/api/v1/user/pending-request");
      console.log(friends.data.data)
      // console.log("hii pending request")
      mockPendingRequests.push(...(friends.data.data || []))
    } catch (error) {
      console.log(error)
    }
  }
  async function requestSent(){
    try {
      const friends = await axios.get("/api/v1/user/request-sent");
      console.log(friends.data.data)
      mockSentRequests.push(...(friends.data.data || []))
    } catch (error) {
      console.log(error)
    }
  }

   useEffect(() => {
  const fetchAll = async () => {
    try {
    
      await getfriend();

      await pendingRequest();

      await requestSent();

    } catch (error) {
      console.error("❌ Error in fetchAll():", error?.response?.data || error.message || error);
    }
  };

  fetchAll();
  // getfriend();
  // pendingRequest();
  // requestSent();
}, []);


  const [activeTab, setActiveTab] = useState('friends');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [isMessagePanelOpen, setIsMessagePanelOpen] = useState(false);

  const handleMessage = (friend) => {
    setSelectedFriend(friend);
    setIsMessagePanelOpen(true);
  };

  const closeMessagePanel = () => {
    setIsMessagePanelOpen(false);
    setTimeout(() => setSelectedFriend(null), 300);
  };

  const tabs = [
    { id: 'friends', label: 'Friends', icon: User, count: mockFriends.length },
    { id: 'pending', label: 'Pending', icon: Clock, count: mockPendingRequests.length },
    { id: 'sent', label: 'Sent', icon: UserPlus, count: mockSentRequests.length },
  ];

  const getCurrentData = () => {
    switch (activeTab) {
      case 'friends': return mockFriends;
      case 'pending': return mockPendingRequests;
      case 'sent': return mockSentRequests;
      default: return mockFriends;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Friends</h1>
          <p className="text-gray-600 text-lg">Manage your connections and stay in touch</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-2 shadow-sm border border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-200 transform ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-md scale-105'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <tab.icon size={18} />
                <span className="font-medium">{tab.label}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getCurrentData().map((friend, index) => (
            <div
              key={friend.id}
              className="animate-fadeIn"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <FriendCard
                friend={friend}
                showMessageButton={activeTab === 'friends'}
                onMessage={handleMessage}
              />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {getCurrentData().length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-6 shadow-sm">
              <User size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No {activeTab} found</h3>
            <p className="text-gray-500">
              {activeTab === 'friends' && "Start connecting with people!"}
              {activeTab === 'pending' && "No pending friend requests."}
              {activeTab === 'sent' && "No sent friend requests."}
            </p>
          </div>
        )}
      </div>

      {/* Message Panel */}
      <MessagePanel
        friend={selectedFriend}
        isOpen={isMessagePanelOpen}
        onClose={closeMessagePanel}
      />
    </div>
  );
}

export default App;