'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCollabs } from '@/hooks/use-api'
import { useWallet } from '@/providers/wallet-provider'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function CollabsPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useWallet()
  const { getCollabs, getCollabRequests, acceptCollab, blockCollab, isLoading } = useCollabs()
  const [collabs, setCollabs] = useState<any[]>([])
  const [requests, setRequests] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'collabs' | 'requests'>('collabs')

  useEffect(() => {
    if (!user?.id) {
      router.push('/auth/login')
      return
    }

    const loadData = async () => {
      const [collabsResult, requestsResult] = await Promise.all([
        getCollabs(user.id),
        getCollabRequests(user.id)
      ])
      
      setCollabs(collabsResult?.collabs || [])
      setRequests(requestsResult?.collabs || [])
    }

    loadData()
  }, [user?.id, getCollabs, getCollabRequests])

  if (authLoading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!user) {
    return <div className="text-center py-12">Please log in to view your collabs</div>
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Collabs</h1>

      <div className="flex gap-2 mb-6 border-b">
        <Button
          variant={activeTab === 'collabs' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('collabs')}
        >
          Active Collabs ({collabs.length})
        </Button>
        <Button
          variant={activeTab === 'requests' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('requests')}
        >
          Requests ({requests.length})
        </Button>
      </div>

      {activeTab === 'collabs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {collabs.length > 0 ? (
            collabs.map((collab: any) => (
              <CollabCardView key={collab.id} collab={collab} />
            ))
          ) : (
            <p className="text-gray-500 col-span-full">No active collabs yet</p>
          )}
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="space-y-3">
          {requests.length > 0 ? (
            requests.map((request: any) => (
              <Card key={request.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">New collab request</p>
                  <p className="text-sm text-gray-600">Sent on {new Date(request.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="gradient"
                    onClick={() => acceptCollab(request.id)}
                    disabled={isLoading}
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => blockCollab(request.id)}
                    disabled={isLoading}
                  >
                    Decline
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-gray-500">No pending collab requests</p>
          )}
        </div>
      )}
    </div>
  )
}

function CollabCardView({ collab }: { collab: any }) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="font-semibold">Collaborator</p>
          <p className="text-sm text-gray-600">Active since {new Date(collab.created_at).toLocaleDateString()}</p>
        </div>
        <Button variant="gradient" size="sm">
          Message
        </Button>
      </div>
    </Card>
  )
}
