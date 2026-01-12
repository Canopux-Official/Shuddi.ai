import { Request, Response } from 'express';
import { ProfileService } from '../services/profile.service';
import { generateNatureSuggestions } from '../utils/nameGenerator';

interface User {
    id: string;
}

export const getMyProfile = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        const profile = await ProfileService.findByUserId(userId);

        // here after addition of middle i have to use the req.user.id
        // const profile = await ProfileService.findByUserId(req.user.id);


        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "We couldn't find a profile associated with this account.",
                data: null
            });
        }
        res.status(200).json({
            success: true,
            message: "Profile retrieved successfully.",
            data: profile
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching your profile data.",
            data: null
        });
    }
};

export const createProfile = async (req: Request, res: Response) => {
    try {
        const { username, userId, dateOfBirth, ...rest } = req.body;
        console.log(req.body)

        // 1. Check if username is already taken
        const existing = await ProfileService.findByUsername(username);
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "This username is already taken. Please try another one.",
                data: null
            });
        }

        // 2. Prepare the data (Crucial: Convert date string to JS Date Object)
        const profileData = {
            ...rest,
            username,
            userId,
            // Prisma needs a real Date object, not a string
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null
        };

        const newProfile = await ProfileService.createProfile(profileData);

        return res.status(201).json({
            success: true,
            message: "Welcome to the community! Your profile has been created.",
            data: newProfile
        });

    } catch (error: any) {
        // THIS LOG IS THE MOST IMPORTANT PART RIGHT NOW
        console.error("DEBUGGING PRISMA ERROR:", error);

        // Provide more specific feedback based on Prisma error codes
        if (error.code === 'P2003') {
            return res.status(400).json({
                success: false,
                message: "The provided userId does not exist in the User table.",
                data: null
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message, // Temporary: remove this once fixed for security
            data: null
        });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        const updated = await ProfileService.updateProfile(userId, req.body);


        // here after the middle ware is inserted i have to use the req.user.id
        // const updated = await ProfileService.updateProfile(req.user.id, req.body);


        res.status(200).json({
            success: true,
            message: "Your profile information has been updated successfully.",
            data: updated
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Unable to update profile. Please check the provided data.",
            data: null
        });
    }
};

export const suggestNames = async (req: Request, res: Response) => {
    try {
        const base = req.query.base as string;
        if (!base) {
            return res.status(400).json({
                success: false,
                message: "Please provide a name to generate suggestions.",
                data: []
            });
        }

        const potentials = generateNatureSuggestions(base);
        const taken = await ProfileService.checkMultipleUsernames(potentials);
        const available = potentials.filter(name => !taken.includes(name));

        res.status(200).json({
            success: true,
            message: "Found available nature-themed names for you.",
            data: available
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error generating name suggestions.",
            data: []
        });
    }
};

export const deleteProfile = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        // await ProfileService.deleteProfile(req.user.id);

        await ProfileService.deleteProfile(userId);

        res.status(200).json({
            success: true,
            message: "Your profile has been successfully deleted.",
            data: null
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong while trying to delete your profile.",
            data: null
        });
    }
};