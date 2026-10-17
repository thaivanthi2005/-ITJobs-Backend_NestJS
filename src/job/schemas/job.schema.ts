import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type JobDocument = HydratedDocument<Job>;

@Schema({ timestamps: true, collection: 'jobs' })
export class Job {
  @Prop()
  companyId: string;

  @Prop()
  title: string;

  @Prop()
  salaryMin: number;

  @Prop()
  salaryMax: number;

  @Prop()
  position: string;

  @Prop()
  workingForm: string;

  @Prop([String])
  technologies: string[];

  @Prop()
  description: string;

  @Prop([String])
  images: string[];
}

export const JobSchema = SchemaFactory.createForClass(Job);
