// // prisma/seed.ts
// import { PrismaClient, UserRole, PostStatus, VerificationType } from '@prisma/client';
// import { PrismaPg } from '@prisma/adapter-pg';
// import { Pool } from 'pg';
// import dotenv from 'dotenv';

// // 1. Load env vars
// dotenv.config();

// // 2. Setup Prisma Client with Adapter (Exactly as you requested)
// const connectionString = `${process.env.DATABASE_URL}`;
// const pool = new Pool({ connectionString });
// const adapter = new PrismaPg(pool);
// const prisma = new PrismaClient({ adapter });

// async function main() {
//   console.log('🌱 Starting seed...');

//   // 3. Cleanup existing data 
//   await prisma.otp.deleteMany();
//   await prisma.verificationToken.deleteMany();
//   await prisma.post.deleteMany();
//   await prisma.userStats.deleteMany();
//   await prisma.profile.deleteMany();
//   await prisma.user.deleteMany();

//   // 4. Create the Super Admin
//   const admin = await prisma.user.create({
//     data: {
//       email: 'admin@shuddi.ai',
//       passwordHash: 'hashed_secret_123',
//       role: UserRole.ADMIN,
//       emailVerified: true,
//       profile: {
//         create: {
//           username: 'super_admin',
//           displayName: 'System Admin',
//           bio: 'I manage the platform.',
//           country: 'India',
//           state: 'Delhi',
//           city: 'New Delhi',
//         },
//       },
//       stats: {
//         create: { xp: 1000, level: 10 },
//       },
//     },
//   });
//   console.log(`✅ Created Admin: ${admin.email}`);

//   // 5. Define Data for 7 Citizens
//   const citizensData = [
//     {
//       email: 'rahul@shuddi.ai',
//       username: 'rahul_clean',
//       displayName: 'Rahul Verma',
//       city: 'Mumbai',
//       state: 'Maharashtra',
//       bio: 'Passionate about clean beaches.',
//       posts: [
//         'Just saw a huge pile of garbage in Sector 4. Reporting it now!',
//         'The cleaning drive yesterday was amazing.',
//       ]
//     },
//     {
//       email: 'priya@shuddi.ai',
//       username: 'priya_green',
//       displayName: 'Priya Sharma',
//       city: 'Bangalore',
//       state: 'Karnataka',
//       bio: 'Techie and environmentalist.',
//       posts: [
//         'Found a broken pipe leaking sewage in Indiranagar.',
//         'Why is waste segregation so hard for some people?',
//       ]
//     },
//     {
//       email: 'amit@shuddi.ai',
//       username: 'amit_zero',
//       displayName: 'Amit Patel',
//       city: 'Ahmedabad',
//       state: 'Gujarat',
//       bio: 'Zero Waste advocate.',
//       posts: [
//         'Composting at home is easier than you think.',
//         'Sabarmati river front looks clean today.',
//       ]
//     },
//     {
//       email: 'sneha@shuddi.ai',
//       username: 'sneha_hyd',
//       displayName: 'Sneha Reddy',
//       city: 'Hyderabad',
//       state: 'Telangana',
//       bio: 'Green Hyderabad organizer.',
//       posts: [
//         'Plantation drive successful! 50 saplings planted.',
//         'Reporting illegal dumping near the lake.',
//       ]
//     },
//     {
//       email: 'vikram@shuddi.ai',
//       username: 'vikram_jpr',
//       displayName: 'Vikram Singh',
//       city: 'Jaipur',
//       state: 'Rajasthan',
//       bio: 'Preserving heritage cities.',
//       posts: [
//         'Tourists need to stop throwing bottles at the forts.',
//         'Dustbins installed at Amer Fort entrance.',
//       ]
//     },
//     {
//       email: 'anjali@shuddi.ai',
//       username: 'anjali_kol',
//       displayName: 'Anjali Das',
//       city: 'Kolkata',
//       state: 'West Bengal',
//       bio: 'Save the Ganges.',
//       posts: [
//         'The ghats are looking much better after cleanup.',
//         'Reporting standing water - dengue risk!',
//       ]
//     },
//     {
//       email: 'arjun@shuddi.ai',
//       username: 'arjun_chennai',
//       displayName: 'Arjun Nair',
//       city: 'Chennai',
//       state: 'Tamil Nadu',
//       bio: 'Coastal cleanup volunteer.',
//       posts: [
//         'Marina beach cleanup starts at 6 AM tomorrow.',
//         'Plastic usage has reduced in my neighborhood.',
//       ]
//     }
//   ];

//   // 6. Loop and Create Users
//   for (const data of citizensData) {
//     const user = await prisma.user.create({
//       data: {
//         email: data.email,
//         passwordHash: 'hashed_secret_456',
//         role: UserRole.CITIZEN,
//         emailVerified: true,
//         profile: {
//           create: {
//             username: data.username,
//             displayName: data.displayName,
//             bio: data.bio,
//             country: 'India',
//             state: data.state,
//             city: data.city,
//           },
//         },
//         stats: {
//           create: {
//             xp: Math.floor(Math.random() * 500),
//             level: Math.floor(Math.random() * 5) + 1,
//             totalContributions: data.posts.length,
//           },
//         },
//         posts: {
//           create: data.posts.map(postContent => ({
//             content: postContent,
//             status: PostStatus.PUBLISHED,
//           })),
//         },
//       },
//     });

//     // 7. Create Verification Token
//     // FIX: We use `data.username` because `user` object does not have username directly on it
//     await prisma.verificationToken.create({
//       data: {
//         userId: user.id,
//         type: VerificationType.EMAIL_VERIFICATION,
//         tokenHash: `token-${data.username}-${Date.now()}`,
//         expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
//       },
//     });

//     console.log(`✅ Created Citizen: ${data.email} (${data.city})`);
//   }

//   console.log('🌱 Seeding finished.');
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

// prisma/seed.ts
import { PrismaClient, UserRole, PostStatus, VerificationType, BadgeRarity } from '@prisma/client';
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
  console.log("SEED DATABASE:", process.env.DATABASE_URL);


  // 1. Cleanup existing data (Ordered to respect foreign keys)
  await prisma.userBadge.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.otp.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.post.deleteMany();
  await prisma.userStats.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Global Badges (Needed for the Badge Gallery route)
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

  // 4. Citizens Data
  const citizensData = [
    { email: 'rahul@shuddi.ai', username: 'rahul_clean', displayName: 'Rahul Verma', city: 'Mumbai', state: 'Maharashtra', posts: ['Post 1', 'Post 2'] },
    { email: 'priya@shuddi.ai', username: 'priya_green', displayName: 'Priya Sharma', city: 'Bangalore', state: 'Karnataka', posts: ['Post 1'] },
    { email: 'amit@shuddi.ai', username: 'amit_zero', displayName: 'Amit Patel', city: 'Ahmedabad', state: 'Gujarat', posts: ['Post 1', 'Post 2', 'Post 3'] },
    { email: 'sneha@shuddi.ai', username: 'sneha_hyd', displayName: 'Sneha Reddy', city: 'Hyderabad', state: 'Telangana', posts: ['Post 1'] },
    { email: 'vikram@shuddi.ai', username: 'vikram_jpr', displayName: 'Vikram Singh', city: 'Jaipur', state: 'Rajasthan', posts: ['Post 1'] },
    { email: 'anjali@shuddi.ai', username: 'anjali_kol', displayName: 'Anjali Das', city: 'Kolkata', state: 'West Bengal', posts: ['Post 1', 'Post 2'] },
    { email: 'arjun@shuddi.ai', username: 'arjun_chennai', displayName: 'Arjun Nair', city: 'Chennai', state: 'Tamil Nadu', posts: ['Post 1'] }
  ];

  // 5. Loop and Create Users with Full Dashboard Stats
  for (let i = 0; i < citizensData.length; i++) {
    const data = citizensData[i];
    const user = await prisma.user.create({
      data: {
        email: data.email,
        // node -e "console.log(require('bcryptjs').hashSync('password123', 10))"
        // use this to hash password
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
            // XP & Levels (Overview)
            xp: Math.floor(Math.random() * 2000),
            level: Math.floor(Math.random() * 10) + 1,
            
            // Impact Metrics (Impact Bar)
            totalContributions: data.posts.length,
            totalWeightRemoved: Math.random() * 50,
            nextMilestone: 100.0,

            // Streaks & Rewards (Overview Cards)
            currentStreak: Math.floor(Math.random() * 10),
            longestStreak: 12,
            rewardPoints: Math.floor(Math.random() * 500),

            // Ranking (Leaderboard)
            globalRank: i + 2, // Admin is #1
            region: data.city,
            regionalRank: 1,

            // Graph Data (Activity Graph)
            actionsLast7Days: Math.floor(Math.random() * 15),
            engagementLevel: Math.random() * 5.0
          },
        },
        posts: {
          create: data.posts.map(content => ({ content, status: PostStatus.PUBLISHED })),
        },
      },
    });

    // 6. Assign a random badge to each user
    await prisma.userBadge.create({
      data: {
        userId: user.id,
        badgeId: badges[i % badges.length].id,
      },
    });

    console.log(`✅ Created Citizen & Stats: ${data.email}`);
  }

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