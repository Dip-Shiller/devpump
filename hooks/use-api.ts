'use client'

import { useState, useCallback } from 'react'

interface ApiState<T> {
  data: T | null
  error: string | null
  isLoading: boolean
}

interface UseApiOptions {
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
}

export function useApi<T = any>(options: UseApiOptions = {}) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    error: null,
    isLoading: false
  })

  const request = useCallback(async (
    url: string,
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
    body?: any
  ) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : undefined
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Request failed')
      }

      setState({ data, error: null, isLoading: false })
      options.onSuccess?.(data)
      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setState({ data: null, error: errorMessage, isLoading: false })
      options.onError?.(errorMessage)
      throw error
    }
  }, [options])

  const get = useCallback((url: string) => request(url, 'GET'), [request])
  const post = useCallback((url: string, body: any) => request(url, 'POST', body), [request])
  const patch = useCallback((url: string, body: any) => request(url, 'PATCH', body), [request])
  const del = useCallback((url: string) => request(url, 'DELETE'), [request])

  return {
    ...state,
    get,
    post,
    patch,
    delete: del,
    request
  }
}

// Specific API hooks
export function useUsers() {
  const api = useApi()

  const getUsers = useCallback((params?: Record<string, string>) => {
    const searchParams = new URLSearchParams(params)
    return api.get(`/api/users?${searchParams}`)
  }, [api])

  const getUser = useCallback((id: string) => {
    return api.get(`/api/users/${id}`)
  }, [api])

  const updateUser = useCallback((id: string, data: any) => {
    return api.patch(`/api/users/${id}`, data)
  }, [api])

  return { ...api, getUsers, getUser, updateUser }
}

export function useProjects() {
  const api = useApi()

  const getProjects = useCallback((params?: Record<string, string>) => {
    const searchParams = new URLSearchParams(params)
    return api.get(`/api/projects?${searchParams}`)
  }, [api])

  const createProject = useCallback((data: any) => {
    return api.post('/api/projects', data)
  }, [api])

  return { ...api, getProjects, createProject }
}

export function useTeams() {
  const api = useApi()

  const getTeams = useCallback((userId?: string) => {
    const params = userId ? `?userId=${userId}` : ''
    return api.get(`/api/teams${params}`)
  }, [api])

  const createTeam = useCallback((data: any) => {
    return api.post('/api/teams', data)
  }, [api])

  return { ...api, getTeams, createTeam }
}

export function useMessages() {
  const api = useApi()

  const getConversations = useCallback((userId: string) => {
    return api.get(`/api/messages?userId=${userId}`)
  }, [api])

  const getMessages = useCallback((userId: string, partnerId: string) => {
    return api.get(`/api/messages?userId=${userId}&partnerId=${partnerId}`)
  }, [api])

  const sendMessage = useCallback((data: { senderId: string; receiverId: string; content: string }) => {
    return api.post('/api/messages', data)
  }, [api])

  return { ...api, getConversations, getMessages, sendMessage }
}

export function useConnections() {
  const api = useApi()

  const getRequests = useCallback((userId: string, type: 'received' | 'sent' = 'received') => {
    return api.get(`/api/connections?userId=${userId}&type=${type}`)
  }, [api])

  const sendRequest = useCallback((data: { senderId: string; receiverId: string; message?: string }) => {
    return api.post('/api/connections', data)
  }, [api])

  const respondToRequest = useCallback((requestId: string, action: 'accept' | 'decline') => {
    return api.patch('/api/connections', { requestId, action })
  }, [api])

  return { ...api, getRequests, sendRequest, respondToRequest }
}

export function usePosts() {
  const api = useApi()

  const getPosts = useCallback((params?: Record<string, string>) => {
    const searchParams = new URLSearchParams(params)
    return api.get(`/api/posts?${searchParams}`)
  }, [api])

  const createPost = useCallback((data: any) => {
    return api.post('/api/posts', data)
  }, [api])

  return { ...api, getPosts, createPost }
}
