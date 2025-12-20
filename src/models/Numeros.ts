import mongoose, { Schema, Document } from 'mongoose';

export interface INumeros extends Document {
  cedula: string;
  estatus: string;
  numeroTelefono: string;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
}

const NumerosSchema: Schema = new Schema<INumeros>(
  {
    cedula: {
      type: String,
      required: true,
    },
    estatus: {
      type: String,
      required: true,
    },
    numeroTelefono: {
      type: String,
      required: true,
    },
    fecha_creacion: {
      type: Date,
      required: true,
    },
    fecha_actualizacion: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'numeros',
  }
);

export default mongoose.model<INumeros>('numeros', NumerosSchema);