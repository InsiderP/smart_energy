import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { 
  EnergyData, 
  EnergyDataSchema, 
  Device, 
  DeviceSchema,
  EnergyBudget,
  EnergyBudgetSchema 
} from './schema/energy.schema';
import { EnergyService } from './services/energy.service';
import { EnergyGateway } from './gateways/energy.gateway';
import { ScheduleModule } from '@nestjs/schedule';
import { DeviceMonitoringService } from './services/device-monitoring.service';
import { EnergyController } from './controllers/energy.controller';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://pragatisinghbhumca21:pragati@cluster0.i8v6e.mongodb.net/iotsmart'),
    MongooseModule.forFeature([
      { name: EnergyData.name, schema: EnergyDataSchema },
      { name: Device.name, schema: DeviceSchema },
      { name: EnergyBudget.name, schema: EnergyBudgetSchema },
    ]),
    ScheduleModule.forRoot(),
  ],
  controllers: [EnergyController],
  providers: [EnergyService, EnergyGateway, DeviceMonitoringService],
})
export class AppModule {}