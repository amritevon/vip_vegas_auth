import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { RoleEnum } from 'src/common/enum/role.enum';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true })
export class Role {
  @Prop({ type: String, enum: RoleEnum, required: true, unique: true })
  title: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
