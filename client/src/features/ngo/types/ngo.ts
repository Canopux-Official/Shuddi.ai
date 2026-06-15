// types/ngo.ts

export interface NGODashboardResponse {
  ngo: {
    id: string;
    name: string;
    status: string;

    area: {
      id: string;
      name: string;
    };
  };

  membership: {
    role: string;
    permissions: string[];
    isOwner: boolean;
  };

  stats: {
    totalMembers: number;
    activeMembers: number;
    totalCommunityTasks: number;
    activeCommunityTasks: number;
  };
}

// types/member.ts

export interface NGOMember {
  id: string;
  ngoId: string;
  roleId: string;
  status: string;

  role: {
    id: string;
    name: string;
    description: string;
  };

  user: {
    id: string;
    email: string;
    status: string;

    profile?: {
      displayName: string;
    };
  };
}

export interface NGORole {
  id: string;
  name: string;
  description: string;
}