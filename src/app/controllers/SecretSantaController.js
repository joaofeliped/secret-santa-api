/* eslint-disable class-methods-use-this */
import { parseISO, isBefore, addDays } from 'date-fns';
import * as Yup from 'yup';
import SecretSanta from '../schemas/SecretSanta';

class SecretSantaController {
  async index(req, res) {
    const { id } = req.params;

    if (id) {
      try {
        const amigoOcultoEncontrado = await SecretSanta.findOne({
          _id: id,
        });
        return res.json(amigoOcultoEncontrado);
      } catch (err) {
        return res.status(404).json('Não foi encontrado nenhum registro.');
      }
    }

    const amigosOcultos = await SecretSanta.find().sort({ createdAt: 'desc' });
    return res.json(amigosOcultos);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      data: Yup.date().required(),
      data_sorteio: Yup.date().required(),
      observacao: Yup.string(),
      valor_minimo: Yup.number(),
      valor_maximo: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'A validação falhou.' });
    }

    const {
      nome,
      data,
      data_sorteio,
      observacao,
      valor_minimo,
      valor_maximo,
    } = req.body;

    const dataAmigoOculto = parseISO(data);
    const dataSorteioAmigoOculto = parseISO(data_sorteio);

    if (isBefore(dataAmigoOculto, dataSorteioAmigoOculto)) {
      return res.status(400).json({
        error:
          'A data do Amigo oculto não pode ser anterior a data do sorteio.',
      });
    }

    if (isBefore(dataAmigoOculto, addDays(dataSorteioAmigoOculto, 7))) {
      return res.status(400).json({
        error:
          'A data do Amigo oculto tem que ser pelo menos uma semana após a data do sorteio.',
      });
    }

    const amigoOculto = await SecretSanta.create({
      nome,
      data,
      data_sorteio,
      observacao,
      valor_minimo,
      valor_maximo,
    });
    return res.json(amigoOculto);
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      if (id) {
        const aoe = await SecretSanta.findByIdAndUpdate(
          id,
          { $set: req.body },
          err => {
            if (err) {
              console.log(err);
            }
          }
        );

        return res.json(aoe);
      }
    } catch (err) {
      return res.status(404).json('Não foi encontrado nenhum registro.');
    }
    return res.status(404).json('Não foi encontrado nenhum registro.');
  }

  async delete(req, res) {
    const { id } = req.params;

    await SecretSanta.findByIdAndDelete(id, err => {
      if (err) {
        res.status(400).json('Não foi encontrado o registro para remover.');
      }
    });
    res.json('Registro removido com sucesso.');
  }

  async cancel(req, res) {
    try {
      const { id } = req.params;
      if (id) {
        const data_cancelamento = new Date();

        const amigoOculto = await SecretSanta.findById(id);

        if (amigoOculto.data_cancelamento) {
          return res.status(400).json('Esse amigo oculto já foi cancelado.');
        }

        if (isBefore(amigoOculto.data, data_cancelamento)) {
          return res
            .status(400)
            .json(
              'Não foi possível cancelar o amigo oculto pois o mesmo já aconteceu.'
            );
        }

        const amigoOcultoSalvo = await SecretSanta.findByIdAndUpdate(
          id,
          {
            data_cancelamento,
          },
          { new: true }
        );

        return res.json(amigoOcultoSalvo);
      }
    } catch (err) {
      console.log(err);

      return res.status(404).json('Não foi encontrado nenhum registro.(1)');
    }
    return res.status(404).json('Não foi encontrado nenhum registro.(2)');
  }
}

export default new SecretSantaController();
