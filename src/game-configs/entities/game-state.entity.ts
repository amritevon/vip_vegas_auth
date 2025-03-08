import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GameStateDocument = GameState & Document;

@Schema({ timestamps: true })
export class GameState {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  playerId: Types.ObjectId; // Player Reference

  @Prop({ type: Types.ObjectId, required: true, ref: 'SlotGameConfig' })
  gameId: Types.ObjectId; // Game Reference

  @Prop({ type: Number, default: 0 })
  spinsPlayed: number; // Number of spins in the current session

  @Prop({ type: Number, default: 0 })
  totalBets: number; // Total amount bet in the session

  @Prop({ type: Number, default: 0 })
  totalWins: number; // Total winnings in the session

  @Prop({ type: [String], default: [] })
  currentReelState: string[]; // Symbols on the reels (e.g., ['Cherry', 'Wild', 'Seven'])

  @Prop({ type: [String], default: [] })
  activeBonuses: string[]; // Current active bonuses (e.g., ["Free Spins", "Multiplier"])

  @Prop({ type: Boolean, default: false })
  jackpotTriggered: boolean; // If the jackpot was triggered

  @Prop({
    type: String,
    enum: ['playing', 'paused', 'completed'],
    default: 'playing',
  })
  gameStatus: string; // Current state of the game

  @Prop({ type: Date, default: null })
  lastUpdated: Date; // Last updated time (for syncing)
}

export const GameStateSchema = SchemaFactory.createForClass(GameState);
