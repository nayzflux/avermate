export type GetCustomAveragesResponse = {
    customAverages: {
        id: string;
        name: string;
        subjects: {
            id: string;
            customCoefficient: number | null;
            includeChildren: boolean | null;
        }[];
        isMainAverage: boolean;
        createdAt: number;
        userId: string;
    }[];
};
