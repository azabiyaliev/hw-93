import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type TrackDocument = Track & Document;
@Schema()
export class Track {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Album' })
  album: string;
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  duration: string;
  @Prop({ required: true })
  trackNumber: string;
}
export const TrackSchema = SchemaFactory.createForClass(Track);
