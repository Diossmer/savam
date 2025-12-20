import { IRolesRepository, Roles } from "@/types/rolesType";
import RolesModel from "@/models/Roles";

export class RolesRepository implements IRolesRepository {
    // Helper para convertir de MongoDB Document a API Type
    private mapToRoles(doc: any): Roles {
        return {
            id: String(doc._id),
            nombre: doc.nombre,
            descripcion: doc.descripcion,
            permisos: doc.permisos
        };
    }

    async createRoles(data: Roles): Promise<Roles> {
        const newRol = new RolesModel({
            nombre: data.nombre,
            descripcion: data.descripcion,
            permisos: data.permisos,
        });

        const savedRol = await newRol.save();

        // Convertir documento de Mongoose a objeto plano y mapear
        return this.mapToRoles(savedRol.toObject());
    }

    async findRoles(): Promise<Roles[]> {
        const roles = await RolesModel.find().lean();

        // Mapear cada documento de MongoDB a la interfaz de la API
        return roles.map(rol => this.mapToRoles(rol));
    }

    async findByIdRoles(id: string): Promise<Roles | null> {
        const rol = await RolesModel.findById(id).lean();

        if (!rol) {
            return null;
        }

        // Mapear de MongoDB a la interfaz de la API
        return this.mapToRoles(rol);
    }

    async updateRoles(id: string, data: Roles): Promise<Roles | null> {
        const rolActualizado = await RolesModel.findByIdAndUpdate(
            id,
            {
                nombre: data.nombre,
                descripcion: data.descripcion,
                permisos: data.permisos
            },
            { new: true }
        ).lean();

        if (!rolActualizado) {
            return null;
        }

        // Mapear de MongoDB a la interfaz de la API
        return this.mapToRoles(rolActualizado);
    }

    async deleteRoles(id: string): Promise<Roles | null> {
        const rolEliminado = await RolesModel.findByIdAndDelete(id).lean();

        if (!rolEliminado) {
            return null;
        }

        // Mapear de MongoDB a la interfaz de la API
        return this.mapToRoles(rolEliminado);
    }
}