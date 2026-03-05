import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty, Length } from "class-validator";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Tema } from "../../tema/entities/tema.entity";

@Entity({name: "tb_postagens"}) // CREATE TABLE tb_postagens
export class Postagem {
    
    @PrimaryGeneratedColumn() // PRIMARY KEY (id) AUTO_INCREMENT
    id: number;
     
    @Transform(({ value }: TransformFnParams) => value?.trim()) // RETIRA O ESPAÇO EM BRACO DO COMEÇO E DO FINAL
    @IsNotEmpty({message: "O Título é Obrigatório"}) // FORÇA DIGITAÇÃO, NÃO ACEITA O CAMPO EM BRANCO
    @Length(5, 100, {message: "O Títiulo deve ter entre 10 e 100 caracteres"})
    @Column({length: 100, nullable: false}) // VARCHAR(100) NOT NULL
    titulo: string;

    @Transform(({ value }: TransformFnParams) => value?.trim()) // RETIRA O ESPAÇO EM BRACO DO COMEÇO E DO FINAL
    @IsNotEmpty({message: "O texto é obrigatório"}) // FORÇA DIGITAÇÃO, NÃO ACEITA O CAMPO EM BRANCO
    @Length(10, 1000, {message: "O texto deve ter entre 10 e 1000 caracteres"})
    @Column({length: 1000, nullable: false}) // VARCHAR(1000) NOT NULL
    texto: string;

    @UpdateDateColumn() // ATUALIZA A DATA NA CRIAÇÃO E NA ATUALIZAÇÃO
    data: Date; 

    @ManyToOne(() => Tema, (tema) => tema.postagem, {
        onDelete: "CASCADE" // APAGOU O TEMA, APAGA AS POSTAGENS RELACIONADAS
    })
    tema: Tema; // REPRESENTA A CHAVE ESTRANGEIRA
}