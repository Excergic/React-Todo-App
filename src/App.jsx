import React, { useState } from 'react';
import './App.css'
function App() {
  const [todos, setTodos] = useState([]);

  function addTask(task) {
    setTodos([...todos, {
      title: task,
      id: crypto.randomUUID(),
      is_completed: false
    }]);
  }

  function toggleComplete(id) {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, is_completed: !todo.is_completed } : todo
    ));
  }

  function deleteTask(id) {
    setTodos(todos.filter(todo => todo.id !== id));
  }

  function editTask(id, newTitle) {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, title: newTitle } : todo
    ));
  }

  return (
    <div className='wrapper'>
      <Header />
      <TodoHero 
        todos_completed={todos.filter(todo => todo.is_completed).length} 
        total_todos={todos.length} 
      />
      <Form addTask={addTask} />
      <TodoList 
        todos={todos} 
        toggleComplete={toggleComplete} 
        deleteTask={deleteTask}
        editTask={editTask}
      />
    </div>
  );
}



// Header Component (Static)
function Header() {
  return (
    <div style={{display: "flex", justifyContent: "center", padding: 20, backgroundColor: "lightblue", borderRadius: 10}}>
      <h1>Complete Your Daily Tasks</h1>
    </div>
  );
}

// Todo Hero Component (Dynamic)
function TodoHero({todos_completed, total_todos}) {
  return (
    <section>
      <div>
        <p>Task Done: {todos_completed}</p>
        <p>Total Tasks: {total_todos}</p>
        <p>Crush It</p>
      </div>
    </section>
  );
}

// Form Component => Input with submit button
function Form({ addTask }) {
  const [task, setTask] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    if (task.trim() === "") return;
    addTask(task);
    setTask(""); // Reset input
  }

  return (
    <form className='form' onSubmit={handleSubmit}>
      <label htmlFor='todo'>
        <input
          type='text'
          name='task'
          id='todo'
          placeholder='Put your next task'
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
      </label>
      <button type='submit'>Add Task</button>
    </form>
  );
}

// Todo list component
function TodoList({ todos, toggleComplete, deleteTask, editTask }) {
  const [editMode, setEditMode] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  function handleEdit(item) {
    setEditMode(item.id);
    setNewTitle(item.title);
  }

  function handleSave(id) {
    editTask(id, newTitle);
    setEditMode(null);
  }

  function Item({ item }) {
    return (
      <li 
        id={item?.id} 
        className={`todo_item ${item.is_completed ? 'completed' : ''}`}
        onAnimationEnd={(e) => {
          if (e.currentTarget.classList.contains('cracked')) {
            deleteTask(item.id);
          }
        }}
      >
        <button 
          className='todo_items_left' 
          onClick={() => toggleComplete(item.id)}
        >
          {item.is_completed ? <span className='checkmark'>✔</span> : <span>○</span>}
        </button>

        {editMode === item.id ? (
          <input 
            type="text" 
            value={newTitle} 
            onChange={(e) => setNewTitle(e.target.value)}
            className='edit_input'
            autoFocus
          />
        ) : (
          <p>{item?.title}</p>
        )}

        <div className='todo_item_right'>
          {editMode === item.id ? (
            <button onClick={() => handleSave(item.id)}>Save</button>
          ) : (
            <button onClick={() => handleEdit(item)}>Edit</button>
          )}
          <button 
            onClick={() => {
              document.getElementById(item.id).classList.add('cracked');
              setTimeout(() => deleteTask(item.id), 500); // Delayed delete for animation
            }}
          >
            Delete
          </button>
        </div>
      </li>
    )
  }

  return (
    <ol className='todo_list'>
      {todos && todos.length > 0 ? (
        todos.map((item, index) => <Item key={index} item={item} />)
      ) : (
        <p>Seems lonely in here, what are you up to?</p>
      )}
    </ol>
  );
}




export default App;
