import axios from 'axios'
import { useQueryClient, useMutation } from '@tanstack/react-query'

import useStore from '../store/index'
import { useError } from './useError'
import { Task } from '../types'

export const useMutateTask = () => {
  const resetEditedTask = useStore((store) => store.resetEditedTask)
  const { errorHandling } = useError()
  const queryClient = useQueryClient()

  const createTaskMutation = useMutation(
    (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) =>
      axios.post<Task>(`${process.env.REACT_APP_API_URL}/tasks/`, task),
    {
      onSuccess: (res) => {
        const preTasks = queryClient.getQueryData<Task[]>(['tasks'])
        if (preTasks) {
          queryClient.setQueryData(['tasks'], [...preTasks, res.data])
        }
        resetEditedTask()
      },
      onError: (err: any) => {
        if (err.response.data.message) {
          errorHandling(err.response.data.message)
        } else {
          errorHandling(err.response.data)
        }
      },
    }
  )

  const updateTaskMutation = useMutation(
    (task: Omit<Task, 'created_at' | 'updated_at'>) =>
      axios.put<Task>(`${process.env.REACT_APP_API_URL}/tasks/${task.id}`, {
        title: task.title,
      }),
    {
      onSuccess: (res, variables) => {
        const preTasks = queryClient.getQueryData<Task[]>(['tasks'])
        if (preTasks) {
          queryClient.setQueryData(
            ['tasks'],
            preTasks.map((task) => (task.id == variables.id ? res.data : task))
          )
        }
        resetEditedTask()
      },
      onError: (err: any) => {
        if (err.response.data.message) {
          errorHandling(err.response.data.message)
        } else {
          errorHandling(err.response.data)
        }
      },
    }
  )

  const deleteTaskMutation = useMutation(
    (id: number) =>
      axios.delete(`${process.env.REACT_APP_API_URL}/tasks/${id}`),
    {
      onSuccess: (_, variables) => {
        const preTasks = queryClient.getQueryData<Task[]>(['tasks'])
        if (preTasks) {
          queryClient.setQueryData(
            ['tasks'],
            preTasks.filter((task) => task.id != variables)
          )
        }
        resetEditedTask()
      },
      onError: (err: any) => {
        if (err.response.data.message) {
          errorHandling(err.response.data.message)
        } else {
          errorHandling(err.response.data)
        }
      },
    }
  )

  return { createTaskMutation, updateTaskMutation, deleteTaskMutation }
}
