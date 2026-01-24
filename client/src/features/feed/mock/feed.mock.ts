// MOCK DATA. Matches Frontend APIs.



import type {
  GlobalFeedResponse,
  PendingFeedResponse,
} from "../../../apis/feed/feed"




// GLOBAL FEED (PUBLISHED POSTS)
export const mockGlobalFeed: GlobalFeedResponse = {
  items: [
    {
      id: "post_001",
      authorId: "user_001",
      author: {
        id: "user_001",
        username: "rahul_dev",
        displayName: "Rahul Sharma",
        avatarUrl: "https://i.pravatar.cc/150?img=11",
        level: 5,
        xp: 1240,
        emailVerified: true,
      },
      content: "Just finished building my first Prisma-powered API. Loving the DX so far 🚀  Just finished building my first Prisma-powered API. Loving the DX so far 🚀  Just finished building my first Prisma-powered API. Loving the DX so far 🚀 ",
      status: "PUBLISHED",
      createdAt: "2025-01-05T09:12:33.000Z",
      updatedAt: "2025-01-05T09:12:33.000Z",
    },
    {
      id: "post_002",
      authorId: "user_002",
      author: {
        id: "user_002",
        username: "ananya.codes",
        displayName: "Ananya Verma",
        avatarUrl: "https://i.pravatar.cc/150?img=32",
        level: 8,
        xp: 2680,
        emailVerified: true,
      },
      content: "Small wins matter. Fixed a production bug that was haunting us for days.",
      status: "PUBLISHED",
      createdAt: "2025-01-05T08:45:10.000Z",
      updatedAt: "2025-01-05T08:45:10.000Z",
    },
    {
      id: "post_003",
      authorId: "user_003",
      author: {
        id: "user_003",
        username: "backend_bruce",
        displayName: "Bruce Wayne",
        avatarUrl: "https://i.pravatar.cc/150?img=14",
        level: 12,
        xp: 5420,
        emailVerified: true,
      },
      content: "Reminder: write logs like your future self will read them at 3 AM.",
      status: "PUBLISHED",
      createdAt: "2025-01-04T18:22:01.000Z",
      updatedAt: "2025-01-04T18:22:01.000Z",
    },
    {
      id: "post_004",
      authorId: "user_004",
      author: {
        id: "user_004",
        username: "clean_code",
        displayName: "Pooja Nair",
        avatarUrl: "https://i.pravatar.cc/150?img=60",
        level: 11,
        xp: 4890,
        emailVerified: true,
      },
      content: "Readable code > clever code. Always.",
      status: "PUBLISHED",
      createdAt: "2025-01-01T09:40:05.000Z",
      updatedAt: "2025-01-01T09:40:05.000Z",
    },
  ],
  nextCursor: "post_004",
}




// PENDING FEED (ADMIN REVIEW)
export const mockPendingFeed: PendingFeedResponse = {
  items: [
    {
      id: "pending_001",
      author: {
        id: "user_005",
        username: "new_user_1",
        displayName: "Sahil Gupta",
        avatarUrl: "https://i.pravatar.cc/150?img=64",
        emailVerified: false,
      },
      content: "Excited to join this community!",
      createdAt: "2025-01-06T08:10:11.000Z",
    },
    {
      id: "pending_002",
      author: {
        id: "user_006",
        username: "silent_builder",
        displayName: "Karthik M",
        avatarUrl: "https://i.pravatar.cc/150?img=80",
        emailVerified: true,
      },
      content: "Finally decided to start posting instead of lurking.",
      createdAt: "2025-01-06T06:58:49.000Z",
    },
  ],
  nextCursor: "pending_002",
}