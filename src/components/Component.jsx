import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';

const TodoList = () => {
  const [todos, setTodos] = useState([]); // Store the list of all todos
  const [doneTodos, setDoneTodos] = useState([]); // Store completed todos (moved to "Done")
  const [page, setPage] = useState(1); // Current page number
  const [hasMore, setHasMore] = useState(true); // Whether there are more todos to load
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const [infiniteScrollEnabled, setInfiniteScrollEnabled] = useState(true); // Whether infinite scroll is enabled

  // Function to fetch todos based on the current page
  const fetchTodos = async () => {
    if (isLoading) return; // Prevent multiple requests when already loading
    setIsLoading(true);

    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/todos?_limit=5&_page=${page}`
      );
      const newTodos = response.data.map((todo) => ({
        id: todo.id,
        text: todo.title,
        completed: false, // Default to false, since they are initially "pending"
      }));

      // If we've already fetched 20 items, disable infinite scroll
      if (todos.length + newTodos.length >= 5) {
        setInfiniteScrollEnabled(false); // Disable infinite scroll after 20 items
      }

      setTodos((prevTodos) => [...prevTodos, ...newTodos]); // Append new todos
      setHasMore(newTodos.length > 0); // If response has fewer than 10 items, there are no more items
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and fetch more data when the page changes
  useEffect(() => {
    fetchTodos();
  }, [page]);

  // Function to handle the scroll event and trigger more data loading
  const fetchMoreData = useCallback(() => {
    if (hasMore && infiniteScrollEnabled) {
      setPage((prevPage) => prevPage + 1); // Increase the page number for infinite scroll
    }
  }, [hasMore, infiniteScrollEnabled]);

  // Handle pagination button clicks
  const handleNextPage = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1); // Increase page number on "Next"
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1); // Decrease page number on "Previous"
    }
  };

  // Drag-and-drop event handlers
  const handleDragStart = (event, item) => {
    event.dataTransfer.setData('itemId', item.id); // Store the ID of the dragged item
  };

  const handleDrop = (event, status) => {
    event.preventDefault();
    const itemId = event.dataTransfer.getData('itemId');
    const movedTodo = todos.find((todo) => todo.id === parseInt(itemId));

    if (status === 'done') {
      // Move the item to "done" section
      setDoneTodos((prevDoneTodos) => [...prevDoneTodos, movedTodo]);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== movedTodo.id));
    } else {
      // Move the item back to "pending" section
      setTodos((prevTodos) => [...prevTodos, movedTodo]);
      setDoneTodos((prevDoneTodos) => prevDoneTodos.filter((todo) => todo.id !== movedTodo.id));
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault(); // Allow drop
  };

  return (
    <div className="todo-container">
      <div className="todo-list flex" style={{  display:"flex"}}>
        {/* Pending Todos Section */}
        <div
          className="todo-section"
          onDrop={(event) => handleDrop(event, 'pending')}
          onDragOver={handleDragOver}
        >
          <h2>Pending Tasks</h2>
          <InfiniteScroll
            dataLength={todos.length} // Length of current todos
            next={fetchMoreData} // Function to load more data when scrolled
            hasMore={hasMore} // Whether there is more data to load
            loader={<p>Loading more items...</p>} // Loading indicator
            endMessage={<p>No more items to load</p>} // End message when no more data
          >
            {todos.map((todo) => (
              <div
                key={todo.id}
                draggable
                onDragStart={(event) => handleDragStart(event, todo)}
                style={{
                  padding: '10px',
                  margin: '5px',
                  backgroundColor: '#f0f0f0',
                  cursor: 'move',
                }}
              >
                {todo.text}
              </div>
            ))}
          </InfiniteScroll>
        </div>

        {/* Done Todos Section */}
        <div
          className="todo-section"
          onDrop={(event) => handleDrop(event, 'done')}
          onDragOver={handleDragOver}
        >
          <h2>Completed Tasks</h2>
          {doneTodos.map((todo) => (
            <div
              key={todo.id}
              draggable
              onDragStart={(event) => handleDragStart(event, todo)}
              style={{
                padding: '10px',
                margin: '5px',
                backgroundColor: '#d3ffd3',
                cursor: 'move',
              }}
            >
              {todo.text}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Buttons (only shown when infinite scroll is disabled) */}
      {!infiniteScrollEnabled && (
        <div className="pagination">
          <button onClick={handlePreviousPage} disabled={page === 1 || isLoading}>
            Previous
          </button>
          <button onClick={handleNextPage} disabled={!hasMore || isLoading}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TodoList;
