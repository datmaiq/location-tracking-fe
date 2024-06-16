import React, { useContext, useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import AppContext from "../utils/AppContext";

const Message = () => {
  const { socket } = useContext(AppContext);
  const { authUser } = useAuth();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const sendMessage = async () => {
    if (!selectedFriend || message.trim() === "") return;

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

  useEffect(() => {
    if (authUser) {
      socket.emit("addUser", authUser._id);

      // TODO(datmaiq): investigate socket is disconnected frequently
      return () => {
        // socket.disconnect();
      };
    }
  }, [authUser, socket]);

  useEffect(() => {
    socket.on("getMessage", (message) => {
      setChat((prev) => [...prev, message.message]);
    });

    return () => {
      socket.off("getMessage");
    };
  }, [socket]);

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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const filteredFriends = authUser?.friends.filter((friend) =>
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className=" bg-gray-100 flex flex-col">
      <div className="w-full bg-white border-b p-4">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold">Chat</h2>
        </div>
      </div>
      <div className="flex flex-1">
        <div className="w-1/4 bg-white border-r overflow-y-auto">
          <input
            type="text"
            placeholder="Search"
            className="mt-2 p-2 border rounded w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <ul className="p-4 h-full">
            {filteredFriends.map((friend) => (
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
        <div className="flex-1 flex bg-white flex-col justify-between h-[650px]">
          <div className="flex flex-col p-4 overflow-y-auto h-full ">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">
                {selectedFriend
                  ? selectedFriend.username
                  : "Select a friend to chat"}
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {chat.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${
                    msg.senderId === authUser._id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`p-2 rounded ${
                      msg.senderId === authUser._id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-white border-t flex items-center">
            <input
              type="text"
              className="flex-grow border rounded-l-lg p-2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter message"
            />
            <button
              className="bg-primary-500 text-white p-2 rounded-r-lg hover:bg-primary-700"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
