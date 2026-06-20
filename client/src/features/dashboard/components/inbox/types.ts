// src/components/inbox/types.ts

export interface Invitation {
    id: string;

    status:
        | "PENDING"
        | "ACCEPTED"
        | "REJECTED";

    createdAt: string;

    ngo: {
        id: string;
        name: string;
        status: string;

        area: {
            name: string;
        };
    };

    role: {
        id: string;
        name: string;
        description?: string;
    };
}