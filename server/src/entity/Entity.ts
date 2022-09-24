import { BaseEntity, CreateDateColumn, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';


export default abstract class Entity extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @CreateDateColumn()
    createdAt:DataTransfer;

    @UpdateDateColumn()
    updateAt:DataTransfer;
}