export interface Task {
  id: string;
  title: string;
  description: string;
  points: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Sustainability' | 'Community' | 'Education';
  image: string;
  timeEstimate: string;
  verificationType: 'IMAGE' | 'TEXT' | 'HYBRID' | 'MCQ';
  educationalLink?: string;
  steps?: string[];
  userStatus?: 'NOT_STARTED' | 'STARTED' | 'SUBMITTED' | 'APPROVED';
}

export const ALL_TASKS: Task[] = [
  { 
    id: 'task-waste-segregation', 
    title: "Segregate Household Waste", 
    description: "Separate wet and dry waste at home. Submit one photo showing both categories clearly labeled.",
    points: 50, 
    difficulty: 'Easy', 
    category: 'Sustainability',
    timeEstimate: '10 mins',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800', 
    verificationType: 'HYBRID',
    steps: ["Get two bins", "Label them Wet and Dry", "Sort your waste", "Take a photo"],
    educationalLink: "https://www.youtube.com/watch?v=example"
  },
  { 
    id: 'task-clean-spot', 
    title: "Clean a Spot", 
    description: "Clean one small area (staircase corner, desk area, park bench). Take a before and after photo.",
    points: 100, 
    difficulty: 'Medium', 
    category: 'Community',
    timeEstimate: '30 mins',
    image: 'https://images.unsplash.com/photo-1595278069441-2cf29f52d921?auto=format&fit=crop&w=800', 
    verificationType: 'IMAGE'
  },
  { 
    id: 'task-no-plastic', 
    title: "Avoid Single-Use Plastic", 
    description: "Buy something without plastic packaging (use a cloth bag or paper wrap) and submit proof.",
    points: 30, 
    difficulty: 'Easy', 
    category: 'Sustainability',
    timeEstimate: '1 purchase',
    image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800', 
    verificationType: 'HYBRID'
  },
  { 
    id: 'task-cloth-bag', 
    title: "Carry a Cloth Bag", 
    description: "Carry a reusable bag while shopping instead of taking a plastic one.",
    points: 20, 
    difficulty: 'Easy', 
    category: 'Sustainability',
    timeEstimate: 'Ongoing',
    image: 'https://images.unsplash.com/photo-1597843786271-105124152c74?auto=format&fit=crop&w=800', 
    verificationType: 'IMAGE'
  },
  { 
    id: 'task-public-transport', 
    title: "Use Public Transport", 
    description: "Travel via bus, metro, or train instead of a private vehicle today.",
    points: 40, 
    difficulty: 'Medium', 
    category: 'Sustainability',
    timeEstimate: '1 trip',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800', 
    verificationType: 'IMAGE'
  },
  { 
    id: 'task-micro-plastics', 
    title: "Learn: Micro-Plastics", 
    description: "Read the fact about micro-plastics and answer a quick question.",
    points: 10, 
    difficulty: 'Easy', 
    category: 'Education',
    timeEstimate: '2 mins',
    image: 'https://images.unsplash.com/photo-1618477461853-5f8dd68aa395?auto=format&fit=crop&w=800', 
    verificationType: 'MCQ'
  },
  { 
    id: 'task-donate-clothes', 
    title: "Donate Old Clothes", 
    description: "Don't throw them away! Donate your old clothes to a local shelter or NGO.",
    points: 80, 
    difficulty: 'Hard', 
    category: 'Community',
    timeEstimate: '1 hour',
    image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=800', 
    verificationType: 'IMAGE'
  },
  { 
    id: 'task-refer-friend', 
    title: "Refer a Friend", 
    description: "Invite a friend to join the platform. You get points when they complete their first task.",
    points: 200, 
    difficulty: 'Hard', 
    category: 'Community',
    timeEstimate: '5 mins',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800', 
    verificationType: 'TEXT'
  }
];