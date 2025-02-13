import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Album, AlbumDocument } from '../schemas/album.schema';
import { Model } from 'mongoose';
import { Artist, ArtistDocument } from '../schemas/artist.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('albums')
export class AlbumsController {
  constructor(
    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
    @InjectModel(Artist.name)
    private artistModel: Model<ArtistDocument>,
  ) {}
  @Get()
  getAlbums(@Query('artist') idArtist: string) {
    if (idArtist) {
      return this.albumModel.find({ artist: idArtist });
    } else {
      return this.albumModel.find();
    }
  }
  @Get(':id')
  async getOne(@Param('id') id: string) {
    const album = await this.albumModel.findOne({ _id: id });
    if (!album) throw new NotFoundException('Album not found');
    return album;
  }
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/uploads/albums',
        filename: (_req, file, callback) => {
          callback(null, crypto.randomUUID() + extname(file.originalname));
        },
      }),
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() albumDto: AlbumDocument,
  ) {
    const artist = await this.artistModel.findById(albumDto.artist);
    if (!artist) throw new NotFoundException('Artist not found');
    const newAlbum = new this.albumModel({
      artist: albumDto.artist,
      title: albumDto.title,
      year: albumDto.year,
      image: file && file.filename ? '/uploads/albums/' + file.filename : null,
    });
    return await newAlbum.save();
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const album = await this.albumModel.findByIdAndDelete(id);
    if (!album) throw new NotFoundException('Album not found');
    return { message: 'Album successfully deleted', album };
  }
}
