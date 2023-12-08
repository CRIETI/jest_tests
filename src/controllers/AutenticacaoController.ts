import { Request, Response } from "express";
import { Usuario } from "../models/Usuario";
import bcrypt from "bcrypt";

export class AutenticacaoController {

  async login (req: Request, res: Response): Promise<Response> {
    let email = req.body.email;
    let senha = req.body.senha;

    let usuario: Usuario|null = await Usuario.findOne({
      where: {
        email: email
      },
      select: ['id', 'email', 'senha']
    });

    if (! usuario) {
      return res.status(401).json({ mensagem: 'Usuário não encontrado' });
    }

    let resultado = await bcrypt.compare(senha, usuario.senha);

    if (! resultado) {
      return res.status(401).json({ mensagem: 'Senha inválida' });
    }

    let token: string = Buffer.from(`${email}:${senha}`).toString('base64');

    return res.status(200).json({
      token,
      type: 'Basic'
    });
  }

}
