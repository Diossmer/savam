import mongoose, { Schema, Document } from 'mongoose';

export interface IRol extends Document {
  nombre: string;
  descripcion: string;
  permisos: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const RolSchema: Schema = new Schema<IRol>(
  {
    nombre: {
      type: String,
      required: true,
      unique: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    permisos: {
      type: [String],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'roles',
  }
);

export default mongoose.model<IRol>('roles', RolSchema);
