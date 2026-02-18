import { useCallback, useEffect, useRef, useState } from 'react'
import { useTodoStore } from '../../state'
import { todayISO } from '../../utils'

const AUTO_DELETE_DELAY = 3000

/**
 * Hook encapsulating todo screen logic and store interactions
 */
const useToDoScreen = () => {
  const [selectedDate, setSelectedDate] = useState(todayISO())

  const tasks = useTodoStore((s) => s.tasks)
  const addTask = useTodoStore((s) => s.addTask)
  const toggleTask = useTodoStore((s) => s.toggleTask)
  const deleteTask = useTodoStore((s) => s.deleteTask)

  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer))
    }
  }, [])

  const filteredTasks = tasks.filter((t) => t.scheduledDate === selectedDate)
  const pendingTasks = filteredTasks.filter((t) => !t.completed)
  const completedTasks = filteredTasks.filter((t) => t.completed)
  const sortedTasks = [...pendingTasks, ...completedTasks]

  const handleAdd = useCallback((title: string, scheduledDate: string) => {
    addTask(title, scheduledDate)
  }, [addTask])

  const handleToggle = useCallback((id: string) => {
    const task = tasks.find((t) => t.id === id)
    toggleTask(id)

    if (task?.completed) {
      const existing = timersRef.current.get(id)
      if (existing) {
        clearTimeout(existing)
        timersRef.current.delete(id)
      }
    } else {
      const timer = setTimeout(() => {
        deleteTask(id)
        timersRef.current.delete(id)
      }, AUTO_DELETE_DELAY)
      timersRef.current.set(id, timer)
    }
  }, [tasks, toggleTask, deleteTask])

  const handleDelete = useCallback((id: string) => {
    const existing = timersRef.current.get(id)
    if (existing) {
      clearTimeout(existing)
      timersRef.current.delete(id)
    }
    deleteTask(id)
  }, [deleteTask])

  return {
    tasks: sortedTasks,
    selectedDate,
    setSelectedDate,
    handleAdd,
    handleToggle,
    handleDelete,
  }
}

export default useToDoScreen
