import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class Device {
  @Prop({ required: true })
  deviceId: string;

  @Prop({
    required: true,
    enum: ['mobile', 'tablet', 'desktop'],
    default: 'mobile',
  })
  deviceType: string;
}
