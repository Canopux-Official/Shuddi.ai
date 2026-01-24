import { Request, Response } from "express";
import { createFeedPost, getGlobalFeed } from "../../core-backend/feed/feed.service";

/**
 * GET /api/feed
 */
export const getFeed = async (req: Request, res: Response) => {
  try {
    /**
     * Pagination params
     * Gateway responsibility: read + sanitize
     */
    const limit =
      req.query.limit ? Math.min(Number(req.query.limit), 50) : 10;

    const cursor =
      typeof req.query.cursor === "string"
        ? req.query.cursor
        : undefined;

    const result = await getGlobalFeed({
      limit,
      cursor,
    });

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Failed to fetch feed",
    });
  }
};

/**
 * POST /api/feed
 */
export const createPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { content } = req.body;

    const result = await createFeedPost({
      authorId: user.id,
      content,
    });

    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Failed to create feed post",
    });
  }
};
