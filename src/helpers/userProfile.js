import React from "react";

const getInitials = (name) => {
  const nameArray = name.split(" ");
  const initials = nameArray.slice(0, 2).map((n) => n[0]).join("");
  return initials.toUpperCase();
};

const getRandomColor = () => {
    const colors = [
      "bg-cyan-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-yellow-500",
      "bg-red-500",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };


export const ProfilePicture = ({ name , color}) => {
  const initials = getInitials(name);
 const backgroundColor = getRandomColor();

  return (
    <div style={{ backgroundColor: color || backgroundColor }}  className="text-white rounded-full h-12 w-12 flex items-center justify-center font-bold text-lg">
  {initials}
</div>

  );
};

// Example usage:
const UserProfile = ({userName , color , onClick}) => { 
  return ( 
     <div onClick={onClick} className="cursor-pointer p-4 flex items-center space-x-4">
       <ProfilePicture name={userName} color = {color} />
       <span className="text-black dark:text-white font-bold cursor-pointer">{userName}</span>
     </div>
  );
};

export default UserProfile;
