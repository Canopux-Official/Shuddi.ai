import { prisma } from "../../lib/prisma"
import { PostStatus } from "@prisma/client"

// Parameters for creating a new feed post.
export interface CreateFeedPostParams {
  authorId: string            // User ID
  content:  string            // Post content 
}

// Create a new feed post in Pending status.
export const createFeedPost = async ({ authorId, content }: CreateFeedPostParams) => {

  if ( !content || !content.trim() ) throw new Error("Post content cannot be empty")
  
  const normalizedContent = content.trim()

  if (normalizedContent.length > 1000) throw new Error("Post content too long")
  
  // Prisma Create Query
  const feed = await prisma.post.create({
    data: {
      authorId,
      content: normalizedContent,
      status: PostStatus.PENDING
    }
  })

  return {
    id:        feed.id,
    status:    feed.status,
    createdAt: feed.createdAt.toISOString()
  }
}

// Parameters for fetching pending feed posts.
export interface GetPendingFeedParams {
  limit?:  number            // Max posts to review
  cursor?: string            // Cursor-based pagination
}

// Get pending feed posts for Admin Review.
export const getPendingFeed = async ({ limit = 10,  cursor }: GetPendingFeedParams) => {

  // The Prisma Query (Core Data Fetch)
  const feeds = await prisma.post.findMany({ take: limit + 1, ...(cursor && { cursor: { id: cursor }, skip: 1 }),

    where:   { status:    PostStatus.PENDING },
    orderBy: { createdAt: "asc" },
    include: { author:    { include: { profile: true, stats: true } }}

  })

  let nextCursor: string | null = null

  // If more than limit items exist, Remove the extra item, use its id as the nextCursor.
  if (feeds.length > limit) {
    const nextItem = feeds.pop()
    nextCursor = nextItem!.id
  }

  return {

    // Data Mapping.
    items: feeds.map((feed: any) => ({
      id: feed.id,

      author: {
        id:            feed.author.id,
        username:      feed.author.profile?.username ?? "unknown",
        displayName:   feed.author.profile?.displayName,
        avatarUrl:     feed.author.profile?.avatarUrl,
        emailVerified: feed.author.emailVerified,
      },

      content:   feed.content,
      createdAt: feed.createdAt.toISOString(),
    })),
    
    nextCursor
  }
}

// Parameters for approving a feed post.
export interface ApproveFeedPostParams {
  postId: string             // Feed ID to approve
}

// Approve a Pending feed post to Published status.
export const approveFeedPost = async ({ postId }: ApproveFeedPostParams) => {

  const feed = await prisma.post.findUnique({ where: { id: postId }})
  
  if (!feed) throw new Error("Post not found")

  if (feed.status !== PostStatus.PENDING) throw new Error("Only pending posts can be approved")

  // Prisma Update Query.
  const updatedfeed = await prisma.post.update({
    where: { id: postId },
    data:  { status: PostStatus.PUBLISHED }
  })

  return {
    id:        updatedfeed.id,
    status:    updatedfeed.status,
    updatedAt: updatedfeed.updatedAt.toISOString()
  }
}





// Parameters for hiding a feed post.
export interface HideFeedPostParams {
  postId: string             // Feed ID to hide
}

// Hide a feed post by setting its status to Hidden.
export const hideFeedPost = async ({ postId }: HideFeedPostParams) => {

  const feed = await prisma.post.findUnique({ where: { id: postId }})

  if (!feed) throw new Error("Post not found")

  if (feed.status === PostStatus.DELETED) throw new Error("Deleted posts cannot be modified")

  if (feed.status === PostStatus.HIDDEN)  throw new Error("Post is already hidden")

  // Prisma Update Query.
  const updatedFeed = await prisma.post.update({
    where: { id: postId },
    data:  { status: PostStatus.HIDDEN}
  })

  return {
    id:        updatedFeed.id,
    status:    updatedFeed.status,
    updatedAt: updatedFeed.updatedAt.toISOString()
  }
}





// Parameters for fetching the global feed.
export interface GetFeedParams {
  limit?:  number            //  Max number of feed items
  cursor?: string            // ID of the last item from previous page, Used for cursor-based pagination
}

// Get the Global Feed of Published posts.
export const getGlobalFeed = async ({ limit = 10, cursor }: GetFeedParams) => {

  // The Prisma Query (Core Data Fetch)
  const feeds = await prisma.post.findMany({ take: limit + 1,   ...(cursor && { cursor: { id: cursor }, skip: 1 }),

    where:    { status: PostStatus.PUBLISHED },
    orderBy:  [{ createdAt: "desc" },  { id: "desc" }],  
    include:  { author: { include: { profile: true, stats: true }}}

  })

  let nextCursor: string | null = null

  // If more than limit items exist, Remove the extra item, use its id as the nextCursor.
  if (feeds.length > limit) {
    const nextItem = feeds.pop()
    nextCursor = nextItem!.id
  }

  return {

    // Data Mapping.
    items: feeds.map((feed: any) => ({

      id:       feed.id,
      authorId: feed.authorId,

      author: {
        id:            feed.author.id,
        username:      feed.author.profile?.username ?? "unknown",
        displayName:   feed.author.profile?.displayName,
        avatarUrl:     feed.author.profile?.avatarUrl,
        level:         feed.author.stats?.level ?? 1,
        xp:            feed.author.stats?.xp ?? 0,
        emailVerified: feed.author.emailVerified,
      },

      content:   feed.content,
      status:    feed.status,
      createdAt: feed.createdAt.toISOString(),
      updatedAt: feed.updatedAt.toISOString(),
    })),

    nextCursor
  }
}