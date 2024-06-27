import React, { useEffect, useRef, useState } from "react";
import { BsFillEmojiSmileFill, BsThreeDotsVertical } from "react-icons/bs";
import { BiSolidSend } from "react-icons/bi";
import { LuArrowLeft, LuUserX, LuUserPlus } from "react-icons/lu";
import userImage from "../assets/user.png";
import { useNavigate, useParams } from "react-router-dom";
import useGetUserToChat from "../hooks/useGetUserToChat";
import toast from "react-hot-toast";
import axios from "axios";
import { messageRoute, roomRoute, userRoute } from "../utils/APIRoutes";
import useGetUserData from "../hooks/useGetUserData";
import classNames from "classnames";
import { socket } from "../components/Layout";
import TimeAgo from "timeago-react";
import useGetMessages from "../hooks/useGetMessages";
import { useUserContext } from "../context/UserContextProvider";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { MdWavingHand } from "react-icons/md";
import { useStatesContext } from "../context/StatesContextProvider";

function Conversation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const messagesEndScroller = useRef(null);
  const { user, setLatestMessages, setUser, latestMessages, activeUsers } =
    useUserContext();
  const { isDarkMode } = useStatesContext();

  const [userToChat, setUserToChat] = useState({});
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [isDateShown, setIsdDateShown] = useState("");

  const { getUserDataFunction } = useGetUserData();
  const {
    getUserToChatFuntion,
    isGetUserToChatLoading,
    setIsGetUserToChatLoading,
  } = useGetUserToChat();
  const { getMessagesFunction, isGetMessagesLoading } = useGetMessages();

  // get user to chat
  const handleGetUserToChat = async () => {
    setIsGetUserToChatLoading(true);
    try {
      const response = await getUserToChatFuntion(id);

      setUserToChat(response.data);
      // console.log(response.data);
      socket.emit("leaveRoom", roomId);

      setRoomId("");

      // getRoom
      try {
        const userToken = localStorage.getItem("userToken");
        const getRoom = await axios.post(
          `${roomRoute}/${id}`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        socket.emit("joinRoom", getRoom.data.roomId);
        setRoomId(getRoom.data.roomId);
      } catch (error) {
        toast.error("Room id not found/created", {
          style: {
            background: isDarkMode && "#262626",
            color: isDarkMode && "#F1F5F9",
          },
        });
        console.log(error);
      }
    } catch (error) {
      toast.error(error, {
        style: {
          background: isDarkMode && "#262626",
          color: isDarkMode && "#F1F5F9",
        },
      });
      console.log(error);
    }
  };

  // leave room
  const handleLeaveRoom = () => {
    socket.emit("leaveRoom", roomId);
    navigate("/");
  };

  // add user from contact
  const handleAddUser = async () => {
    try {
      const userToken = localStorage.getItem("userToken");
      const response = await axios.post(
        `${userRoute}/addToContact/${id}`,
        {},
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      toast.success(response.data.message, {
        style: {
          background: isDarkMode && "#262626",
          color: isDarkMode && "#F1F5F9",
        },
      });

      // add the user in contacts locally
      setUser((prev) => ({
        ...prev,
        contacts: [...prev.contacts, userToChat],
      }));
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message, {
        style: {
          background: isDarkMode && "#262626",
          color: isDarkMode && "#F1F5F9",
        },
      });
    }
  };

  // remove user from contact
  const handleRemoveUser = async () => {
    try {
      const userToken = localStorage.getItem("userToken");
      const response = await axios.delete(
        `${userRoute}/removeFromContact/${id}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      toast.success(response.data.message, {
        style: {
          background: isDarkMode && "#262626",
          color: isDarkMode && "#F1F5F9",
        },
      });

      // update user contacts locally
      const updatedContacts = user.contacts.filter(
        (contact) => contact._id !== id
      );

      setUser((prev) => ({ ...prev, contacts: updatedContacts }));
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message, {
        style: {
          background: isDarkMode && "#262626",
          color: isDarkMode && "#F1F5F9",
        },
      });
    }
  };

  // send message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!messageInput) return console.log("no message");

    try {
      const userToken = localStorage.getItem("userToken");
      const response = await axios.post(
        `${messageRoute}/${id}`,
        { content: messageInput },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      // add the roomId
      const messageData = {
        ...response.data,
        roomId,
      };

      // emit the sent message
      socket.emit("sendMessage", messageData);
      socket.emit("sendNotif", messageData);

      setLatestMessages((prev) => ({ ...prev, [id]: response.data }));

      setMessages((prev) => [...prev, response.data]);
      setMessageInput("");
    } catch (error) {
      console.log(error);
    }
  };

  // toggle date
  const handleToggleDate = (id) => {
    if (isDateShown === id) {
      setIsdDateShown("");
    } else {
      setIsdDateShown(id);
    }
  };

  // refresh if the id params changes
  useEffect(() => {
    const getMessage = async () => {
      setMessages([]);
      try {
        const response = await getMessagesFunction(id);
        setMessages(response.data);
      } catch (error) {
        toast.error(error, {
          style: {
            background: isDarkMode && "#262626",
            color: isDarkMode && "#F1F5F9",
          },
        });
        console.log(error);
      }
    };

    getMessage();
    handleGetUserToChat();
  }, [id]);

  // for receiving message from socket.io
  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);

      setLatestMessages((prev) => ({ ...prev, [id]: data }));
    });
  }, []);

  // auto scroller
  useEffect(() => {
    if (messagesEndScroller.current) {
      messagesEndScroller.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, id]);

  // add emoji
  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setMessageInput(messageInput + emoji);
  };

  return (
    <div className="z-10 flex flex-col w-full h-full bg-white dark:bg-neutral-900 md:rounded-lg">
      {isGetUserToChatLoading ? (
        <div className="flex items-center justify-center flex-1 gap-2 ">
          <span className="loading loading-spinner loading-sm"></span>
          <div className="text-lg">Loading</div>
        </div>
      ) : (
        <>
          {/* header */}
          <div className="flex items-center justify-between gap-2 px-4 py-3 border-b-4 border-slate-100 dark:border-neutral-950">
            <div className="p-2 rounded-full cursor-pointer hover:bg-slate-100 md:hidden dark:hover:bg-neutral-800">
              <LuArrowLeft className="text-2xl" onClick={handleLeaveRoom} />
            </div>

            <div className="flex items-center gap-4 mr-auto">
              <div className="relative w-12">
                {activeUsers.includes(userToChat.username) && (
                  <span className="absolute top-0 right-0 w-3 rounded-full bg-custom-green aspect-square outline outline-2 outline-white dark:outline-neutral-900 "></span>
                )}
                <img
                  src={userToChat.imageUrl || userImage}
                  alt="user image"
                  className="object-cover w-full rounded-full aspect-square"
                />
              </div>
              <h3 className="text-lg font-semibold">{`${userToChat.firstname} ${userToChat.lastname}`}</h3>
            </div>

            <div className="dropdown dropdown-bottom dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="p-2 rounded-full cursor-pointer hover:bg-slate-100 dark:hover:bg-neutral-800">
                <BsThreeDotsVertical className="text-2xl" />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1]  p-2 shadow bg-white dark:bg-neutral-900 rounded text-nowrap">
                {user.contacts.some((contact) => contact._id === id) ? (
                  <li
                    onClick={handleRemoveUser}
                    className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-slate-100 dark:hover:bg-neutral-800">
                    <LuUserX />
                    <a>Remove user</a>
                  </li>
                ) : (
                  <li
                    onClick={handleAddUser}
                    className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-slate-100 dark:hover:bg-neutral-800">
                    <LuUserPlus />
                    <a>Add user</a>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* conversations */}
          <div className="flex-1 ">
            <div className="relative w-full h-full overflow-x-hidden overflow-y-auto">
              <div className="absolute inset-0 ">
                {messages.length > 0 ? (
                  <>
                    {messages.map((message, index) => (
                      <div
                        ref={messagesEndScroller}
                        key={index}
                        className={classNames("chat px-2", {
                          "chat-start  ": id === message.sender,
                          "chat-end ": id !== message.sender,
                        })}>
                        <div
                          onClick={() => handleToggleDate(message._id)}
                          className={classNames("chat-bubble", {
                            "bg-slate-100 dark:bg-neutral-700 ":
                              id === message.sender,
                            "text-white dark:text-slate-100 bg-sky-500 place-self-end":
                              id !== message.sender,
                          })}>
                          {message.content}
                        </div>
                        <div
                          className={classNames(
                            "chat-footer mt-1 transition-all dark:text-neutral-500 text-slate-400 overflow-hidden",
                            {
                              "h-0": isDateShown !== message._id,
                              "h-5": isDateShown === message._id,
                            }
                          )}>
                          <TimeAgo datetime={message.createdAt} />
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full gap-3 text-slate-400 dark:text-neutral-600">
                    <p className="text-lg ">Say Hi</p>
                    <MdWavingHand className="text-3xl animate-wiggle" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* user input */}
          <div className="border-t-4 border-slate-100 dark:border-neutral-950">
            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-4 p-4">
              <div className="dropdown dropdown-top">
                <div
                  tabIndex={0}
                  role="button"
                  className="text-3xl rounded-full cursor-pointer text-slate-500 dark:text-neutral-600 ">
                  <BsFillEmojiSmileFill />
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] mb-4 outline outline-1 outline-white/10">
                  <Picker
                    data={data}
                    onEmojiSelect={addEmoji}
                    previewPosition="none"
                    theme={`${isDarkMode ? "dark" : "light"}`}
                  />
                </ul>
              </div>
              <input
                type="text"
                placeholder="Write a message"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1 px-4 py-2 rounded-full outline outline-1 focus-within:outline-sky-500 outline-slate-300 dark:bg-neutral-900 dark:outline-neutral-700"
              />
              <button
                type="submit"
                className="flex items-center justify-center w-10 text-lg text-white transition-all rounded-full dark:text-slate-100 bg-sky-500 aspect-square active:scale-95">
                <BiSolidSend />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default Conversation;
