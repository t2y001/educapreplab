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

export interface Area {
    id: number;
    nombre: string;
    slug: string;
    descripcion?: string;
}

export interface Tema {
    id: number;
    area_id: number;
    nombre: string;
    slug: string;
    descripcion?: string;
}

export interface Subtema {
    id: number;
    tema_id: number;
    eje_id: number;
    nombre: string;
    slug: string;
    descripcion?: string;
}

export interface InquityOption {
    id?: number;
    option_label: string;
    option_text: string;
    is_correct: boolean;
    feedback: string;
}

export interface InquiryStep {
    id?: number; // El ID no existe si es nuevo
    order: number;
    step_text: string;
    step_type: 'multiple_choice' | 'open_ended' | 'simulation_result' | 'conclusion';
    simulation_data: any; // O JSON
    inquiry_options: InquiryOption[];
}

export interface Inquiry {
    id: number; // El ID siempre existe cuando se carga
    title: string;
    description: string;
    status: 'draft' | 'published';
    area_id: number | null;
    tema_id: number | null;
    subtema_id: number | null;
    created_at: string;
    updated_at: string;

    // Relaciones que podemos cargar
    area?: Area;
    tema?: Tema;
    subtema?: Subtema;
    inquiry_steps?: InquiryStep[];
}