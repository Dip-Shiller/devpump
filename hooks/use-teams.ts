'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Team, TeamMember, User } from '@/lib/supabase'

interface TeamWithMembers extends Team {
  member_count?: number
}

interface TeamMemberWithUser extends TeamMember {
  user?: User
}

export function useTeams(userId?: string) {
  const [teams, setTeams] = useState<TeamWithMembers[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTeams = useCallback(async () => {
    if (!userId) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/teams?userId=${userId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch teams')
      }
      const data = await response.json()
      setTeams(data.teams || [])
    } catch (err) {
      setError((err as Error).message)
      setTeams([])
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchTeams()
  }, [fetchTeams])

  const createTeam = async (data: {
    name: string
    description: string
    is_private: boolean
    image_url?: string
  }) => {
    if (!userId) {
      return { success: false, error: 'User not authenticated' }
    }

    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, owner_id: userId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create team')
      }

      const result = await response.json()
      await fetchTeams()
      return { success: true, team: result.team }
    } catch (err) {
      return { success: false, error: (err as Error).message }
    }
  }

  return { teams, isLoading, error, createTeam, refetch: fetchTeams }
}

export function useTeamDetails(teamId: string | null) {
  const [team, setTeam] = useState<Team | null>(null)
  const [members, setMembers] = useState<TeamMemberWithUser[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTeamDetails = useCallback(async () => {
    if (!teamId) {
      setTeam(null)
      setMembers([])
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/teams?teamId=${teamId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch team details')
      }
      const data = await response.json()
      setTeam(data.team)
      setMembers(data.members || [])
    } catch (err) {
      setError((err as Error).message)
      setTeam(null)
      setMembers([])
    } finally {
      setIsLoading(false)
    }
  }, [teamId])

  useEffect(() => {
    fetchTeamDetails()
  }, [fetchTeamDetails])

  return { team, members, isLoading, error, refetch: fetchTeamDetails }
}
