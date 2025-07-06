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
    <main>
      <h1>{user?.signInDetails?.loginId}'s todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li
          key={todo.id}>{todo.content} 
          {!todo.isDone && (
            <button onClick={() => setTodoDone(todo.id, true)}>✅ Done</button>
          )}
          <button onClick={() => deleteTodo(todo.id)}>❌ Delete</button>
          </li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
      </div>
      <button onClick={signOut}>Sign out</button>
      <center>Copyright 2025 evaluoi.ai</center>
    </main>
  );
}

export default App;
