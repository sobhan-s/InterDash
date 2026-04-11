import React, { useState, useEffect, useCallback } from 'react'
import moment from 'moment'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Heart, MessageCircle, Eye } from 'lucide-react'
import { Input } from './ui/input'
import { API_ENDPOINTS, ITEMS_PER_PAGE } from '../utils/constants'

interface PostsFeedProps {
  theme: string
  counter: number
  posts?: any[]
  comments?: Record<number, any[]>
  onPostClick?: (post: any) => void
}

const PostsFeedComponent = ({
  posts: propPosts,
  comments: propComments,
  onPostClick,
}: PostsFeedProps) => {
  const [posts, setPosts] = useState<any[]>(propPosts || [])
  const [comments, setComments] = useState<Record<number, any[]>>(propComments || {})
  const [expandedPost, setExpandedPost] = useState<number | null>(null)
  const [likedPosts, setLikedPosts] = useState<Record<number, boolean>>({})
  const [commentDrafts, setCommentDrafts] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (propPosts && propPosts.length > 0) return
    setLoading(true)
    fetch(`${API_ENDPOINTS.posts}?_limit=${ITEMS_PER_PAGE}`)
      .then((r) => r.json())
      .then((data) => setPosts(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [propPosts])


  const handleExpand = useCallback(
    (postId: number) => {
      const isClosing = expandedPost === postId
      setExpandedPost(isClosing ? null : postId)

      if (!isClosing && !comments[postId]) {
        fetch(`${API_ENDPOINTS.comments}?postId=${postId}`)
          .then((r) => r.json())
          .then((data) =>
            setComments((prev) => ({ ...prev, [postId]: data }))
          )
          .catch(() => {})
      }
    },
    [expandedPost, comments]
  )

  const handleLike = useCallback((postId: number) => {
    setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }))
  }, [])

  const handleCommentSubmit = useCallback(
    (e: React.FormEvent, postId: number) => {
      e.preventDefault()
      setCommentDrafts((prev) => ({ ...prev, [postId]: '' }))
    },
    []
  )

  const handleCommentChange = useCallback(
    (postId: number, value: string) => {
      setCommentDrafts((prev) => ({ ...prev, [postId]: value }))
    },
    []
  )

  const handlePostClick = useCallback(
    (post: any) => {
      if (onPostClick) onPostClick(post)
    },
    [onPostClick]
  )

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">
        Loading posts...
      </p>
    )
  }

  return (
    <div className="max-h-[500px] overflow-auto space-y-3">
      {posts.slice(0, ITEMS_PER_PAGE).map((post: any) => (
        <Card key={post.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <h4 className="font-semibold text-sm flex-1">{post.title}</h4>
              <Badge variant="outline" className="text-[10px] ml-2 shrink-0">
                {moment().subtract(post.id, 'hours').fromNow()}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground mt-2">{post.body}</p>

            <div className="flex gap-2 mt-3">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => handleLike(post.id)}
              >
                <Heart
                  className={`h-3 w-3 mr-1 ${
                    likedPosts[post.id] ? 'fill-red-500 text-red-500' : ''
                  }`}
                />
                {likedPosts[post.id] ? 'Liked' : 'Like'}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => handleExpand(post.id)}
              >
                <MessageCircle className="h-3 w-3 mr-1" />
                Comments
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => handlePostClick(post)}
              >
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
            </div>

            {expandedPost === post.id && (
              <div className="mt-3 pt-3 border-t space-y-2">
                <h5 className="text-xs font-semibold">Comments</h5>

                {!comments[post.id] && (
                  <p className="text-xs text-muted-foreground">
                    Loading comments...
                  </p>
                )}

                {(comments[post.id] || []).map((comment: any) => (
                  <div key={comment.id} className="p-2 bg-muted/50 rounded text-xs">
                    <strong>{comment.name}</strong>{' '}
                    <span className="text-muted-foreground">
                      ({comment.email})
                    </span>
                    <p className="mt-1 text-muted-foreground">{comment.body}</p>
                  </div>
                ))}

                <form
                  onSubmit={(e) => handleCommentSubmit(e, post.id)}
                  className="flex gap-2 mt-2"
                >
                  <Input
                    value={commentDrafts[post.id] || ''}
                    onChange={(e) =>
                      handleCommentChange(post.id, e.target.value)
                    }
                    placeholder="Add a comment..."
                    className="h-7 text-xs"
                  />

                  <Button type="submit" size="sm" className="h-7 text-xs">
                    Post
                  </Button>
                </form>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default React.memo(PostsFeedComponent)