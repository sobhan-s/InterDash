import React, { useState, useEffect, useCallback,useRef } from 'react'
import { formatDistanceToNow, subHours } from 'date-fns'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Heart, MessageCircle, Eye } from 'lucide-react'
import { Input } from './ui/input'
import { API_ENDPOINTS, ITEMS_PER_PAGE } from '../utils/constants'
import type { Comment, Post, PostsFeedProps } from '@/lib/types'

const PostsFeedComponent = ({
  posts: propPosts,
  comments: propComments,
  onPostClick,
}: PostsFeedProps) => {
  const [posts, setPosts] = useState<Post[]>(propPosts || [])
  const [comments, setComments] = useState<Record<number, Comment[]>>(propComments || {})
  const [expandedPost, setExpandedPost] = useState<number | null>(null)
  const [likedPosts, setLikedPosts] = useState<Record<number, boolean>>({})
  const [commentDrafts, setCommentDrafts] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (propPosts && propPosts.length > 0) return
    setLoading(true)
    const cancel=new AbortController();
    fetch(`${API_ENDPOINTS.posts}?_limit=${ITEMS_PER_PAGE}`,{signal:cancel.signal})

      .then((r) => r.json())
      .then((data) => setPosts(data))
      .catch((error) => {if(!cancel.signal.aborted){
        console.error('Failed to fetch posts',error)
      } })
      .finally(() => setLoading(false))
      return ()=>cancel.abort();
  }, [propPosts])



const abortRef = useRef(null);

const handleExpand = useCallback(
  (postId: number) => {
    const isClosing = expandedPost === postId;
    setExpandedPost(isClosing ? null : postId);

    
    if (abortRef.current) {
      abortRef.current.abort();
    }

    
    const cancel = new AbortController();
    abortRef.current = cancel; 

    if (!isClosing && !comments[postId]) {
      fetch(`${API_ENDPOINTS.comments}?postId=${postId}`, { 
        signal: cancel.signal 
      })
        .then((r) => r.json())
        .then((data) => {
          setComments((prev) => ({ ...prev, [postId]: data }));
          abortRef.current = null; 
        })
        .catch((error) => {
          
          if (error.name === 'AbortError') {
            console.log('Previous fetch cancelled ,you clicked other thing.');
          } else {
            console.error('Right error:', error);
          }
        });
    }
  },
  [expandedPost, comments]
);


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
    (post: Post) => {
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
    <div className="max-h-125 overflow-auto space-y-3">
      {posts.slice(0, ITEMS_PER_PAGE).map((post: Post) => (
        <Card key={post.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <h4 className="font-semibold text-sm flex-1">{post.title}</h4>
              <Badge variant="outline" className="text-[10px] ml-2 shrink-0">
               {formatDistanceToNow(subHours(new Date(), post.id), { addSuffix: true })}
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
                {(comments[post.id] || []).map((comment: Comment) => (
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