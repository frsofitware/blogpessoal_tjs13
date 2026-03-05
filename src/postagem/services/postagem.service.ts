import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Postagem } from "../entities/postagem.entity";
import { DeleteResult, ILike, Repository } from "typeorm";

@Injectable()
export class PostagemService{

    constructor(
        @InjectRepository(Postagem)
        private postagemRepository : Repository <Postagem>,){}

    async findAll(): Promise<Postagem[]> {
        // SELECT * FROM tb_postagens
        return this.postagemRepository.find({
            relations: {
                tema: true
            }
        });
    }

    async findById(id:number): Promise<Postagem>{
        // SELECT * FROM tb_postagens WHERE id = ?
        const postagem = await this.postagemRepository.findOne({
            where: {
                id,
            },
            relations: {
                tema: true
            }
        })

        if(!postagem)
            throw new HttpException("Postagem não encontrada!", HttpStatus.NOT_FOUND);

        return postagem;
    }

    async findAllByTitulo(titulo: string): Promise<Postagem[]>{
        // SELECT * FROM tb_postagens WHERE titulo LIKE "%?%"
        return this.postagemRepository.find({
            where:{
                titulo: ILike(`%${titulo}%`)
            },
            relations: {
                tema: true
            }
        })
    }

    async create(postagem: Postagem): Promise<Postagem>{
        // INSEERT INTO tb_postagens (titulo, texto) VALUES
        return await this.postagemRepository.save(postagem);
    }

    async update(postagem: Postagem): Promise<Postagem>{
        // UPDATE tb_postagens SET titulo = ?,  texto = ?, data = CURRENT_TIMESTAMP();
        // WHERE id = ?;

        if(!postagem.id || postagem.id <= 0)
            throw new HttpException("O ID da postagem é inválido!", HttpStatus.BAD_REQUEST);

        await this.findById(postagem.id);
        return this.postagemRepository.save(postagem);
    }

    async delete(id: number): Promise<DeleteResult>{
        await this.findById(id);

        // DELETE FROM tb_postagens FROM id = ?;
        return this.postagemRepository.delete(id)     
    }
}