import mongoose, { Schema, Document } from 'mongoose';

export interface ISuscriptor extends Document {
  numeroTelefono: string;
  estatus: string;
  operador: string;
  fecha: Date;
  whatsapp: boolean;
  telegram: boolean;
  cedula: string;
}

const SuscriptorSchema: Schema = new Schema<ISuscriptor>(
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
    whatsapp: {
      type: Boolean,
      required: true,
    },
    telegram: {
      type: Boolean,
      required: true,
    },
    operador: {
      type: String,
      required: true,
    },
    fecha: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'suscriptor',
  }
);

export default mongoose.model<ISuscriptor>('suscriptor', SuscriptorSchema);