export interface NGORequest {
  id: string;
  name: string;
  area: string;
  owner: string;
  submittedAt: string;
  description: string;
  documents: string[];
}

export interface NGO {
  id: string;
  name: string;
  area: string;
  members: number;
}