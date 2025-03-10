import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Model } from 'mongoose';
import { Role } from './role.entity';
import * as bcrypt from 'bcryptjs';
import { StatusEnum } from 'src/common/enum/status.enum';
import { Device } from './device.entity';
import { LoginTypeEnum } from 'src/common/enum/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, unique: true, sparse: true })
  email: string;

  // @Prop({ unique: true, required: true })
  // username: string;

  @Prop() // optional as only fb or guest login, can be used by devs to login
  password: string;

  @Prop({ type: String })
  firstName: string;

  @Prop({ type: String })
  lastName: string;

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

  @Prop({
    type: String,
    enum: LoginTypeEnum,
    required: true,
    default: LoginTypeEnum.GUEST,
  })
  provider: LoginTypeEnum;

  @Prop({ type: String, unique: true, sparse: true })
  providerId?: string;

  @Prop({ type: Number, default: 0 })
  maxTournamentParticipated: number;

  @Prop({ type: Number, default: 0 })
  highestTournamentEarnings: number;

  @Prop({ type: Number, default: 0 })
  bestTournamentRank: number;

  @Prop({
    type: Device,
    required: function () {
      return !!this.device;
    },
  })
  device?: Device;
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
