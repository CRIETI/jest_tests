import { NextFunction, Request, Response } from "express";
import { Usuario } from "../models/Usuario";
import bcrypt from "bcrypt";

export async function basicAuth (req: Request, res: Response, next: NextFunction): Promise<Response|void> {
  let authorization = req.headers.authorization;

  if (! authorization) {
    return res.status(401).json({ mensagem: 'Credenciais não informadas' });
  }

  let [type, token] = authorization.split(' ');

  if (! type || type != 'Basic') {
    return res.status(401).json({ mensagem: 'Tipo de autenticação inválido' });
  }

  let [email, senha] = Buffer.from(token, 'base64').toString('utf8').split(':');

  let usuario: Usuario|null = await Usuario.findOne({
    where: {
      email: email
    },
    select: ['id', 'email', 'senha']
  });

  if (! usuario) {
    return res.status(401).json({ mensagem: 'Autenticação inválida' });
  }

  let resultado = await bcrypt.compare(senha, usuario.senha);

  if (! resultado) {
    return res.status(401).json({ mensagem: 'Autenticação inválida' });
  }

  return next();
}
