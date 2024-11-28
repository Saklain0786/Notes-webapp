import React, { useEffect, useState } from 'react';
import getIdFromToken from '../../helpers/GetIdFromToken';
import { SparklesDesign } from '../../components/SparklesDesign';
import axios from 'axios';
import config from '../../helpers/config';
import Cookies from 'js-cookie';
import toast, { Toaster } from 'react-hot-toast';
import { MeteorsDesign } from '../../components/MeteorsDesign';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatedNotesData, setUpdatedNotesData] = useState(''); 
  const [updatedGroupData, setUpdatedGroupData] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getIdFromToken();
      if (data) {
        setUser(data);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('NotesSaverToken');
        
        const notesResponse = await axios.post(
          `${config.BASE_URL}/notes/getNotesByAuthor`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (notesResponse.status === 200 && Array.isArray(notesResponse.data)) {
          setNotes(notesResponse.data);
          toast.success('Notes fetched successfully!');
        } else {
          toast.error('No notes found or error fetching notes.');
        }

        const groupsResponse = await axios.post(
          `${config.BASE_URL}/notes/getGroupsByAuthor`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (groupsResponse.status === 200 && Array.isArray(groupsResponse.data)) {
          setGroups(groupsResponse.data);
          toast.success('Groups fetched successfully!');
        } else {
          toast.error('No groups found or error fetching groups.');
        }
      } catch (error) {
        toast.error('An error occurred while fetching data.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleNoteChange = (newContent) => {
    setUpdatedNotesData(newContent);
  };
  const handleGroupsChange = (newContent) => {
    setUpdatedGroupData(newContent);
  };

  const handleDeleteNotes = async (id) => {
    try {
      const token = Cookies.get('NotesSaverToken');
      const response = await axios.delete(
        `${config.BASE_URL}/notes/deleteNotes/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        toast.success('Note deleted successfully!');
        setNotes(notes.filter(note => note._id !== id));
      } else {
        toast.error('Failed to delete note.');
      }
    } catch (error) {
      toast.error('An error occurred while deleting the note.');
      console.error(error);
    }
  };

  const handleUpdateNotes = async (id) => {
    try {
      const token = Cookies.get('NotesSaverToken');
      const response = await axios.put(
        `${config.BASE_URL}/notes/updateNotes/${id}`,
        { content: updatedNotesData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        toast.success('Note updated successfully!');
        setNotes(notes.map(note => note._id === id ? { ...note, content: updatedNotesData } : note));
      } else {
        toast.error('Failed to update note.');
      }
    } catch (error) {
      toast.error('An error occurred while updating the note.');
      console.error(error);
    }
  };

  const handleDeleteGroup = async (id) => {
    try {
      const token = Cookies.get('NotesSaverToken');
      const response = await axios.delete(
        `${config.BASE_URL}/notes/deleteGroup/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        toast.success('Group deleted successfully!');
        setGroups(groups.filter(group => group._id !== id));
      } else {
        toast.error('Failed to delete group.');
      }
    } catch (error) {
      toast.error('An error occurred while deleting the group.');
      console.error(error);
    }
  };

  const handleUpdateGroups = async (id) => {
    try {
      const token = Cookies.get('NotesSaverToken');
      const response = await axios.put(
        `${config.BASE_URL}/notes/updateGroup/${id}`,
        { content: updatedGroupData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        toast.success('Group updated successfully!');
        setGroups(groups.map(group => group._id === id ? { ...group, content: updatedGroupData } : group));
      } else {
        toast.error('Failed to update group.');
      }
    } catch (error) {
      toast.error('An error occurred while updating the group.');
      console.error(error);
    }
  };

  const handleDeleteAccount = async (id) => {
    try {
      const response = await fetch(`${config.BASE_URL}/user/delete/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        toast.success('Account deleted successfully');
        Cookies.remove('NotesSaverToken');
        window.location.href = '/';
      } else {
        const errorData = await response.json();
        toast.error(errorData.message);
        console.error('Failed to delete account:', errorData.message);
      }
    } catch (error) {
      toast.error('An error occurred while deleting the account.');
      console.error('Error deleting account:', error);
    }
  };

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-slate-100 dark:bg-gray-950 space-y-12 pb-12">
        <SparklesDesign title={`${user && user.name}`} />

        <h2 className="text-5xl text-black dark:text-white text-center">
          My Notes
        </h2>
        <div className="grid md:grid-cols-4 gap-4 p-1">
          {loading ? (
            <p>Loading notes...</p>
          ) : notes.length === 0 ? (
            <p>No notes found for this user.</p>
          ) : (
            notes.map((note) => (
              <div key={note._id}>
                <MeteorsDesign
                  name={note.userId.name}
                  content={note.content}
                  createdAt={note.createdAt}
                />
                <div className="flex justify-between">
                  <div
                    className="btn btn-sm bg-warning text-white"
                    onClick={() => {
                      setUpdatedNotesData(note.content); // Initialize state with note content
                      document.getElementById(`${note._id}/a`).showModal();
                    }}
                  >
                    Edit <i className="fi fi-rr-pen-square"></i>
                    <dialog id={`${note._id}/a`} className="modal bg-slate-300 dark:bg-gray-750">
                      <div className="modal-box">
                        <h3 className="font-bold text-lg">Update Note !!!</h3>

                        <textarea
                          name="updateModelData"
                          id="updateModelData"
                          value={updatedNotesData} // Bind to the state
                          rows={10}
                          onChange={(e) => handleNoteChange(e.target.value)}
                          className="w-full bg-slate-400 dark:bg-slate-800 p-2 rounded-md text-black dark:text-white"
                        ></textarea>

                        <div className="modal-action">
                          <form method="dialog" className="flex justify-between">
                            <button className="btn">Close</button>
                            <button
                              type="button"
                              className="btn bg-orange-700 text-white"
                              onClick={() => handleUpdateNotes(note._id)}
                            >
                              Update <i className="fi fi-rr-pen-square"></i>
                            </button>
                          </form>
                        </div>
                      </div>
                    </dialog>
                  </div>

                  <div
                    className="btn btn-sm bg-red-700 text-white"
                    onClick={() => document.getElementById(`${note._id}`).showModal()}
                  >
                    Delete <i className="fi fi-sr-trash"></i>
                    <dialog id={`${note._id}`} className="modal">
                      <div className="modal-box">
                        <h3 className="font-bold text-lg">
                          Are you sure you want to Delete Note !!!
                        </h3>
                        <div className="modal-action">
                          <form method="dialog" className="flex justify-between">
                            <button className="btn">Close</button>
                            <button
                              type="button"
                              className="btn bg-red-700 text-white"
                              onClick={() => handleDeleteNotes(note._id)}
                            >
                              Delete <i className="fi fi-sr-trash"></i>{" "}
                            </button>
                          </form>
                        </div>
                      </div>
                    </dialog>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <h2 className="text-5xl text-black dark:text-white text-center">
          My Groups
        </h2>
        <div className="grid md:grid-cols-4 gap-4 p-1">
          {loading ? (
            <p>Loading groups...</p>
          ) : groups.length === 0 ? (
            <p>No groups found for this user.</p>
          ) : (
            groups.map((group) => (
              <div key={group._id}>
                <MeteorsDesign
                  name={group.groupName}
                  content={group.Color}
                  createdAt={group.createdAt}
                />
                <div className="flex justify-between">
                  <div
                    className="btn btn-sm bg-warning text-white"
                    onClick={() => {
                      setUpdatedGroupData(group.content); // Initialize state with group content
                      document.getElementById(`${group._id}/a`).showModal();
                    }}
                  >
                    Edit <i className="fi fi-rr-pen-square"></i>
                    <dialog id={`${group._id}/a`} className="modal bg-slate-300 dark:bg-gray-750">
                      <div className="modal-box">
                        <h3 className="font-bold text-lg">Update Group !!!</h3>

                        <textarea
                          name="updateModelData"
                          id="updateModelData"
                          value={updatedGroupData} // Bind to the state
                          rows={10}
                          onChange={(e) => handleGroupsChange(e.target.value)}
                          className="w-full bg-slate-400 dark:bg-slate-800 p-2 rounded-md text-black dark:text-white"
                        ></textarea>

                        <div className="modal-action">
                          <form method="dialog" className="flex justify-between">
                            <button className="btn">Close</button>
                            <button
                              type="button"
                              className="btn bg-orange-700 text-white"
                              onClick={() => handleUpdateGroups(group._id)}
                            >
                              Update <i className="fi fi-rr-pen-square"></i>
                            </button>
                          </form>
                        </div>
                      </div>
                    </dialog>
                  </div>

                  <div
                    className="btn btn-sm bg-red-700 text-white"
                    onClick={() => document.getElementById(`${group._id}`).showModal()}
                  >
                    Delete <i className="fi fi-sr-trash"></i>
                    <dialog id={`${group._id}`} className="modal">
                      <div className="modal-box">
                        <h3 className="font-bold text-lg">
                          Are you sure you want to Delete Group !!!
                        </h3>
                        <div className="modal-action">
                          <form method="dialog" className="flex justify-between space-x-4">
                            <button className="btn">Close</button>
                            <button
                              type="button"
                              className="btn bg-red-700 text-white"
                              onClick={() => handleDeleteGroup(group._id)}
                            >
                              Delete <i className="fi fi-sr-trash"></i>{" "}
                            </button>
                          </form>
                        </div>
                      </div>
                    </dialog>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-center items-center">
          <div className="card w-5xl space-y-12">
            <h1 className='text-7xl text-black dark:text-white'>Account Settings</h1>
            <button className="btn bg-red-900 text-white" onClick={() => document.getElementById('delete_Account').showModal()}>
              Delete Your Account !! <i className="fi fi-ss-trash"></i>
            </button>
            <dialog id="delete_Account" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Hey!</h3>
                <p className="py-4">Are you sure you want to delete this account?</p>
                <div className="modal-action">
                  <form method="dialog">
                    <button className="btn">Close</button>
                  </form>
                  <button className="btn bg-red-900 text-white" onClick={() => handleDeleteAccount(user._id)}>
                    Delete <i className="fi fi-ss-trash"></i>
                  </button>
                </div>
              </div>
            </dialog>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
