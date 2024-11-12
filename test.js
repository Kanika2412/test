/////firebase.js


import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDrB9FupDgjjVk4_guLC24ydG3retE3bME",
  authDomain: "login-auth-4736e.firebaseapp.com",
  projectId: "login-auth-4736e",
  storageBucket: "login-auth-4736e.appspot.com",
  messagingSenderId: "10562914305",
  appId: "1:10562914305:web:2cff37be4fa9ccf0a29800"
};


const app = initializeApp(firebaseConfig);

export const auth=getAuth();
export const db=getFirestore(app);
export default app;


/////Login.jsx

import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "./firebase";
import { toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please provide both email and password", {
        position: "bottom-center",
      });
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in Successfully");
      window.location.href = "/profile";
      toast.success("User logged in Successfully", {
        position: "top-center",
      });
    } catch (error) {
      console.log(error.message);

      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Login</h3>

      <div className="mb-3">
        <label>Email address</label>
        <input
          type="email"
          className="form-control"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="d-grid">
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </div>
      <p className="forgot-password text-right">
        New user <a href="/register">Register Here</a>
      </p>
    </form>
  );
}

export default Login;



//////Register.jsx

import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth, db } from "./firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.log(user);
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: fname,
          lastName: lname,
          photo:""
        });
      }
      console.log("User Registered Successfully!!");
      toast.success("User Registered Successfully!!", {
        position: "top-center",
      });
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h3>Sign Up</h3>

      <div className="mb-3">
        <label>First name</label>
        <input
          type="text"
          className="form-control"
          placeholder="First name"
          onChange={(e) => setFname(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label>Last name</label>
        <input
          type="text"
          className="form-control"
          placeholder="Last name"
          onChange={(e) => setLname(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Email address</label>
        <input
          type="email"
          className="form-control"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="d-grid">
        <button type="submit" className="btn btn-primary">
          Sign Up
        </button>
      </div>
      <p className="forgot-password text-right">
        Already registered <a href="/login">Login</a>
      </p>
    </form>
  );
}
export default Register;




////Profile.jsx

import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import Blog from "./Blog";

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



/////Blog.jsx
import React, { useState } from 'react';

export default function Blog() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [taskContent, setTaskContent] = useState('');

  const [editTaskId, setEditTaskId] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case 'name':
        setTaskName(value);
        break;
      case 'content':
        setTaskContent(value);
        break;
   
      default:
        break;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (taskName.trim() !== '' && taskContent.trim() !== '' ) {
      if (editTaskId !== null) {
        const updatedTasks = tasks.map(task => {
          if (task.id === editTaskId) {
            return {
              ...task,
              name: taskName,
              content: taskContent,
             
            };
          }
          return task;
        });
        setTasks(updatedTasks);
        setEditTaskId(null);
      } else {
        const newTask = {
          id: Date.now(),
          name: taskName,
          content: taskContent,
        
       
        };
        setTasks([...tasks, newTask]);
      }
      setTaskName('');
      setTaskContent('');
     
    }
  };

  const handleEdit = (id) => {
    const taskToEdit = tasks.find(task => task.id === id);
    if (taskToEdit) {
      setTaskName(taskToEdit.name);
      setTaskContent(taskToEdit.content);
    
      setEditTaskId(id);
    }
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    if (editTaskId === id) {
      setEditTaskId(null);
    }
  };

  return (
    <div className="container">
      <h1>Task Manager</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="name"
          placeholder="Name" 
          value={taskName} 
          onChange={handleChange} 
        />
        <input 
          type="text" 
          name="content"
          placeholder="content" 
          value={taskContent} 
          onChange={handleChange} 
        />
       
        <button type="submit">{editTaskId !== null ? 'Update Task' : 'Add Task'}</button>
      </form>
      <ul>
        {tasks.map(task => {

      return(
<li key={task.id}>
            <div>
              <strong>Name:</strong> {task.name}<br />
              <strong>content:</strong> {task.content}<br />
             
            </div>
            <div>
              <button onClick={() => handleEdit(task.id)}>Edit</button>
              <button onClick={() => handleDelete(task.id)}>Delete</button>
            </div>
          </li>
      )
          
          })}
      </ul>
    </div>
  );
}