import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import Blog from "./Form";

function Profile() {
  async function handleLogout() {
    try {
      await auth.signOut();
      window.location.href = "/login";
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }
  return (
    <div>
       <button className="btn btn-primary" onClick={handleLogout}>
            Logout
          </button>
   <Blog/>
    </div>
  );
}
export default Profile;