import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GameSessionDocument = GameSession & Document;

@Schema({ timestamps: true })
export class GameSession {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  playerId: Types.ObjectId; // Player reference

  @Prop({ type: Types.ObjectId, required: true, ref: 'SlotGameConfig' })
  gameId: Types.ObjectId; // Game reference

  @Prop({ required: true })
  gameName: string;

  @Prop({ type: Number, default: 0 })
  spinsPlayed: number;

  @Prop({ type: Number, default: 0 })
  totalBets: number;

  @Prop({ type: Number, default: 0 })
  totalWins: number;

  @Prop({ type: Boolean, default: false })
  isCompleted: boolean;

  @Prop({ type: Date, default: null })
  lastPlayedAt: Date;
}

export const GameSessionSchema = SchemaFactory.createForClass(GameSession);
