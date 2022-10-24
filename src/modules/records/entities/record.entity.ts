import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("records")
export class RecordEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  names: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  phoneNumber: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  nid: string;

  @Column({ type: "varchar", length: 10, nullable: true })
  gender: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  email: string;

  @Column({ type: "jsonb" })
  errors: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
