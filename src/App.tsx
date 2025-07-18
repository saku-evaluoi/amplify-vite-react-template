import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();


function App() {
  const { user, signOut } = useAuthenticator();
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }
  
  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  // setTodoDone
  function setTodoDone(id: string, isDone: boolean) {
    client.models.Todo.update({ id, isDone })
  }


  return (
    <div className="app-container">
      <nav className="sidebar">
        <div className="nav-header">evaluoi.ai</div>
        <div className="nav-buttons">
          <button onClick={() => window.location.href = "/"}>Home</button>
          <button onClick={() => window.location.href = "/about"}>About</button>
          <button onClick={() => window.location.href = "/contact"}>Contact</button>
          <button onClick={() => window.location.href = "/todos"}>Todos</button>
        </div>
      </nav>
      <main className="main-content">
        <div className="content">
          <h1>{user?.signInDetails?.loginId}'s todos</h1>

          <button onClick={createTodo}>+ new</button>
          <ul>
            {todos.map((todo) => (
              <li
              key={todo.id}>{todo.content} 
              {todo.isDone && (
                <div style={{ float: "right" }}>
                  <button onClick={() => setTodoDone(todo.id, false)}>🔄 </button>&nbsp;
                  <button onClick={() => deleteTodo(todo.id)}>❌ Delete</button>
                </div>
              )}
              {!todo.isDone && (
                <div style={{ float: "right" }}>
                  <button onClick={() => setTodoDone(todo.id, true)}>✅ </button>&nbsp;
                  <button onClick={() => deleteTodo(todo.id)}>❌ Delete</button>
                </div>
              )}
              </li>
            ))}
          </ul>
          <div>

          </div>
          <button onClick={signOut}>Sign out</button>
        </div>
        <footer>
          <p>Copyright 2025 evaluoi.ai</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
