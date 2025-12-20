import mongoose, { Schema, Document } from 'mongoose';

export interface IUsuario extends Document {
  oficina: string;
  correo: string;
  estado: string;
  nombre: string;
  apellido: string;
  cedula: string;
  password: string;
  roles: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const UsuarioSchema: Schema = new Schema<IUsuario>(
  {
    oficina: {
      type: String,
      required: true,
    },
    correo: {
      type: String,
      required: true,
      unique: true,
    },
    estado: {
      type: String,
      required: true,
    },
    nombre: {
      type: String,
      required: true,
    },
    apellido: {
      type: String,
      required: true,
    },
    cedula: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: [{
      type: Schema.Types.ObjectId,
      ref: 'roles',
      required: false,
    }],
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'usuarios',
  }
);

export default mongoose.model<IUsuario>('usuarios', UsuarioSchema);
