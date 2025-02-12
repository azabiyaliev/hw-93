import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type AlbumDocument = Album & Document;

@Schema()
export class Album {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Artist' })
  artist: string;
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  year: number;
  @Prop({ default: null })
  image: string;
}
export const AlbumSchema = SchemaFactory.createForClass(Album);
