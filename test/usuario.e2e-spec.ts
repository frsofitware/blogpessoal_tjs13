import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from '../src/app.module';


describe('Testes dos Módulos Usuario e Auth (e2e)', () => {
  
  let token: any;
  let usuarioId: any;
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [__dirname + "./../src/**/entities/*.entity.ts"],
          synchronize: true,
          dropSchema: true,
        }),
        AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  })

  it("01 - Deve cadastrar um novo usuário", async () => {
    const resposta = await request(app.getHttpServer())
      .post('/usuarios/cadastrar')
      .send({
        nome: "Root",
        usuario: "root@root.com.br",
        senha: "rootroot",
        foto: "-",
      })
      .expect(201);

    usuarioId = resposta.body.id;
  })

    it("02 - Não deve cadastrar um usuário já Existente", async () => {
    const resposta = await request(app.getHttpServer())
      .post('/usuarios/cadastrar')
      .send({
        nome: "Root",
        usuario: "root@root.com.br",
        senha: "rootroot",
        foto: "-",
      })
      expect(resposta.status).toBe(400)
  })

  it("03 - Deve Autenticar um usuário cadastrado", async ()=> {
    const resposta = await request(app.getHttpServer())
    .post('/usuarios/logar')
    .send({
      usuario: 'root@root.com.br',
      senha: 'rootroot',
    })
    expect(resposta.status).toBe(200)

    token = resposta.body.token;
  })

   it("04 - Deve Listar Todos os Usuários Cadastrados", async ()=> {
    const resposta = await request(app.getHttpServer())
    .get('/usuarios/all')
    .set('Authorization', `${token}`)
    expect(resposta.status).toBe(200)
  })

     it("05 - Deve Atualizar os dados de um Usuário já Existente", async ()=> {
    const resposta = await request(app.getHttpServer())
    .put('/usuarios/atualizar')
    .set('Authorization', `${token}`)
    .send({
      id: usuarioId,
      nome: 'Root Atualizado',
      usuario: 'root@root.com.br',
      senha: 'rootroot',
      foto: '-'
    })
    expect(resposta.status).toBe(200)
  })

  it("06 - Deve Buscar um Usuário pelo ID", async () => {
  const resposta = await request(app.getHttpServer())
  .get(`/usuarios/${usuarioId}`)
  .set("Authorization", `${token}`);
 
  expect(resposta.status).toBe(200);
  expect(resposta.body.id).toBe(usuarioId);
});
});
