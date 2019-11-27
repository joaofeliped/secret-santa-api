import mongoose from 'mongoose';

const SecretSantaSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
    },
    data: {
      type: Date,
      required: true,
    },
    data_sorteio: {
      type: Date,
      required: true,
    },
    data_cancelamento: {
      type: Date,
    },
    observacao: {
      type: String,
    },
    valor_minimo: {
      type: Number,
    },
    valor_maximo: {
      type: Number,
    },
    // falta adicionar o Organizador.
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('SecretSanta', SecretSantaSchema);
