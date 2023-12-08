import request from 'supertest';
import server, { stopServer } from '../../server';
import { DataSource } from 'typeorm';
import { beforeAll, afterAll } from '@jest/globals';
import { Usuario } from '../../models/Usuario';
import bcrypt from 'bcrypt';
import { after } from 'node:test';

const connection = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  dropSchema: true,
  entities: [Usuario],
  synchronize: true,
  logging: false,
});

describe('Usuário', () => {
  let usuarioId: Number = 0;

  beforeAll(async () => {
    await connection.initialize();
  });

  afterAll(async () => {
    await stopServer();
    await connection.destroy();
  });

  describe('Model', () => {

    it('criar novo usuário', async () => {
      const senha = await bcrypt.hash('senha123', 10);
      const novoUsuario = await Usuario.create({
        nome: 'Juca Bala',
        email: 'teste@example.com',
        senha: senha,
      }).save();

      expect(novoUsuario.id).toBeDefined();
      expect(novoUsuario.nome).toBe('Juca Bala');
      expect(novoUsuario.email).toBe('teste@example.com');
      expect(novoUsuario.senha).toBe(senha);
    });
  });

  describe('Rotas', () => {

    it('rota get /usuarios', async () => {
      const response = await request(server).get('/usuarios');

      expect(response.status).toBe(200);
    });

    it('rota post /usuarios ', async () => {
      const response = await request(server)
        .post('/usuarios')
        .send({
          nome: 'Juca Bala',
          email: 'testuser@example.com',
          senha: 'batata123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('nome', 'Juca Bala');
      expect(response.body).toHaveProperty('email', 'testuser@example.com');
      expect(response.body).not.toHaveProperty('senha');

      usuarioId = response.body.id;
    });

    it('rota put /usuarios', async () => {
      const response = await request(server)
        .put(`/usuarios/${usuarioId}`)
        .send({
          nome: 'Novo Nome',
          email: 'novoemail@example.com',
          senha: 'novasenha123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('nome', 'Novo Nome');
      expect(response.body).toHaveProperty('email', 'novoemail@example.com');
      expect(response.body).not.toHaveProperty('senha');
    });
  })
});




