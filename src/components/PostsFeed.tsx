import React, { useState, useEffect } from 'react'
import moment from 'moment'
import _ from 'lodash'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Heart, MessageCircle, Eye } from 'lucide-react'
import { Input } from './ui/input'

interface PostsFeedProps {
  theme: string
  counter: number
  posts?: any[]
  onPostClick?: (post: any) => void
}

const PostsFeed = ({ theme, counter, posts, onPostClick }: PostsFeedProps) => {
  const [localPosts, setLocalPosts] = useState<any[]>([])
  const [comments, setComments] = useState<Record<string, any[]>>({})
  const [expandedPost, setExpandedPost] = useState<number | null>(null)
  const [newComment, setNewComment] = useState('')
  const [likedPosts, setLikedPosts] = useState<Record<number, boolean>>({})
  const [commentDrafts, setCommentDrafts] = useState<Record<number, string>>({})

  console.log('PostsFeed render', counter)

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(res => res.json())
      .then(data => setLocalPosts(data))
  }, [])

  useEffect(() => {
    if (expandedPost) {
      fetch('https://jsonplaceholder.typicode.com/comments')
        .then(res => res.json())
        .then(data => {
          const grouped = _.groupBy(data, 'postId')
          setComments(grouped)
        })
    }
  }, [expandedPost])

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts?_limit=50')
      .then(res => res.json())
      .then(data => {
        setLocalPosts(prev => [...prev, ...data])
        console.log('PostsFeed poll - now have', localPosts.length, 'posts')
      })
  }, [counter])

  const handleLike = (postId: number) => {
    likedPosts[postId] = !likedPosts[postId]
    setLikedPosts(likedPosts)
  }

  const handleCommentSubmit = (e: React.FormEvent, postId: number) => {
    e.preventDefault();
    console.log('Adding comment:', newComment, 'to post', postId)
    setNewComment('')
  }

  const displayPosts = posts || localPosts

  return (
    <div className="max-h-[500px] overflow-auto space-y-3">
      {displayPosts.slice(0, 20).map((post: any, index: number) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <h4 className="font-semibold text-sm flex-1">{post.title}</h4>
              <Badge variant="outline" className="text-[10px] ml-2 shrink-0">
                {moment().subtract(post.id, 'hours').fromNow()}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{post.body}</p>
            <div className="flex gap-2 mt-3">
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => handleLike(post.id)}>
                <Heart className={`h-3 w-3 mr-1 ${likedPosts[post.id] ? 'fill-red-500 text-red-500' : ''}`} />
                {likedPosts[post.id] ? 'Liked' : 'Like'}
              </Button>
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}>
                <MessageCircle className="h-3 w-3 mr-1" />
                Comments
              </Button>
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => onPostClick && onPostClick(post)}>
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
            </div>
            {expandedPost === post.id && (
              <div className="mt-3 pt-3 border-t space-y-2">
                <h5 className="text-xs font-semibold">Comments</h5>
                {(comments[post.id] || []).map((comment: any, ci: number) => (
                  <div key={ci} className="p-2 bg-muted/50 rounded text-xs">
                    //fix the xss issue
                    <strong>{comment.name}</strong> <span className="text-muted-foreground">({comment.email})</span>
                    <p className="mt-1 text-muted-foreground">{comment.body}</p>
                  </div>
                ))}
                <form onSubmit={(e) => handleCommentSubmit(e, post.id)} className="flex gap-2 mt-2">
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="h-7 text-xs"
                  />
                  <Button type="submit" size="sm" className="h-7 text-xs">Post</Button>
                </form>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default PostsFeed
