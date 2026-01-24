// import { PrismaClient, UserRole, PostStatus, VerificationType, BadgeRarity } from '@prisma/client';
// import { PrismaPg } from '@prisma/adapter-pg';
// import { Pool } from 'pg';
// import dotenv from 'dotenv';

// dotenv.config();

// const connectionString = `${process.env.DATABASE_URL}`;
// const pool = new Pool({ connectionString });
// const adapter = new PrismaPg(pool);
// const prisma = new PrismaClient({ adapter });

// async function seedRewardConfigs() {
//   console.log('🌱 Seeding reward configurations...');
//   // ==========================================
//   // TASK REWARDS
//   // ==========================================

//   const taskConfigs = [
//     {
//       taskType: 'TREE_PLANTING',
//       rewardAmount: 50,
//       description: 'Reward for planting trees'
//     },
//     {
//       taskType: 'BEACH_CLEANUP',
//       rewardAmount: 75,
//       description: 'Reward for beach cleanup activities'
//     },
//     {
//       taskType: 'WASTE_SEGREGATION',
//       rewardAmount: 30,
//       description: 'Reward for proper waste segregation'
//     },
//     {
//       taskType: 'RIVER_CLEANUP',
//       rewardAmount: 100,
//       description: 'Reward for river cleanup projects'
//     },
//     {
//       taskType: 'RECYCLING',
//       rewardAmount: 40,
//       description: 'Reward for recycling activities'
//     }
//   ];
//   for (const config of taskConfigs) {
//     await prisma.rewardConfig.create({
//       data: config
//     });
//     console.log(`✅ Created config: ${config.taskType} = ${config.rewardAmount} points`);
//   }
//   // ==========================================
//   // EVENT REWARDS (Participation + Completion)
//   // ==========================================

//   const eventConfigs = [
//     {
//       taskType: 'COMMUNITY_EVENT',
//       eventType: 'PARTICIPATION',
//       rewardAmount: 25,
//       description: 'Reward for joining a community event'
//     },
//     {
//       taskType: 'COMMUNITY_EVENT',
//       eventType: 'COMPLETION',
//       rewardAmount: 100,
//       description: 'Reward for completing a community event'
//     },
//     {
//       taskType: 'EDUCATIONAL_WORKSHOP',
//       eventType: 'PARTICIPATION',
//       rewardAmount: 30,
//       description: 'Reward for attending educational workshop'
//     },
//     {
//       taskType: 'EDUCATIONAL_WORKSHOP',
//       eventType: 'COMPLETION',
//       rewardAmount: 75,
//       description: 'Reward for completing educational workshop'
//     }
//   ];
//   for (const config of eventConfigs) {
//     await prisma.rewardConfig.create({
//       data: config
//     });
//     console.log(`✅ Created config: ${config.taskType}:${config.eventType} = ${config.rewardAmount} points`);
//   }
//   console.log('✅ Reward configurations seeded successfully!');
// }

// async function main() {
//   console.log('🌱 Starting seed...');
//   console.log("SEED DATABASE:", process.env.DATABASE_URL);


//   // 1. Cleanup existing data (Ordered to respect foreign keys)
//   await prisma.rewardConfig.deleteMany();
//   await prisma.userBadge.deleteMany();
//   await prisma.badge.deleteMany();
//   await prisma.otp.deleteMany();
//   await prisma.verificationToken.deleteMany();
//   await prisma.post.deleteMany();
//   await prisma.userStats.deleteMany();
//   await prisma.profile.deleteMany();
//   await prisma.user.deleteMany();

//   // 2. Create Global Badges (Needed for the Badge Gallery route)
//   console.log('🏆 Creating Badges...');
//   const badges = await Promise.all([
//     prisma.badge.create({
//       data: {
//         name: 'Eco Warrior',
//         description: 'First 10kg of plastic removed.',
//         imageUrl: 'https://cdn-icons-png.flaticon.com/512/6270/6270295.png',
//         rarity: BadgeRarity.COMMON,
//         criteria: 'Remove 10kg',
//       },
//     }),
//     prisma.badge.create({
//       data: {
//         name: 'Plastic Slayer',
//         description: 'Completed 5 cleanups in a week.',
//         imageUrl: 'https://cdn-icons-png.flaticon.com/512/4343/4343315.png',
//         rarity: BadgeRarity.RARE,
//         criteria: '5 contributions',
//       },
//     }),
//     prisma.badge.create({
//       data: {
//         name: 'Earth Guardian',
//         description: 'Top 1% of the global leaderboard.',
//         imageUrl: 'https://cdn-icons-png.flaticon.com/512/1162/1162456.png',
//         rarity: BadgeRarity.LEGENDARY,
//         criteria: 'Global Rank #1',
//       },
//     }),
//   ]);

//   // 3. Create the Super Admin
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
//           country: 'India',
//           state: 'Delhi',
//           city: 'New Delhi',
//         },
//       },
//       stats: {
//         create: { 
//           xp: 5000, 
//           level: 25,
//           totalWeightRemoved: 250.5,
//           nextMilestone: 500.0,
//           currentStreak: 15,
//           longestStreak: 30,
//           rewardPoints: 1200,
//           globalRank: 1,
//           region: 'Delhi',
//           regionalRank: 1
//         },
//       },
//     },
//   });

//   // 4. Citizens Data
//   const citizensData = [
//     { email: 'rahul@shuddi.ai', username: 'rahul_clean', displayName: 'Rahul Verma', city: 'Mumbai', state: 'Maharashtra', posts: ['Post 1', 'Post 2'] },
//     { email: 'priya@shuddi.ai', username: 'priya_green', displayName: 'Priya Sharma', city: 'Bangalore', state: 'Karnataka', posts: ['Post 1'] },
//     { email: 'amit@shuddi.ai', username: 'amit_zero', displayName: 'Amit Patel', city: 'Ahmedabad', state: 'Gujarat', posts: ['Post 1', 'Post 2', 'Post 3'] },
//     { email: 'sneha@shuddi.ai', username: 'sneha_hyd', displayName: 'Sneha Reddy', city: 'Hyderabad', state: 'Telangana', posts: ['Post 1'] },
//     { email: 'vikram@shuddi.ai', username: 'vikram_jpr', displayName: 'Vikram Singh', city: 'Jaipur', state: 'Rajasthan', posts: ['Post 1'] },
//     { email: 'anjali@shuddi.ai', username: 'anjali_kol', displayName: 'Anjali Das', city: 'Kolkata', state: 'West Bengal', posts: ['Post 1', 'Post 2'] },
//     { email: 'arjun@shuddi.ai', username: 'arjun_chennai', displayName: 'Arjun Nair', city: 'Chennai', state: 'Tamil Nadu', posts: ['Post 1'] }
//   ];

//   // 5. Loop and Create Users with Full Dashboard Stats
//   for (let i = 0; i < citizensData.length; i++) {
//     const data = citizensData[i];
//     const user = await prisma.user.create({
//       data: {
//         email: data.email,
//         // node -e "console.log(require('bcryptjs').hashSync('password123', 10))"
//         // use this to hash password
//         passwordHash: "$2b$10$wKA5lqQNJAIN48dUWLph0.aUaQ0FuaYDS62BCMPWb8uYtRxwuODW6",
//         role: UserRole.CITIZEN,
//         emailVerified: true,
//         profile: {
//           create: {
//             username: data.username,
//             displayName: data.displayName,
//             country: 'India',
//             state: data.state,
//             city: data.city,
//           },
//         },
//         stats: {
//           create: {
//             // XP & Levels (Overview)
//             xp: Math.floor(Math.random() * 2000),
//             level: Math.floor(Math.random() * 10) + 1,

//             // Impact Metrics (Impact Bar)
//             totalContributions: data.posts.length,
//             totalWeightRemoved: Math.random() * 50,
//             nextMilestone: 100.0,

//             // Streaks & Rewards (Overview Cards)
//             currentStreak: Math.floor(Math.random() * 10),
//             longestStreak: 12,
//             rewardPoints: Math.floor(Math.random() * 500),

//             // Ranking (Leaderboard)
//             globalRank: i + 2, // Admin is #1
//             region: data.city,
//             regionalRank: 1,

//             // Graph Data (Activity Graph)
//             actionsLast7Days: Math.floor(Math.random() * 15),
//             engagementLevel: Math.random() * 5.0
//           },
//         },
//         posts: {
//           create: data.posts.map(content => ({ content, status: PostStatus.PUBLISHED })),
//         },
//       },
//     });

//     // 6. Assign a random badge to each user
//     await prisma.userBadge.create({
//       data: {
//         userId: user.id,
//         badgeId: badges[i % badges.length].id,
//       },
//     });

//     console.log(`✅ Created Citizen & Stats: ${data.email}`);
//   }

//   // 7. Seed Reward Configurations
//   await seedRewardConfigs();

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


import { PrismaClient, UserRole, PostStatus, VerificationType, BadgeRarity } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seedRewardConfigs() {
    console.log('🌱 Seeding reward configurations...');

    const taskConfigs = [
        {
            taskType: 'TREE_PLANTING',
            rewardAmount: 50,
            description: 'Reward for planting trees'
        },
        {
            taskType: 'BEACH_CLEANUP',
            rewardAmount: 75,
            description: 'Reward for beach cleanup activities'
        },
        {
            taskType: 'WASTE_SEGREGATION',
            rewardAmount: 30,
            description: 'Reward for proper waste segregation'
        },
        {
            taskType: 'RIVER_CLEANUP',
            rewardAmount: 100,
            description: 'Reward for river cleanup projects'
        },
        {
            taskType: 'RECYCLING',
            rewardAmount: 40,
            description: 'Reward for recycling activities'
        }
    ];

    for (const config of taskConfigs) {
        await prisma.rewardConfig.create({
            data: config
        });
        console.log(`✅ Created config: ${config.taskType} = ${config.rewardAmount} points`);
    }

    const eventConfigs = [
        {
            taskType: 'COMMUNITY_EVENT',
            eventType: 'PARTICIPATION',
            rewardAmount: 25,
            description: 'Reward for joining a community event'
        },
        {
            taskType: 'COMMUNITY_EVENT',
            eventType: 'COMPLETION',
            rewardAmount: 100,
            description: 'Reward for completing a community event'
        },
        {
            taskType: 'EDUCATIONAL_WORKSHOP',
            eventType: 'PARTICIPATION',
            rewardAmount: 30,
            description: 'Reward for attending educational workshop'
        },
        {
            taskType: 'EDUCATIONAL_WORKSHOP',
            eventType: 'COMPLETION',
            rewardAmount: 75,
            description: 'Reward for completing educational workshop'
        }
    ];

    for (const config of eventConfigs) {
        await prisma.rewardConfig.create({
            data: config
        });
        console.log(`✅ Created config: ${config.taskType}:${config.eventType} = ${config.rewardAmount} points`);
    }

    console.log('✅ Reward configurations seeded successfully!');
}

async function seedNGOsAndCampaigns() {
    console.log('🏢 Seeding NGOs and Campaigns...');

    // Create NGOs
    const ngo1 = await prisma.ngo.create({
        data: {
            name: 'Green Earth Foundation',
            description: 'Working towards a plastic-free planet',
            category: 'ENVIRONMENT',
            logoUrl: 'https://via.placeholder.com/150/00FF00/FFFFFF?text=GEF',
            website: 'https://greenearthfoundation.org',
            email: 'contact@greenearthfoundation.org',
            phoneNumber: '+91-9876543210',
            registrationNumber: 'NGO-2020-001',
            verifiedAt: new Date(),
            address: '123 Green Street',
            city: 'Mumbai',
            state: 'Maharashtra',
            country: 'India',
            isActive: true
        }
    });

    const ngo2 = await prisma.ngo.create({
        data: {
            name: 'Ocean Warriors',
            description: 'Protecting our oceans from plastic pollution',
            category: 'ENVIRONMENT',
            logoUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=OW',
            website: 'https://oceanwarriors.org',
            email: 'info@oceanwarriors.org',
            phoneNumber: '+91-9876543211',
            registrationNumber: 'NGO-2019-002',
            verifiedAt: new Date(),
            address: '456 Beach Road',
            city: 'Chennai',
            state: 'Tamil Nadu',
            country: 'India',
            isActive: true
        }
    });

    const ngo3 = await prisma.ngo.create({
        data: {
            name: 'Clean India Initiative',
            description: 'Making India cleaner, one step at a time',
            category: 'SANITATION',
            logoUrl: 'https://via.placeholder.com/150/FF8800/FFFFFF?text=CII',
            website: 'https://cleanindia.org',
            email: 'hello@cleanindia.org',
            phoneNumber: '+91-9876543212',
            registrationNumber: 'NGO-2021-003',
            verifiedAt: new Date(),
            address: '789 Clean Lane',
            city: 'Delhi',
            state: 'Delhi',
            country: 'India',
            isActive: true
        }
    });

    console.log('✅ Created 3 NGOs');

    // Create Campaigns
    const campaign1 = await prisma.campaign.create({
        data: {
            ngoId: ngo1.id,
            title: 'Plant 1 Million Trees',
            description: 'Help us plant 1 million trees across India by 2025',
            imageUrl: 'https://via.placeholder.com/400x200/00FF00/FFFFFF?text=Plant+Trees',
            goalAmount: 1000000,
            raisedAmount: 250000,
            startDate: new Date('2024-01-01'),
            endDate: new Date('2025-12-31'),
            isActive: true
        }
    });

    const campaign2 = await prisma.campaign.create({
        data: {
            ngoId: ngo2.id,
            title: 'Save Our Beaches',
            description: 'Clean 100 beaches across coastal India',
            imageUrl: 'https://via.placeholder.com/400x200/0000FF/FFFFFF?text=Clean+Beaches',
            goalAmount: 500000,
            raisedAmount: 125000,
            startDate: new Date('2024-06-01'),
            endDate: new Date('2024-12-31'),
            isActive: true
        }
    });

    const campaign3 = await prisma.campaign.create({
        data: {
            ngoId: ngo3.id,
            title: 'Waste Segregation Drive',
            description: 'Educate 10,000 households about proper waste segregation',
            imageUrl: 'https://via.placeholder.com/400x200/FF8800/FFFFFF?text=Waste+Drive',
            goalAmount: 200000,
            raisedAmount: 50000,
            startDate: new Date('2024-03-01'),
            isActive: true
        }
    });

    console.log('✅ Created 3 Campaigns');

    return { ngo1, ngo2, ngo3, campaign1, campaign2, campaign3 };
}

async function main() {
    console.log('🌱 Starting seed...');
    console.log("SEED DATABASE:", process.env.DATABASE_URL);

    // 1. Cleanup existing data (Ordered to respect foreign keys)
    console.log('🧹 Cleaning up existing data...');
    await prisma.donation.deleteMany();
    await prisma.rewardIdempotency.deleteMany();
    await prisma.ledgerEntry.deleteMany();
    await prisma.campaign.deleteMany();
    await prisma.ngo.deleteMany();
    await prisma.rewardConfig.deleteMany();
    await prisma.userBadge.deleteMany();
    await prisma.badge.deleteMany();
    await prisma.otp.deleteMany();
    await prisma.verificationToken.deleteMany();
    await prisma.post.deleteMany();
    await prisma.userStats.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();

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

    // 3. Create the Super Admin
    console.log('👨‍💼 Creating Admin...');
    const admin = await prisma.user.create({
        data: {
            email: 'admin@shuddi.ai',
            passwordHash: '$2b$10$wKA5lqQNJAIN48dUWLph0.aUaQ0FuaYDS62BCMPWb8uYtRxwuODW6',
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

    console.log(`✅ Admin created with ID: ${admin.id}`);
    console.log(`   📧 Email: admin@shuddi.ai`);
    console.log(`   🔑 Password: password123`);

    // 4. Citizens Data
    const citizensData = [
        { email: 'rahul@shuddi.ai', username: 'rahul_clean', displayName: 'Rahul Verma', city: 'Mumbai', state: 'Maharashtra', posts: ['Post 1', 'Post 2'] },
        { email: 'priya@shuddi.ai', username: 'priya_green', displayName: 'Priya Sharma', city: 'Bangalore', state: 'Karnataka', posts: ['Post 1'] },
        { email: 'amit@shuddi.ai', username: 'amit_zero', displayName: 'Amit Patel', city: 'Ahmedabad', state: 'Gujarat', posts: ['Post 1', 'Post 2', 'Post 3'] },
        { email: 'sneha@shuddi.ai', username: 'sneha_hyd', displayName: 'Sneha Reddy', city: 'Hyderabad', state: 'Telangana', posts: ['Post 1'] },
        { email: 'vikram@shuddi.ai', username: 'vikram_jpr', displayName: 'Vikram Singh', city: 'Jaipur', state: 'Rajasthan', posts: ['Post 1'] },
    ];

    const citizens = [];

    // 5. Loop and Create Users
    console.log('👥 Creating Citizens...');
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

        citizens.push(user);

        await prisma.userBadge.create({
            data: {
                userId: user.id,
                badgeId: badges[i % badges.length].id,
            },
        });

        console.log(`✅ Created Citizen: ${data.email} (ID: ${user.id})`);
    }

    // 6. Seed NGOs and Campaigns
    const { ngo1, ngo2, ngo3, campaign1, campaign2, campaign3 } = await seedNGOsAndCampaigns();

    // 7. Seed Reward Configurations
    await seedRewardConfigs();

    // 8. Create Some Test Ledger Entries for First Citizen
    console.log('💰 Creating test reward transactions...');
    const testUser = citizens[0]; // Rahul

    const testUserWithProfile = await prisma.user.findUnique({
        where: { id: testUser.id },
        include: { profile: true }
    });



    // Give Rahul some rewards
    const ledger1 = await prisma.ledgerEntry.create({
        data: {
            userId: testUser.id,
            transactionType: 'EARN',
            amount: 50,
            balanceAfter: 50,
            referenceType: 'TASK',
            referenceId: 'task-001',
            metadata: { taskType: 'TREE_PLANTING', note: 'Planted 10 trees' }
        }
    });

    await prisma.rewardIdempotency.create({
        data: {
            idempotencyKey: `task:task-001:user:${testUser.id}:verification:ver-001`,
            userId: testUser.id,
            ledgerEntryId: ledger1.id
        }
    });

    const ledger2 = await prisma.ledgerEntry.create({
        data: {
            userId: testUser.id,
            transactionType: 'EARN',
            amount: 75,
            balanceAfter: 125,
            referenceType: 'TASK',
            referenceId: 'task-002',
            metadata: { taskType: 'BEACH_CLEANUP', note: 'Cleaned 5kg plastic from beach' }
        }
    });

    await prisma.rewardIdempotency.create({
        data: {
            idempotencyKey: `task:task-002:user:${testUser.id}:verification:ver-002`,
            userId: testUser.id,
            ledgerEntryId: ledger2.id
        }
    });

    console.log(`✅ Created test transactions for ${testUserWithProfile?.profile?.displayName}`);
    console.log(`   Balance: 125 points (50 + 75)`);

    // 9. Print Testing Information
    console.log('\n');
    console.log('='.repeat(60));
    console.log('🎉 SEED COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log('\n📋 TESTING INFORMATION:\n');

    console.log('👨‍💼 ADMIN USER (for admin routes):');
    console.log(`   User ID: ${admin.id}`);
    console.log(`   Email: admin@shuddi.ai`);
    console.log(`   Role: ADMIN`);
    console.log(`   Use this ID in: ?test_user_id=${admin.id}&test_user_role=ADMIN\n`);

    console.log('👤 TEST CITIZEN (with existing rewards):');
    console.log(`   User ID: ${testUser.id}`);
    console.log(`   Email: ${testUser.email}`);
    console.log(`✅ Display Name: ${testUserWithProfile?.profile?.displayName}`);
    console.log(`   Current Balance: 125 points`);
    console.log(`   Use this ID in: ?test_user_id=${testUser.id}\n`);

    console.log('👥 OTHER CITIZENS:');
    citizens.slice(1).forEach((user, index) => {
        console.log(`   ${index + 2}. ${user.email} (ID: ${user.id})`);
    });

    console.log('\n🏢 NGOs:');
    console.log(`   1. ${ngo1.name} (ID: ${ngo1.id})`);
    console.log(`   2. ${ngo2.name} (ID: ${ngo2.id})`);
    console.log(`   3. ${ngo3.name} (ID: ${ngo3.id})`);

    console.log('\n🎯 CAMPAIGNS:');
    console.log(`   1. ${campaign1.title} (ID: ${campaign1.id}) - NGO: ${ngo1.name}`);
    console.log(`   2. ${campaign2.title} (ID: ${campaign2.id}) - NGO: ${ngo2.name}`);
    console.log(`   3. ${campaign3.title} (ID: ${campaign3.id}) - NGO: ${ngo3.name}`);

    console.log('\n' + '='.repeat(60));
    console.log('🚀 Ready for Postman Testing!');
    console.log('='.repeat(60));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });