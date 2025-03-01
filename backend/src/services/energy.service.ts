import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EnergyData } from 'src/schema/energy.schema';


@Injectable()
export class EnergyService {
  constructor(
    @InjectModel(EnergyData.name) private energyModel: Model<EnergyData>,
  ) {}

  async generateRealtimeData() {
    const i = Date.now();
    return {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      consumption: 5 + Math.sin(i * 0.0001) * 2,
      hvac: 3 + Math.cos(i * 0.0001) * 1.5,
      lighting: 2 + Math.sin(i * 0.00008),
      appliances: 3 + Math.cos(i * 0.00009) * 1,
      waterHeating: 1.5 + Math.sin(i * 0.00011) * 0.5,
      other: 0.5 + Math.cos(i * 0.00007) * 0.3,
    };
  }

  async getLatestData(limit: number = 20) {
    return this.energyModel
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async saveEnergyData(data: Partial<EnergyData>) {
    const newData = new this.energyModel(data);
    return newData.save();
  }
}