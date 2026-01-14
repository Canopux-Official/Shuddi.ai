import { Request, Response } from "express";
import { ProfileService } from "../../core-backend/profile/services/profile.service";
import { generateNatureSuggestions } from "../../core-backend/profile/utils/nameGenerator";

/**
 * Get logged-in user's profile
 */

export const getMyProfileController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        data: null,
      });
    }
    const userId = req.user.id;
    const profile = await ProfileService.findByUserId(userId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "We couldn't find a profile associated with this account.",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile retrieved successfully.",
      data: profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching your profile data.",
      data: null,
    });
  }
};

/**
 * Create profile (onboarding)
 */
export const createProfileController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        data: null,
      });
    }

    const { username, dateOfBirth, ...rest } = req.body;

    // 1. Check if username already exists
    const existing = await ProfileService.findByUsername(username);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "This username is already taken. Please try another one.",
        data: null,
      });
    }

    // 2. Prepare data
    const profileData = {
      ...rest,
      username,
      userId: req.user.id,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
    };

    const newProfile = await ProfileService.createProfile(profileData);

    return res.status(201).json({
      success: true,
      message: "Welcome to the community! Your profile has been created.",
      data: newProfile,
    });
  } catch (error: any) {
    console.error("PROFILE CREATE ERROR:", error);

    if (error.code === "P2003") {
      return res.status(400).json({
        success: false,
        message: "Invalid user reference.",
        data: null,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: null,
    });
  }
};

/**
 * Update profile
 */
export const updateProfileController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        data: null,
      });
    }

    const updatedProfile = await ProfileService.updateProfile(
      req.user.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Your profile information has been updated successfully.",
      data: updatedProfile,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Unable to update profile. Please check the provided data.",
      data: null,
    });
  }
};

/**
 * Delete profile
 */
export const deleteProfileController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        data: null,
      });
    }
    const userId = req.user.id;

    await ProfileService.deleteProfile(userId);

    return res.status(200).json({
      success: true,
      message: "Your profile has been successfully deleted.",
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while trying to delete your profile.",
      data: null,
    });
  }
};

/**
 * Suggest usernames (public)
 */
export const suggestNamesController = async (req: Request, res: Response) => {
  try {
    const base = req.query.base as string;

    if (!base) {
      return res.status(400).json({
        success: false,
        message: "Please provide a name to generate suggestions.",
        data: [],
      });
    }

    const potentials = generateNatureSuggestions(base);
    const taken = await ProfileService.checkMultipleUsernames(potentials);
    const available = potentials.filter((name) => !taken.includes(name));

    return res.status(200).json({
      success: true,
      message: "Found available nature-themed names for you.",
      data: available,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error generating name suggestions.",
      data: [],
    });
  }
};
