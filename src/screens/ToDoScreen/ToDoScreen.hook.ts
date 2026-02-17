import { useCallback } from 'react'
import { useTodoStore } from '../../state'

/**
 * Hook encapsulating todo screen logic and store interactions
 */
const useToDoScreen = () => {
  const tasks = useTodoStore((s) => s.tasks)
  const addTask = useTodoStore((s) => s.addTask)
  const toggleTask = useTodoStore((s) => s.toggleTask)
  const deleteTask = useTodoStore((s) => s.deleteTask)

  const pendingTasks = tasks.filter((t) => !t.completed)
  const completedTasks = tasks.filter((t) => t.completed)
  const sortedTasks = [...pendingTasks, ...completedTasks]

  const handleAdd = useCallback((title: string) => {
    addTask(title)
  }, [addTask])

  const handleToggle = useCallback((id: string) => {
    toggleTask(id)
  }, [toggleTask])

  const handleDelete = useCallback((id: string) => {
    deleteTask(id)
  }, [deleteTask])

  return {
    tasks: sortedTasks,
    handleAdd,
    handleToggle,
    handleDelete,
  }
}

export default useToDoScreen
