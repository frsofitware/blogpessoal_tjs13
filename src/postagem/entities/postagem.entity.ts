import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty, Length } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: "tb_postagens"}) // CREATE TABLE tb_postagens
export class Postagem{
    
    @PrimaryGeneratedColumn() // PRIMARY KEY (id) AUTO_INCREMENT
    id: number;
     
    @Transform(({ value }: TransformFnParams) => value?.trim()) // RETIRA O ESPAÇO EM BRACO DO COMEÇO E DO FINAL
    @IsNotEmpty() // FORÇA DIGITAÇÃO, NÃO ACEITA O CAMPO EM BRANCO
    @Column({length: 100, nullable: false}) // VARCHAR(100) NOT NULL
    titulo: string;

    @Transform(({ value }: TransformFnParams) => value?.trim()) // RETIRA O ESPAÇO EM BRACO DO COMEÇO E DO FINAL
    @IsNotEmpty({message: "O texto é obrigatório"}) // FORÇA DIGITAÇÃO, NÃO ACEITA O CAMPO EM BRANCO
    @Length(10, 1000, {message: "O texto deve ter entre 10 e 1000 caracteres"})
    @Column({length: 1000, nullable: false}) // VARCHAR(1000) NOT NULL
    texto: string;

    @UpdateDateColumn()
    data: Date;

}