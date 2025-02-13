import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Model } from 'mongoose';
import { AlbumDocument } from '../schemas/album.schema';
import { TrackDocument } from '../schemas/track.schema';
import { ArtistDocument } from '../schemas/artist.schema';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const artistModel = app.get<Model<ArtistDocument>>('ArtistModel');
  const albumModel = app.get<Model<AlbumDocument>>('AlbumModel');
  const trackModel = app.get<Model<TrackDocument>>('TrackModel');
  await trackModel.deleteMany({});
  await albumModel.deleteMany({});
  await artistModel.deleteMany({});
  const coldplay = await artistModel.create({
    name: 'Coldplay',
    information: 'Coldplay music group from England',
  });
  const kiss = await artistModel.create({
    name: 'Kiss',
    information: 'Kiss music group from USA',
  });
  const coldplayAlbum = await albumModel.create({
    artist: coldplay._id,
    title: 'Parachutes',
    year: 2000,
  });
  const kissAlbum = await albumModel.create({
    artist: kiss._id,
    title: 'Destroyer',
    year: 1976,
  });
  await trackModel.insertMany([
    {
      album: coldplayAlbum._id,
      title: 'Yellow',
      duration: '4:29',
      trackNumber: '1',
    },
    {
      album: coldplayAlbum._id,
      title: 'Shiver',
      duration: '5:04',
      trackNumber: '2',
    },
    {
      album: coldplayAlbum._id,
      title: 'Trouble',
      duration: '4:30',
      trackNumber: '3',
    },
    {
      album: coldplayAlbum._id,
      title: 'Sparks',
      duration: '3:47',
      trackNumber: '4',
    },
    {
      album: coldplayAlbum._id,
      title: 'Don’t Panic',
      duration: '2:17',
      trackNumber: '5',
    },

    {
      album: kissAlbum._id,
      title: 'Detroit Rock City',
      duration: '5:17',
      trackNumber: '1',
    },
    {
      album: kissAlbum._id,
      title: 'Shout It Out Loud',
      duration: '2:49',
      trackNumber: '2',
    },
    { album: kissAlbum._id, title: 'Beth', duration: '2:45', trackNumber: '3' },
    {
      album: kissAlbum._id,
      title: 'Do You Love Me',
      duration: '3:33',
      trackNumber: '4',
    },
    {
      album: kissAlbum._id,
      title: 'God of Thunder',
      duration: '4:13',
      trackNumber: '5',
    },
  ]);

  console.log('Seed successfully!');
  await app.close();
}
seed();
