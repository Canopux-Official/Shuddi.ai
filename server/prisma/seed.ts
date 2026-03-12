// prisma/seed.ts
import { 
  PrismaClient, 
  UserRole, 
  PostStatus, 
  BadgeRarity, 
  // Import new Enums for Tasks
  TaskType, Difficulty, TaskCategory, TaskVerificationType
} from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting seed...');
  
  // 1. Cleanup existing data (Ordered to respect foreign keys)
  // Delete Task data first
  // await prisma.taskSubmission.deleteMany();
  // await prisma.task.deleteMany();
  
  // await prisma.userBadge.deleteMany();
  // await prisma.badge.deleteMany();
  // await prisma.otp.deleteMany();
  // await prisma.verificationToken.deleteMany();
  // await prisma.post.deleteMany();
  // await prisma.userStats.deleteMany();
  // await prisma.profile.deleteMany();
  // await prisma.user.deleteMany();
  // await prisma.campaigns.deleteMany();
  // await prisma.external_donations.deleteMany();
  // await prisma.payment_intents.deleteMany();
  // await prisma.taskScore.deleteMany()
  // await prisma.taskSubmission.deleteMany()
  // await prisma.communityTaskRegistration.deleteMany()
  // await prisma.task.deleteMany()
  // await prisma.rewardLedger.deleteMany()
  // await prisma.redemption.deleteMany()

  // 2. Create Global Badges
  console.log('🏆 Creating Badges...');
  const badges = await Promise.all([
    prisma.badge.create({
      data: {
        name: 'Eco Warrior',
        description: 'First 10kg of plastic removed.',
        imageUrl: 'https://cdn-icons-png.flaticon.com/512/6270/6270295.png',
        rarity: BadgeRarity.COMMON,
        criteria: 'Remove 10kg',
      },
    }),
    prisma.badge.create({
      data: {
        name: 'Plastic Slayer',
        description: 'Completed 5 cleanups in a week.',
        imageUrl: 'https://cdn-icons-png.flaticon.com/512/4343/4343315.png',
        rarity: BadgeRarity.RARE,
        criteria: '5 contributions',
      },
    }),
    prisma.badge.create({
      data: {
        name: 'Earth Guardian',
        description: 'Top 1% of the global leaderboard.',
        imageUrl: 'https://cdn-icons-png.flaticon.com/512/1162/1162456.png',
        rarity: BadgeRarity.LEGENDARY,
        criteria: 'Global Rank #1',
      },
    }),
  ]);

  console.log("Creating campaigns")
  await prisma.campaigns.createMany({
    data: [
      {
        title: 'Plant Trees for Urban Cities',
        description:
          'Help fund tree plantation drives in urban areas to improve air quality and reduce heat.',
        isActive: true,
      },
      {
        title: 'Clean Water for Rural Communities',
        description:
          'Support initiatives that provide clean and safe drinking water to rural villages.',
        isActive: true,
      },
      {
        title: 'Waste Reduction & Recycling Program',
        description:
          'Fund community-led recycling and waste reduction programs to promote sustainability.',
        isActive: true,
      },
    ],
  });

  // 3. Create the Super Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@shuddi.ai',
      passwordHash: 'hashed_secret_123',
      role: UserRole.ADMIN,
      emailVerified: true,
      profile: {
        create: {
          username: 'super_admin',
          displayName: 'System Admin',
          country: 'India',
          state: 'Delhi',
          city: 'New Delhi',
        },
      },
      stats: {
        create: { 
          xp: 5000, 
          level: 25,
          totalWeightRemoved: 250.5,
          nextMilestone: 500.0,
          currentStreak: 15,
          longestStreak: 30,
          rewardPoints: 1200,
          globalRank: 1,
          region: 'Delhi',
          regionalRank: 1
        },
      },
    },
  });

  // 5. Citizens Data
  const citizensData = [
    { email: 'rahul@shuddi.ai', username: 'rahul_clean', displayName: 'Rahul Verma', city: 'Mumbai', state: 'Maharashtra', posts: ['Post 1', 'Post 2'] },
    { email: 'priya@shuddi.ai', username: 'priya_green', displayName: 'Priya Sharma', city: 'Bangalore', state: 'Karnataka', posts: ['Post 1'] },
    { email: 'amit@shuddi.ai', username: 'amit_zero', displayName: 'Amit Patel', city: 'Ahmedabad', state: 'Gujarat', posts: ['Post 1', 'Post 2', 'Post 3'] },
    { email: 'sneha@shuddi.ai', username: 'sneha_hyd', displayName: 'Sneha Reddy', city: 'Hyderabad', state: 'Telangana', posts: ['Post 1'] },
    { email: 'vikram@shuddi.ai', username: 'vikram_jpr', displayName: 'Vikram Singh', city: 'Jaipur', state: 'Rajasthan', posts: ['Post 1'] },
    { email: 'anjali@shuddi.ai', username: 'anjali_kol', displayName: 'Anjali Das', city: 'Kolkata', state: 'West Bengal', posts: ['Post 1', 'Post 2'] },
    { email: 'arjun@shuddi.ai', username: 'arjun_chennai', displayName: 'Arjun Nair', city: 'Chennai', state: 'Tamil Nadu', posts: ['Post 1'] }
  ];

  // 6. Loop and Create Users with Full Dashboard Stats
  for (let i = 0; i < citizensData.length; i++) {
    const data = citizensData[i];
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: "$2b$10$wKA5lqQNJAIN48dUWLph0.aUaQ0FuaYDS62BCMPWb8uYtRxwuODW6",
        role: UserRole.CITIZEN,
        emailVerified: true,
        profile: {
          create: {
            username: data.username,
            displayName: data.displayName,
            country: 'India',
            state: data.state,
            city: data.city,
          },
        },
        stats: {
          create: {
            xp: Math.floor(Math.random() * 2000),
            level: Math.floor(Math.random() * 10) + 1,
            totalContributions: data.posts.length,
            totalWeightRemoved: Math.random() * 50,
            nextMilestone: 100.0,
            currentStreak: Math.floor(Math.random() * 10),
            longestStreak: 12,
            rewardPoints: Math.floor(Math.random() * 500),
            globalRank: i + 2, 
            region: data.city,
            regionalRank: 1,
            actionsLast7Days: Math.floor(Math.random() * 15),
            engagementLevel: Math.random() * 5.0
          },
        },
        posts: {
          create: data.posts.map(content => ({ content, status: PostStatus.PUBLISHED })),
        },
      },
    });

    // 7. Assign a random badge to each user
    await prisma.userBadge.create({
      data: {
        userId: user.id,
        badgeId: badges[i % badges.length].id,
      },
    });

    console.log(`✅ Created Citizen & Stats: ${data.email}`);
  }

  // 2. Seed campaigns (dummy data for Razorpay testing)

  
  // ----------------------------
  // INDIVIDUAL TASK 1
  // ----------------------------
  const task1 = await prisma.task.create({
    data: {
      type: TaskType.INDIVIDUAL,
      title: "Plant a Tree",
      description: "Plant a tree in your locality and upload proof.",
      baseScore: 50,
      individualTask: {
        create: {
          difficulty: Difficulty.EASY,
          category: TaskCategory.SUSTAINABILITY,
          verificationType: TaskVerificationType.IMAGE,
          requirements: {
            description: "Upload an image while planting the tree"
          },
          educationalLink: "https://en.wikipedia.org/wiki/Tree_planting",
          factContent: "Planting trees helps absorb CO2 and improves air quality."
        }
      }
    }
  });

  // ----------------------------
  // INDIVIDUAL TASK 2
  // ----------------------------
  const task2 = await prisma.task.create({
    data: {
      type: TaskType.INDIVIDUAL,
      title: "Waste Segregation Awareness",
      description: "Learn about waste segregation and answer a short quiz.",
      baseScore: 30,
      individualTask: {
        create: {
          difficulty: Difficulty.EASY,
          category: TaskCategory.EDUCATION,
          verificationType: TaskVerificationType.MCQ,
          requirements: {
            question: "Which bin is used for biodegradable waste?"
          },
          educationalLink: "https://swachhbharatmission.gov.in",
          factContent: "Segregating waste reduces landfill burden."
        }
      }
    }
  });

  // ----------------------------
  // COMMUNITY TASK 1
  // ----------------------------
  const task3 = await prisma.task.create({
    data: {
      type: TaskType.COMMUNITY,
      title: "Beach Cleanup Drive",
      description: "Join the beach cleanup initiative organized by the NGO.",
      baseScore: 100,
      startAt: new Date(Date.now() - 1000 * 60 * 60), // started 1 hour ago
      endAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // ends tomorrow
      communityTask: {
        create: {
          maxParticipants: 50,
          minParticipants: 10,
          locationName: "Puri Beach",
          city: "Puri",
          state: "Odisha",
          country: "India"
        }
      }
    }
  });

  // ----------------------------
  // COMMUNITY TASK 2
  // ----------------------------
  const task4 = await prisma.task.create({
    data: {
      type: TaskType.COMMUNITY,
      title: "Tree Plantation Camp",
      description: "Participate in a large-scale plantation drive.",
      baseScore: 80,
      startAt: new Date(Date.now() - 1000 * 60 * 60), // started 1 hour ago
      endAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // ends tomorrow
      communityTask: {
        create: {
          maxParticipants: 100,
          minParticipants: 20,
          locationName: "KIIT Campus",
          city: "Bhubaneswar",
          state: "Odisha",
          country: "India"
        }
      }
    }
  });
  console.log({ task1, task2, task3, task4 });

  await prisma.reward.createMany({
    data: [
      {
        name: "Eco-Friendly Tote Bag",
        description: "Made from recycled materials",
        credits: 200,
        icon: "bag",
      },
      {
        name: "Reusable Water Bottle",
        description: "Reduce plastic waste",
        credits: 150,
        icon: "bottle",
      },
      {
        name: "Plant a Tree",
        description: "We plant a tree on your behalf",
        credits: 500,
        icon: "tree",
      },
      {
        name: "Organic Notebook",
        description: "Notebook made from recycled paper",
        credits: 120,
        icon: "notebook",
      }
    ]
  });

  console.log("Rewards seeded successfully 🌱");


  console.log('🌱 Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });