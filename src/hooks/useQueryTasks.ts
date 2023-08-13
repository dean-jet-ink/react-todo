import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

import { useError } from './useError'
import { Task } from '../types'

export const useQueryTasks = () => {
  const { errorHandling } = useError()
  const getTasks = async () => {
    const { data } = await axios.get<Task[]>(
      `${process.env.REACT_APP_API_URL}/tasks/`,
      {
        withCredentials: true,
      }
    )
    return data
  }

  return useQuery<Task[], Error>({
    queryKey: ['tasks'],
    queryFn: getTasks,
    staleTime: Infinity,
    onError: (err: any) => {
      if (err.response.data.message) {
        errorHandling(err.response.data.message)
      } else {
        errorHandling(err.response.data)
      }
    },
  })
}
