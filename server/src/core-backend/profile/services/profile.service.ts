import prisma from "../../../lib/prisma";


//might be a problem here because I have defined id but in service it is userId
export class ProfileService {
    static async findByUserId(userId: string) {
        return await prisma.profile.findUnique({ where: { userId } });
    }

    static async findByUsername(username: string) {
        return await prisma.profile.findUnique({ where: { username } });
    }

    static async createProfile(data: any) {
        return await prisma.profile.create({ data });
    }

    static async updateProfile(userId: string, data: any) {
        return await prisma.profile.update({
            where: { userId },
            data,
        });
    }

    static async deleteProfile(userId: string) {
        return await prisma.profile.delete({ where: { userId } });
    }

    static async getTakenUsernames(names: string[]) {
        const taken = await prisma.profile.findMany({
            where: { username: { in: names } },
            select: { username: true }
        });
        return taken.map(p => p.username);
    }

    static async checkMultipleUsernames(names: string[]) {
        const existingProfiles = await prisma.profile.findMany({
            where: {
                username: {
                    in: names,
                },
            },
            select: {
                username: true,
            },
        });
        // Return just the strings of taken usernames
        return existingProfiles.map((p) => p.username);
    }

}