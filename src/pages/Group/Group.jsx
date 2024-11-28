import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../helpers/config";
import { useParams } from "react-router-dom";
import { MeteorsDesign } from "../../components/MeteorsDesign";
import { BackgroundBoxesDesign } from "../../components/BackgroundBoxesDesign";
import { Helmet } from "react-helmet"; 

const Group = () => {
  const { slug } = useParams();
  const [groupData, setGroupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await axios.get(
          `${config.BASE_URL}/notes/getGroupData/${slug}`
        );
        setGroupData(response.data.group);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="flex w-52 flex-col gap-4">
          <div className="skeleton h-32 w-full"></div>
          <div className="skeleton h-4 w-28"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
        </div>
      </div>
    );
  }

  if (error) return <p>Error: {error}</p>;

  if (!groupData) {
    return (
      <div className="min-h-screen">
        <div className="chat chat-start">
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img alt="No data Found" src="./logo.png" />
            </div>
          </div>
          <div className="chat-bubble">Sorry No Data Found.</div>
        </div>
      </div>
    );
  }

  return (
    <> 
      <Helmet>
        <title>{`${groupData.groupName} Group - Notes Saver`}</title>
        <meta
          name="description"
          content={`Explore the ${groupData.groupName} group on Notes Saver. Manage and view notes associated with the ${groupData.Color} group.`}
        />
        <meta
          name="keywords"
          content={`Notes Saver, ${groupData.groupName}, Group Notes, Manage Notes, ${groupData.Color} Group`}
        />
        <meta name="author" content="Notes Saver Team" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`${groupData.groupName} Group - Notes Saver`}
        />
        <meta
          property="og:description"
          content={`Explore the ${groupData.groupName} group on Notes Saver. Manage and view notes associated with the ${groupData.Color} group.`}
        />
        <meta
          property="og:image"
          content="./logo.png"
        />
        <meta
          property="og:url"
          content={`https://noteswebapp-rust.vercel.app/group/${groupData.slug}`}
        />
        <meta property="og:site_name" content="Notes Saver" />
      </Helmet>
      <div className="min-h-screen bg-slate-100 dark:bg-gray-950">
        <BackgroundBoxesDesign
          title={groupData.groupName}
          description={`Color: ${groupData.Color}`}
        />
        <div className="grid md:grid-cols-4 gap-4 p-1">
          {groupData.notesIds && groupData.notesIds.length === 0 ? (
            <p>No notes found for this group.</p>
          ) : (
            groupData.notesIds.map((note) => (
              <MeteorsDesign
                key={note._id}
                content={note.content}
                createdAt={note.createdAt}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Group;
