import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Track, TrackDocument } from '../schemas/track.schema';
import { Model } from 'mongoose';
import { Album, AlbumDocument } from '../schemas/album.schema';
import { RolesGuard } from '../roles/roles.guard';
import { TokenAuthGuard } from '../token-auth/token-auth.guard';

@Controller('tracks')
export class TracksController {
  constructor(
    @InjectModel(Track.name)
    private trackModel: Model<TrackDocument>,
    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
  ) {}
  @Get()
  getTracks(@Query('album') idAlbum: string) {
    if (idAlbum) {
      return this.trackModel.find({ album: idAlbum }).sort({ trackNumber: 1 });
    } else {
      return this.trackModel.find();
    }
  }
  @UseGuards(TokenAuthGuard)
  @Post()
  async create(@Body() trackDto: TrackDocument) {
    const album = await this.albumModel.findById(trackDto.album);
    if (!album) throw new NotFoundException('Album not found');
    const newTrack = new this.trackModel({
      album: trackDto.album,
      title: trackDto.title,
      duration: trackDto.duration,
      trackNumber: trackDto.trackNumber,
    });
    return await newTrack.save();
  }
  @UseGuards(RolesGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const track = await this.trackModel.findByIdAndDelete(id);
    if (!track) throw new NotFoundException('Track not found');
    return { message: 'Track deleted successfully', track };
  }
}
