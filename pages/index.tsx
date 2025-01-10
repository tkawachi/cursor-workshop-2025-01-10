import { useState, useEffect } from 'react'
import Head from 'next/head'

type Todo = {
  id: string
  task: string
  createdAt: string
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [task, setTask] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos')
      const data = await response.json()
      setTodos(Array.isArray(data) ? data : [])
    } catch (err) {
      setError('Failed to fetch todos')
      setTodos([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!task.trim()) return

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task }),
      })
      const newTodo = await response.json()
      setTodos([newTodo, ...todos])
      setTask('')
    } catch (err) {
      setError('Failed to add todo')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      })
      setTodos(todos.filter(todo => todo.id !== id))
    } catch (err) {
      setError('Failed to delete todo')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Todo App</title>
        <meta name="description" content="Modern Todo application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Todo List
          </h1>

          {error && (
            <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex gap-4">
              <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Add a new task..."
                className="flex-1 p-4 rounded-lg bg-white/10 backdrop-blur-lg border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button
                type="submit"
                className="metallic-button px-8 py-4 rounded-lg text-gray-800 font-semibold hover:shadow-lg"
              >
                Add
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {todos.length === 0 ? (
              <p className="text-center text-white/70">No todos yet. Add one above!</p>
            ) : (
              todos.map((todo) => (
                <div
                  key={todo.id}
                  className="task-card p-4 rounded-lg flex items-center justify-between"
                >
                  <span className="text-white">{todo.task}</span>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="metallic-button px-4 py-2 rounded-lg text-gray-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </>
  )
}
