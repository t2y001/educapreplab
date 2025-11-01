export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    subscription_plan: 'free' | 'inicial' | 'avanzado' | null;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
    ziggy: {
        location: string;
        port: number | null;
        query: Record<string, string>;
        url: string;
        defaults: Record<string, string>;
        routes: Record<string, any>;
    };
};
