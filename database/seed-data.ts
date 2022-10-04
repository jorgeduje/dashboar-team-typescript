
interface SeedData {
    entries: SeedEntry[]
}

interface SeedEntry {
    description: string;
    status: string;
    createdAt: number;
}

export const seedData: SeedData = {
    entries: [
        {
            description: "pendiente: alguna descripcion",
            status: "pending",
            createdAt: Date.now()
        },
        {
            description: "progreso: alguna descripcion in progress",
            status: "in-progress",
            createdAt: Date.now() - 1000000
        },
        {
            description: "completada: alguna descripcion finished",
            status: "finished",
            createdAt: Date.now() - 100000
        },
    ]
}