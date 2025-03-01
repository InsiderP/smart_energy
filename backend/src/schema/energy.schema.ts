import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class EnergyData extends Document {
  @Prop()
  time: string;

  @Prop()
  consumption: number;

  @Prop()
  hvac: number;

  @Prop()
  lighting: number;

  @Prop()
  appliances: number;

  @Prop()
  waterHeating: number;

  @Prop()
  other: number;
}

export const EnergyDataSchema = SchemaFactory.createForClass(EnergyData);