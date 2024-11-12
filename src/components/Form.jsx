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