import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('usuarios')
export class Usuario extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public nome: string;

  @Column({ unique: true })
  public email: string;

  @Column({ select: false })
  public senha: string;
}
