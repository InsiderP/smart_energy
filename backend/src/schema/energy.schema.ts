import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Device extends Document {
  @Prop({ required: true })
  deviceId: string;

  @Prop({ required: true })
  deviceName: string;

  @Prop({ required: true })
  deviceType: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Object })
  specifications: Record<string, any>;

  @Prop({ default: false })
  isConnected: boolean;

  @Prop({ default: 0 })
  energyConsumptionWatts: number;
}

@Schema()
export class EnergyData extends Document {
  @Prop({ required: true })
  deviceId: string;

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: true })
  
 energyConsumption: number;

  @Prop()
  isConnected?: boolean;

  @Prop({ type: Object })
  deviceConsumption?: Record<string, number>;

  @Prop()
  hvac?: number;

  @Prop()
  lighting?: number;

  @Prop()
  appliances?: number;

  @Prop()
  waterHeating?: number;

  @Prop()
  other?: number;

  @Prop({ type: Object })
  metadata?: {
    temperature: number;
    humidity: number;
  };
}

@Schema()
export class EnergyBudget extends Document {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
export const EnergyDataSchema = SchemaFactory.createForClass(EnergyData);
export const EnergyBudgetSchema = SchemaFactory.createForClass(EnergyBudget); 