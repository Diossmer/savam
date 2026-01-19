import mongoose, { Schema, Document } from 'mongoose';

export interface INumeros extends Document {
  cedula: string;
  estatus: string;
  numero: string;
  fechaDeConsulta: Date;
}

const NumerosSchema: Schema = new Schema<INumeros>(
  {
    cedula: {
      type: String,
      required: true,
    },
    numero: {
      type: String,
      required: true,
    },
    fechaDeConsulta: {
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