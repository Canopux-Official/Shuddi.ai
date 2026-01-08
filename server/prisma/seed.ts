// prisma/seed.ts
import { PrismaClient, UserRole, PostStatus, VerificationType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';

// 1. Load env vars
dotenv.config();

// 2. Setup Prisma Client with Adapter (Exactly as you requested)
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting seed...');

  // 3. Cleanup existing data 
  await prisma.otp.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.post.deleteMany();
  await prisma.userStats.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // 4. Create the Super Admin
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
          bio: 'I manage the platform.',
          country: 'India',
          state: 'Delhi',
          city: 'New Delhi',
        },
      },
      stats: {
        create: { xp: 1000, level: 10 },
      },
    },
  });
  console.log(`✅ Created Admin: ${admin.email}`);

  // 5. Define Data for 7 Citizens
  const citizensData = [
    {
      email: 'rahul@shuddi.ai',
      username: 'rahul_clean',
      displayName: 'Rahul Verma',
      city: 'Mumbai',
      state: 'Maharashtra',
      bio: 'Passionate about clean beaches.',
      posts: [
        'Just saw a huge pile of garbage in Sector 4. Reporting it now!',
        'The cleaning drive yesterday was amazing.',
      ]
    },
    {
      email: 'priya@shuddi.ai',
      username: 'priya_green',
      displayName: 'Priya Sharma',
      city: 'Bangalore',
      state: 'Karnataka',
      bio: 'Techie and environmentalist.',
      posts: [
        'Found a broken pipe leaking sewage in Indiranagar.',
        'Why is waste segregation so hard for some people?',
      ]
    },
    {
      email: 'amit@shuddi.ai',
      username: 'amit_zero',
      displayName: 'Amit Patel',
      city: 'Ahmedabad',
      state: 'Gujarat',
      bio: 'Zero Waste advocate.',
      posts: [
        'Composting at home is easier than you think.',
        'Sabarmati river front looks clean today.',
      ]
    },
    {
      email: 'sneha@shuddi.ai',
      username: 'sneha_hyd',
      displayName: 'Sneha Reddy',
      city: 'Hyderabad',
      state: 'Telangana',
      bio: 'Green Hyderabad organizer.',
      posts: [
        'Plantation drive successful! 50 saplings planted.',
        'Reporting illegal dumping near the lake.',
      ]
    },
    {
      email: 'vikram@shuddi.ai',
      username: 'vikram_jpr',
      displayName: 'Vikram Singh',
      city: 'Jaipur',
      state: 'Rajasthan',
      bio: 'Preserving heritage cities.',
      posts: [
        'Tourists need to stop throwing bottles at the forts.',
        'Dustbins installed at Amer Fort entrance.',
      ]
    },
    {
      email: 'anjali@shuddi.ai',
      username: 'anjali_kol',
      displayName: 'Anjali Das',
      city: 'Kolkata',
      state: 'West Bengal',
      bio: 'Save the Ganges.',
      posts: [
        'The ghats are looking much better after cleanup.',
        'Reporting standing water - dengue risk!',
      ]
    },
    {
      email: 'arjun@shuddi.ai',
      username: 'arjun_chennai',
      displayName: 'Arjun Nair',
      city: 'Chennai',
      state: 'Tamil Nadu',
      bio: 'Coastal cleanup volunteer.',
      posts: [
        'Marina beach cleanup starts at 6 AM tomorrow.',
        'Plastic usage has reduced in my neighborhood.',
      ]
    }
  ];

  // 6. Loop and Create Users
  for (const data of citizensData) {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: 'hashed_secret_456',
        role: UserRole.CITIZEN,
        emailVerified: true,
        profile: {
          create: {
            username: data.username,
            displayName: data.displayName,
            bio: data.bio,
            country: 'India',
            state: data.state,
            city: data.city,
          },
        },
        stats: {
          create: {
            xp: Math.floor(Math.random() * 500),
            level: Math.floor(Math.random() * 5) + 1,
            totalContributions: data.posts.length,
          },
        },
        posts: {
          create: data.posts.map(postContent => ({
            content: postContent,
            status: PostStatus.PUBLISHED,
          })),
        },
      },
    });

    // 7. Create Verification Token
    // FIX: We use `data.username` because `user` object does not have username directly on it
    await prisma.verificationToken.create({
      data: {
        userId: user.id,
        type: VerificationType.EMAIL_VERIFICATION,
        tokenHash: `token-${data.username}-${Date.now()}`,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });

    console.log(`✅ Created Citizen: ${data.email} (${data.city})`);
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