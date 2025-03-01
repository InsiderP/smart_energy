import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnergyService } from './services/energy.service';
import { EnergyGateway } from './gateways/energy.gateway';
import { EnergyData, EnergyDataSchema } from './schema/energy.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/energy-monitoring'),
    MongooseModule.forFeature([
      { name: EnergyData.name, schema: EnergyDataSchema },
    ]),
  ],
  providers: [EnergyService, EnergyGateway],
})
export class AppModule {}