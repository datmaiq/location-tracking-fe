import React, { useContext, useEffect, useState } from "react";
import "../index.css";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import AppContext from "../utils/AppContext";

const Message = () => {
  const { socket } = useContext(AppContext);
  const { authUser } = useAuth();
  const [message, setMessage] = useState("");
  const [senderId, setSenderId] = useState("");
  const [chat, setChat] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const sendMessage = async () => {
    if (!selectedFriend) return;

    const newMessage = {
      senderId: authUser._id,
      message,
      receiverId: selectedFriend._id,
      chatId: currentChatId,
    };

    try {
      const res = await axios.post(
        "http://localhost:8000/messages",
        newMessage
      );

      setChat((prev) => [...prev, res.data]);
      console.log(chat);
      setMessage("");

      socket.emit("sendMessage", {
        senderId: authUser._id,
        receiverId: selectedFriend._id,
        message: res.data,
      });
    } catch (err) {
      console.error(err);
    }
  };

  socket.on("getMessage", (message) => {
    console.log(message);
    setChat((prev) => [...prev, message]);
  });

  const fetchMessages = async (chatId) => {
    try {
      const res = await axios.get(`http://localhost:8000/messages/${chatId}`);
      setChat(res.data);
      setCurrentChatId(chatId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUserClick = async (friend) => {
    setSelectedFriend(friend);

    try {
      const res = await axios.get(
        `http://localhost:8000/chat/${authUser._id}/${friend._id}`
      );
      const chat = res.data;

      if (chat) {
        fetchMessages(chat._id);
      } else {
        const newChatRes = await axios.post("http://localhost:8000/chat", {
          senderId: authUser._id,
          receiverId: friend._id,
        });
        setCurrentChatId(newChatRes.data._id);
        setChat([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="w-1/4 bg-white border-r">
        <div className="p-4 border-b">
          <h2 className="text-2xl font-bold">Chat</h2>
          <input
            type="text"
            placeholder="Search"
            className="mt-2 w-full p-2 border rounded"
          />
        </div>
        <ul className="p-4 h-full overflow-y-auto">
          {authUser?.friends.map((friend) => (
            <li
              key={friend._id}
              className="flex items-center justify-between p-2 border-b cursor-pointer"
              onClick={() => handleUserClick(friend)}
            >
              <div className="flex items-center space-x-3">
                <img
                  src={friend.profileBanner}
                  alt={friend.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span>{friend.username}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 bg-gray-50 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <h2 className="text-xl font-semibold">
            {selectedFriend
              ? selectedFriend.username
              : "Select a friend to chat"}
          </h2>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          {chat.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                msg.senderId === authUser._id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-2 rounded ${
                  msg.senderId === authUser._id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300"
                }`}
              >
                {msg.senderId === authUser._id ? (
                  msg.message
                ) : (
                  <>{msg.message}</>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 bg-white border-t flex items-center">
          <input
            type="text"
            className="flex-grow border rounded-l-lg p-2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter message"
          />
          <button
            className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-700"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Message;
