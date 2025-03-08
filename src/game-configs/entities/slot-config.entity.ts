import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SlotGameType } from 'src/common/enum/game.enum';

export type SlotConfigDocument = SlotConfig & Document;

@Schema({ timestamps: true })
export class SlotConfig {
  @Prop({ required: true })
  name: string; // "Egyptian Dreams"

  @Prop({ required: true })
  theme: string; // "Egyptian", "Pirate"

  @Prop({ required: true, enum: Object.values(SlotGameType) })
  type: SlotGameType;

  @Prop({ type: Number, required: true })
  reels: number;

  @Prop({ type: Number, required: true })
  rows: number;

  @Prop({ type: Number, required: true })
  paylines: number;

  @Prop({ type: Object, default: {} })
  symbols: Record<string, { payout: number; special?: boolean }>;

  @Prop({ type: Object, default: {} })
  wilds: Record<string, { type: string; multiplier?: number; effect?: string }>;

  @Prop({ type: Object, default: {} })
  scatters: Record<string, { freeSpins: number; bonusTrigger?: boolean }>;

  @Prop({ type: Object, default: {} })
  bonusFeatures: Record<string, { description: string }>;

  @Prop({ type: Object, default: {} })
  jackpot: {
    type: string; // 'fixed' or 'progressive'
    minBetRequired: number;
    payout: number;
  };

  @Prop({ type: Object, default: {} })
  config: Record<string, any>;

  @Prop({ type: Object, default: {} })
  betConfig: {
    minBet: number;
    maxBet: number;
    betIncrements: number[];
  };

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Boolean, default: false })
  isLive: boolean;

  @Prop({ type: Object, default: {} })
  colyseusSettings: {
    roomName: string;
    maxPlayers: number;
    sessionDuration: number;
  };
}

export const SlotConfigSchema = SchemaFactory.createForClass(SlotConfig);
