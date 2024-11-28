import React, { useEffect, useState } from "react";
import UserProfile from "../../helpers/userProfile";
import axios from "axios";
import Cookies from "js-cookie";
import config from "../../helpers/config";
import toast, { Toaster } from "react-hot-toast";
import { ProfilePicture } from "../../helpers/userProfile";
import { Helmet } from "react-helmet";
import {
  handleCopyText,
  handleShareLinkedIn,
  handleShareWhatsApp,
} from "../../helpers/Share";

const Dashboard = () => {
  const [groupName, setGroupName] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [loading, setLoading] = useState(false);
  const [groupList, setGroupList] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [noteList, setNoteList] = useState([]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [ischatOpen, setchatOpen] = useState(false);
  const [groupchat, setGroupChat] = useState(false);

  const setgroupChat = () => {
    setchatOpen(!ischatOpen);
  };
  const handleBackButton = () => {
    setGroupChat(!groupchat);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = Cookies.get("NotesSaverToken");

    if (!token) {
      console.error("User is not authenticated");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        `${config.BASE_URL}/notes/createGroup`,
        {
          groupName: groupName,
          Color: selectedColor,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success("Group created successfully!");
        setLoading(false);
        setIsModalOpen(false);
        setGroupName("");
        setSelectedColor("");
        setGroupList((prevList) => [...prevList, response.data]);
      } else {
        toast.error("Failed to create group:");
        setLoading(false);
        console.error("Failed to create group:", response.data.message);
      }
    } catch (error) {
      console.error("Error creating group:");
      console.error("Error creating group:", error);
      setLoading(false);
    }
  };

  const handleNoteSubmit = async (event) => {
    event.preventDefault();
    const token = Cookies.get("NotesSaverToken");

    if (!token) {
      console.error("User is not authenticated");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${config.BASE_URL}/notes/createNotes`,
        {
          GroupId: selectedGroup._id,
          content: noteContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setNoteContent(""); // Clear the textarea
        fetchNotesList();
        toast.success("Note created successfully!");
      } else {
        console.error("Failed to create note:", response.data.message);
        toast.error("Failed to create note:");
      }
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error("Error occurred during saving your note");
    } finally {
      setLoading(false);
    }
  };

  const fetchNotesList = async () => {
    try {
      const response = await axios.get(
        `${config.BASE_URL}/notes/notes/${selectedGroup._id}`
      );
      if (response.status === 200) {
        console.log("Your notes are", response.data);
        toast.success("Notes fetched successfully!");
        setNoteList(response.data);
      }
    } catch (error) {
      toast.error("Error fetching notes");
      console.error("Error fetching notes:", error);
    }
  };
  const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A6", "#FFD733"];
  useEffect(() => {
    const fetchGroupList = async () => {
      try {
        const response = await axios.get(`${config.BASE_URL}/notes/groups`);
        if (response.status === 200) {
          toast.success("Group list fetched successfully!");
          setGroupList(response.data);
        }
      } catch (error) {
        toast.error("Error fetching group list");
        console.error("Error fetching group list:", error);
      }
    };

    fetchGroupList();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchNotesList();
    }
  }, [selectedGroup]);

  return (
    <>
      <Toaster />
      <Helmet>
        <title>Dashboard - Notes Saver</title>
        <meta
          name="description"
          content="Manage and save your notes easily on the Notes Saver dashboard. Add, edit, and organize your notes efficiently."
        />
        <meta
          name="keywords"
          content="Notes Saver, Dashboard, Manage Notes, Add Notes, Save Notes, Organize Notes"
        />
        <meta name="author" content="Notes Saver Team" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Dashboard - Notes Saver" />
        <meta
          property="og:description"
          content="Manage and save your notes easily on the Notes Saver dashboard. Add, edit, and organize your notes efficiently."
        />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/dbqq41bpc/image/upload/v1723419754/codesaarthi/7_tptucc.png"
        />
        <meta
          property="og:url"
          content="https://noteswebapp-rust..app/dashboard"
        />
        <meta property="og:site_name" content="Notes Saver" />
      </Helmet>

      <div className="min-h-screen bg-slate-400 dark:bg-gray-950">
        <div className="flex flex-wrap ">
          <div
            className={`  w-full lg:w-1/3 min-h-screen relative lg:left-12 lg:-top-20 flex flex-col justify-center items-center ${
              groupchat ? "hidden lg:block" : " block "
            }`}
          >
            <h1 className="text-4xl text-black dark:text-white md:mt-20 my-3 relative top-0 z-10  w-full p-4 text-center">
              Pocket Notes
            </h1>

            <div
              className={`flex-grow  relative md:-left-12 space-y-2 p-3 text-xl `}
              onClick={setgroupChat}
            >
              {groupList.length > 0 &&
                groupList.map((group) => (
                  <div
                    key={group._id}
                    className="flex justify-around items-center w-96"
                  >
                    <UserProfile
                      userName={group.groupName}
                      color={group.Color}
                      onClick={() => {
                        console.log("Selected group:", group);
                        setSelectedGroup(group);
                        setGroupChat(!groupchat);
                      }}
                    />
                    <details className="dropdown">
                      <summary className="btn  bg-slate-400 dark:bg-gray-950 ">
                        {" "}
                        <i className="fi fi-sr-share text-black dark:text-white cursor-pointer"></i>
                      </summary>
                      <ul className="menu dropdown-content rounded-box z-[1] w-22 p-4 shadow bg-slate-300 dark:bg-gray-800 space-y-4 text-black dark:text-white">
                        <li
                          className="cursor-pointer"
                          onClick={() => {
                            handleCopyText(
                              `${window.location.origin}/groups/${group.slug}`
                            );
                          }}
                        >
                          Copy Link
                        </li>
                        <li
                          className="cursor-pointer"
                          onClick={() => {
                            handleShareWhatsApp(
                              `${window.location.origin}/groups/${group.slug}`
                            );
                          }}
                        >
                          Whatsapp
                        </li>
                        <li
                          className="cursor-pointer"
                          onClick={() => {
                            handleShareLinkedIn(
                              `${window.location.origin}/groups/${group.slug}`
                            );
                          }}
                        >
                          Linkedin
                        </li>
                      </ul>
                    </details>
                  </div>
                ))}
            </div>

            <div className="relative -top-36 -mt-20 ml-14 md:ml-0 md:-top-24 md:-mt-6 bottom-0 z-10  w-5/6   p-4 flex justify-end">
              <button onClick={openModal}>
                <i className="fi fi-ss-add md:text-7xl text-5xl text-cyan-700  cursor-pointer"></i>{" "}
              </button>
            </div>
          </div>

          <div className="w-full lg:w-2/3 flex flex-col relative  ">
            {selectedGroup ? (
              <div>
                <div
                  className="    w-full right-0 p-2"
                  style={{ backgroundColor: selectedGroup.Color }}
                >
                  <div className="flex justify-between items-center space-x-4">
                    <div className="flex text-cyan-800 ">
                      {" "}
                      <span
                        className={`mt-2  font-mono text-2xl lg:hidden w-8 h-8 `}
                        onClick={handleBackButton}
                      >
                        &lt;
                      </span>
                      <ProfilePicture
                        name={selectedGroup.groupName}
                        color={selectedGroup.Color}
                      />
                    </div>
                    <h2 className="text-3xl font-bold text-black dark:text-white">
                      {selectedGroup.groupName}
                    </h2>
                    <p className="text-sm text-black dark:text-white text-center">
                      📅 <br />
                      {new Date(selectedGroup.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div
                  className="flex-grow overflow-y-auto p-4   "
                  style={{ height: "500px" }}
                >
                  <div className="p-4 shadow-inner shadow-white space-y-8">
                    {noteList.length > 0 ? (
                      noteList.map((note, index) => (
                        <div
                          key={index}
                          className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-xl shadow-gray-600  hover:scale-y-125"
                        >
                          <div className="text-lg text-black dark:text-white mt-2">
                            {note.content}
                          </div>

                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 flex justify-end">
                            <p>
                              {new Date(note.createdAt).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}{" "}
                              <strong> . </strong>
                              {new Date(note.createdAt).toLocaleTimeString(
                                "en-GB",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-600 dark:text-gray-400">
                        No notes available.
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-4 text-end z-10 relative">
                  <form onSubmit={handleNoteSubmit} className="relative">
                    <div className="relative">
                      <textarea
                        name="notesByUser"
                        id="notesByUser"
                        rows={4}
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        className="w-full bg-slate-400 dark:bg-slate-800 p-2 rounded-md text-black dark:text-white"
                        placeholder="Enter your note here..."
                      ></textarea>
                      <button
                        type="submit"
                        className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                        disabled={loading || noteContent.trim() === ""}
                      >
                        {loading ? (
                          "Saving..."
                        ) : (
                          <>
                            <i className="fi fi-sr-location-arrow"></i>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-4">
                <img
                  src="https://res.cloudinary.com/ducw7orvn/image/upload/v1723408091/image-removebg-preview_1_xphrkc.png"
                  alt="Pocket Notes"
                  className="w-full "
                  loading="lazy"
                />
                <h1 className="text-5xl text-black dark:text-white text-center">
                  Pocket Notes
                </h1>
                <p className="text-black dark:text-white text-2xl text-center">
                  Send and receive messages without keeping your phone online.{" "}
                  <br />
                  Use Pocket Notes on up to 4 linked devices and 1 mobile phone
                </p>
                <p className="text-black dark:text-white text-center">
                  🔒 end-to-end encrypted
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <dialog
        id="CreateNewGroup"
        className={`modal ${isModalOpen ? "modal-open" : ""}`}
      >
        <div className="modal-box bg-slate-300 dark:bg-slate-900">
          <h3 className="font-bold text-lg text-black dark:text-white">
            Create New Group!
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="py-4">
              <label
                htmlFor="group-name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Group Name
              </label>
              <input
                type="text"
                id="group-name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Enter group name"
              />
            </div>

            <div className="py-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Choose Color
              </label>
              <div className="flex space-x-2 mt-2">
                {colors.map((color) => (
                  <div
                    key={color}
                    className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                      selectedColor === color
                        ? "border-black"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorSelect(color)}
                  />
                ))}
              </div>
            </div>

            <div className="modal-action mt-4 flex justify-between">
              <button type="button" onClick={closeModal} className="btn">
                Close
              </button>
              <button
                type="submit"
                className="btn bg-blue-500 hover:bg-blue-600 text-white"
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default Dashboard;
