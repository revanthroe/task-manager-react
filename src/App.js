import Header from './components/Header'
import Footer from './components/Footer'
import Tasks from './components/Tasks'
import About from './components/About'
import AddTask from './components/AddTask'
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'



function App() {
  const [showAddTask, setShowAddTask] = useState(false)

  const [tasks, SetTasks] = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      SetTasks(tasksFromServer)
    }
    getTasks()
  }, [])

  // Fetch Tasks from Backend
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()
    return data
  }

  // Fetch Task
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()
    return data
  }

  // Add Task
  const addTask = async (task) => {
    const res = await fetch(`http://localhost:5000/tasks`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(task)
    })

    const data = await res.json()

    SetTasks([...tasks, data])
    // const id = Math.floor(Math.random() * 10000) + 1
    // const newTask = { id, ...task }
    // SetTasks([...tasks, newTask])
  }

  // Delete Task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE',
    })

    SetTasks(tasks.filter((task) => task.id !== id))
  }

  // Toggle Remainder
  const toggleRemainder = async (id) => {
    const taskToToggle = await fetchTask(id)
    const updTask = { ...taskToToggle, remainder: !taskToToggle.remainder }

    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(updTask)
    })

    const data = await res.json()

    SetTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, remainder: !task.remainder } : task))
  }

  return (
    <Router>
      <div className="container">
        <Header title='Task Tracker' onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask}
        />

        <Route path='/' exact render={(props) => (
          <>
            {showAddTask && <AddTask onAdd={addTask} />}
            {tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleRemainder} />
              : 'No Tasks to show'}
          </>
        )}></Route>

        <Route path='/about' component={About}></Route>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
