import { Request, Response } from "express";

/**
 * GET /api/feed
 */
export const getFeed = async (req: Request, res: Response) => {
  try {
    const user = req.user!;

    /**
     * TEMP MOCK
     * Replace with core-backend feed service later
     */
    const feedItems = [
      {
        id: "post-1",
        authorId: user.id,
        content: "Welcome to the feed 👋",
        createdAt: new Date(),
      },
      {
        id: "post-2",
        authorId: "another-user",
        content: "This is a mock feed post",
        createdAt: new Date(),
      },
    ];

    return res.status(200).json({
      user: {
        id: user.id,
        role: user.role,
      },
      feed: feedItems,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to fetch feed",
    });
  }
};

/**
 * POST /api/feed
 */
export const createPost = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const payload = req.body;

    /**
     * TEMP MOCK
     * Replace with core-backend createPost service later
     */
    const newPost = {
      id: "post-new",
      authorId: user.id,
      content: payload.content,
      createdAt: new Date(),
    };

    return res.status(201).json(newPost);
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to create post",
    });
  }
};
