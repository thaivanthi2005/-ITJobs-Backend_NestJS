import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CityDocument = HydratedDocument<City>;

@Schema({ collection: 'cities' })
export class City {
  @Prop()
  name: string;
}

export const CitySchema = SchemaFactory.createForClass(City);
