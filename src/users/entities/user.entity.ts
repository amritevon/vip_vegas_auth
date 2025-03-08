import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Model } from 'mongoose';
import { Role } from './role.entity';
import * as bcrypt from 'bcryptjs';
import { StatusEnum } from 'src/common/enum/status.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  token: number;

  @Prop({ default: 1 })
  level: number;

  @Prop({
    required: true,
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Role' }],
  })
  roles: Role[];

  @Prop({
    type: String,
    enum: StatusEnum,
    required: true,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;

  @Prop({ type: String })
  provider?: string;

  @Prop({ type: String })
  providerId?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});
