import { Controller, Get } from '@nestjs/common';
import { EnergyService } from '../services/energy.service';

@Controller('api/energy') // This sets the base route for this controller
export class EnergyController {
  constructor(private readonly energyService: EnergyService) {}

  @Get('dashboard') // This defines the route for /api/energy/dashboard
  async getDashboardData() {
    return this.energyService.getDashboardData();
  }
} 