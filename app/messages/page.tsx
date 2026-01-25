'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Search, Send, Smile, Paperclip, MoreVertical, Phone, Video,
  Image, Mic, Plus, Settings, Archive, Trash2, Pin, Star,
  Circle, Check, CheckCheck, Clock, ArrowLeft, Users,
  MessageSquare, Sparkles, Bell, BellOff, Filter
} from 'lucide-react'

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>('1')
  const [message, setMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const conversations = [
    {
      id: '1',
      name: 'solana_builder',
      avatar: '👨‍💻',
      lastMessage: 'Hey! Are you available for a quick call about the DEX project?',
      time: '2m ago',
      unread: 2,
      online: true,
      typing: false,
    },
    {
      id: '2',
      name: 'defi_wizard',
      avatar: '🧙‍♂️',
      lastMessage: 'The smart contract is ready for review 🚀',
      time: '15m ago',
      unread: 0,
      online: true,
      typing: true,
    },
    {
      id: '3',
      name: 'nft_artist',
      avatar: '🎨',
      lastMessage: 'Thanks for the feedback on the collection!',
      time: '1h ago',
      unread: 0,
      online: false,
      typing: false,
    },
    {
      id: '4',
      name: 'rust_guru',
      avatar: '🦀',
      lastMessage: 'Check out this optimization technique',
      time: '3h ago',
      unread: 0,
      online: false,
      typing: false,
    },
    {
      id: '5',
      name: 'Team: Solana Builders',
      avatar: '🚀',
      lastMessage: 'web3wizard: Let\'s sync up tomorrow',
      time: '5h ago',
      unread: 5,
      online: true,
      typing: false,
      isGroup: true,
    },
  ]

  const messages = [
    {
      id: 1,
      sender: 'solana_builder',
      avatar: '👨‍💻',
      content: 'Hey! I saw your profile and I\'m really impressed with your work on DeFi protocols.',
      time: '10:00 AM',
      status: 'read',
      isOwn: false,
    },
    {
      id: 2,
      sender: 'You',
      avatar: '😎',
      content: 'Thanks! I\'ve been diving deep into Solana development lately. Really enjoying it! 🚀',
      time: '10:02 AM',
      status: 'read',
      isOwn: true,
    },
    {
      id: 3,
      sender: 'solana_builder',
      avatar: '👨‍💻',
      content: 'That\'s awesome! We\'re actually building a new DEX and looking for experienced developers. Would you be interested in collaborating?',
      time: '10:05 AM',
      status: 'read',
      isOwn: false,
    },
    {
      id: 4,
      sender: 'You',
      avatar: '😎',
      content: 'Definitely interested! What\'s the tech stack you\'re using?',
      time: '10:08 AM',
      status: 'read',
      isOwn: true,
    },
    {
      id: 5,
      sender: 'solana_builder',
      avatar: '👨‍💻',
      content: 'We\'re using Anchor for the smart contracts, React + TypeScript for the frontend, and we\'re integrating with Jupiter for aggregation.',
      time: '10:12 AM',
      status: 'read',
      isOwn: false,
    },
    {
      id: 6,
      sender: 'solana_builder',
      avatar: '👨‍💻',
      content: 'Hey! Are you available for a quick call about the DEX project?',
      time: '10:30 AM',
      status: 'delivered',
      isOwn: false,
    },
  ]

  const selectedConversation = conversations.find(c => c.id === selectedChat)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'read': return <CheckCheck className="w-4 h-4 text-cyan-400" />
      case 'delivered': return <CheckCheck className="w-4 h-4 text-muted-foreground" />
      case 'sent': return <Check className="w-4 h-4 text-muted-foreground" />
      default: return <Clock className="w-4 h-4 text-muted-foreground" />
    }
  }

  return (
    <div className="h-[calc(100vh-80px)] flex">
      {/* Conversations Sidebar */}
      <div className="w-80 border-r border-white/10 flex flex-col bg-background/50">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-400" />
              Messages
            </h1>
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-white">
                <Filter className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-white">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 focus:outline-none text-sm"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((convo) => (
            <div
              key={convo.id}
              onClick={() => setSelectedChat(convo.id)}
              className={`flex items-center gap-3 p-4 cursor-pointer transition-all border-l-2 ${
                selectedChat === convo.id
                  ? 'bg-purple-500/10 border-purple-500'
                  : 'border-transparent hover:bg-white/5'
              }`}
            >
              <div className="relative">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                  convo.isGroup 
                    ? 'bg-gradient-to-br from-purple-500 to-cyan-500' 
                    : 'bg-gradient-to-br from-purple-500/50 to-cyan-500/50'
                }`}>
                  {convo.avatar}
                </div>
                {convo.online && !convo.isGroup && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-background">
                    <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium truncate">{convo.name}</span>
                  <span className="text-xs text-muted-foreground">{convo.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  {convo.typing ? (
                    <span className="text-sm text-cyan-400 flex items-center gap-1">
                      <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </span>
                      typing...
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground truncate">{convo.lastMessage}</span>
                  )}
                  {convo.unread > 0 && (
                    <Badge className="bg-purple-500 text-white text-xs px-2 ml-2">
                      {convo.unread}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-background/50">
            <div className="flex items-center gap-3">
              <button className="lg:hidden p-2 rounded-lg hover:bg-white/10">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-lg">
                  {selectedConversation.avatar}
                </div>
                {selectedConversation.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                )}
              </div>
              <div>
                <div className="font-bold">{selectedConversation.name}</div>
                <div className="text-xs text-muted-foreground">
                  {selectedConversation.typing ? (
                    <span className="text-cyan-400">typing...</span>
                  ) : selectedConversation.online ? (
                    <span className="text-green-400">Online</span>
                  ) : (
                    'Last seen 2 hours ago'
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-white">
                <Phone className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-white">
                <Video className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-white">
                <Star className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-white">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Date Separator */}
            <div className="flex items-center gap-4 my-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-muted-foreground px-2">Today</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex gap-3 ${msg.isOwn ? 'flex-row-reverse' : ''}`}
              >
                {!msg.isOwn && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-sm flex-shrink-0">
                    {msg.avatar}
                  </div>
                )}
                <div className={`max-w-[70%] ${msg.isOwn ? 'text-right' : ''}`}>
                  <div className={`p-4 rounded-2xl ${
                    msg.isOwn 
                      ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-tr-sm' 
                      : 'bg-white/10 rounded-tl-sm'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                  <div className={`flex items-center gap-2 mt-1 text-xs text-muted-foreground ${msg.isOwn ? 'justify-end' : ''}`}>
                    <span>{msg.time}</span>
                    {msg.isOwn && getStatusIcon(msg.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-white/10 bg-background/50">
            <div className="flex items-end gap-3">
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-white">
                  <Plus className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-white">
                  <Image className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-white">
                  <Paperclip className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 pr-12 focus:border-purple-500/50 focus:outline-none resize-none text-sm"
                  rows={1}
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors">
                  <Smile className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-white">
                  <Mic className="w-5 h-5" />
                </button>
                <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl px-4">
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* No Chat Selected */
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-12 h-12 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Your Messages</h2>
            <p className="text-muted-foreground mb-4">Select a conversation to start chatting</p>
            <Button className="gap-2 bg-gradient-to-r from-purple-600 to-cyan-500">
              <Plus className="w-4 h-4" />
              New Message
            </Button>
          </div>
        </div>
      )}

      {/* Right Sidebar - User Info */}
      {selectedConversation && (
        <div className="hidden xl:block w-72 border-l border-white/10 p-4 bg-background/50">
          <div className="text-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-4xl mx-auto mb-3">
              {selectedConversation.avatar}
            </div>
            <h3 className="font-bold text-lg">{selectedConversation.name}</h3>
            <p className="text-sm text-muted-foreground">Solana Developer</p>
            <Badge variant="glow" className="mt-2">
              <Circle className="w-2 h-2 fill-green-500 text-green-500 mr-1" />
              Available
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-white/5">
              <div className="text-xs text-muted-foreground mb-1">Reputation</div>
              <div className="text-lg font-bold text-purple-400">2,847</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5">
              <div className="text-xs text-muted-foreground mb-1">Projects</div>
              <div className="text-lg font-bold">24</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5">
              <div className="text-xs text-muted-foreground mb-1">Member since</div>
              <div className="text-sm">March 2024</div>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <Button variant="outline" className="w-full justify-start gap-2">
              <Users className="w-4 h-4" />
              View Profile
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <BellOff className="w-4 h-4" />
              Mute Notifications
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 text-red-400 hover:text-red-300">
              <Trash2 className="w-4 h-4" />
              Delete Chat
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
