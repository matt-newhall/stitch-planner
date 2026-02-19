import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AppState } from 'react-native'
import useTodoStore from '../../state/todoStore'
import { todayISO } from '../../utils/date'
import { computeStreak } from '../../utils/streak'
import { EmptyStateVariant } from '../../types/task'

const AUTO_DELETE_DELAY = 3000

/**
 * Hook encapsulating todo screen logic and store interactions
 */
const useToDoScreen = () => {
  const [selectedDate, setSelectedDate] = useState(todayISO())

  const tasks = useTodoStore((s) => s.tasks)
  const completedDays = useTodoStore((s) => s.completedDays)
  const failedDays = useTodoStore((s) => s.failedDays)
  const addTask = useTodoStore((s) => s.addTask)
  const toggleTask = useTodoStore((s) => s.toggleTask)
  const deleteTask = useTodoStore((s) => s.deleteTask)
  const reconcileDay = useTodoStore((s) => s.reconcileDay)

  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  useEffect(() => {
    reconcileDay()

    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') reconcileDay()
    })

    return () => {
      sub.remove()
      timersRef.current.forEach((timer) => clearTimeout(timer))
    }
  }, [])

  const filteredTasks = tasks.filter((t) => t.scheduledDate === selectedDate)
  const pendingTasks = filteredTasks.filter((t) => !t.completed)
  const completedTasks = filteredTasks.filter((t) => t.completed)
  const sortedTasks = [...pendingTasks, ...completedTasks]

  const emptyStateVariant: EmptyStateVariant | null = (() => {
    if (sortedTasks.length > 0 && pendingTasks.length > 0) return null
    if (sortedTasks.some((t) => t.completed) || completedDays.includes(selectedDate)) return EmptyStateVariant.AllDone
    return EmptyStateVariant.Empty
  })()

  const streakCount = useMemo(
    () => computeStreak(completedDays, failedDays),
    [completedDays, failedDays],
  )

  const handleAdd = useCallback((title: string, scheduledDate: string) => {
    timersRef.current.forEach((timer, id) => {
      const task = tasks.find((t) => t.id === id)
      if (task?.scheduledDate === scheduledDate) {
        clearTimeout(timer)
        timersRef.current.delete(id)
        deleteTask(id)
      }
    })
    addTask(title, scheduledDate)
  }, [tasks, addTask, deleteTask])

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
    emptyStateVariant,
    streakCount,
    selectedDate,
    setSelectedDate,
    handleAdd,
    handleToggle,
    handleDelete,
  }
}

export default useToDoScreen
