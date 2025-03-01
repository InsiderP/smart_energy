import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EnergyData, Device, EnergyBudget } from '../schema/energy.schema';
import { startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class EnergyService {
  constructor(
    @InjectModel(EnergyData.name) private energyModel: Model<EnergyData>,
    @InjectModel(Device.name) private deviceModel: Model<Device>,
    @InjectModel(EnergyBudget.name) private budgetModel: Model<EnergyBudget>,
  ) {}

  // Get dashboard data with proper aggregation
  async getDashboardData() {
    try {
      // Get latest energy readings for all devices
      const latestEnergy = await this.energyModel
        .find()
        .sort({ timestamp: -1 })
        .limit(1)
        .exec();

      // Get all active devices with their current status
      const devices = await this.deviceModel
        .find({ isActive: true })
        .select('deviceId deviceName deviceType isConnected specifications')
        .exec();

      // Get hourly consumption for today
      const today = new Date();
      const startOfToday = startOfDay(today);
      const endOfToday = endOfDay(today);

      const hourlyConsumption = await this.energyModel.aggregate([
        {
          $match: {
            timestamp: {
              $gte: startOfToday,
              $lte: endOfToday
            }
          }
        },
        {
          $group: {
            _id: { $hour: "$timestamp" },
            consumption: { $sum: "$energyConsumption" }
          }
        },
        {
          $project: {
            _id: 0,
            hour: "$_id",
            consumption: 1
          }
        },
        { $sort: { hour: 1 } }
      ]);

      // Get device type statistics
      const deviceStats = await this.deviceModel.aggregate([
        {
          $group: {
            _id: "$deviceType",
            count: { $sum: 1 },
            totalConsumption: { $sum: "$energyConsumptionWatts" },
            connectedDevices: {
              $sum: { $cond: [{ $eq: ["$isConnected", true] }, 1, 0] }
            }
          }
        }
      ]);

      // Get current budget
      const currentBudget = await this.getCurrentBudget();

      return {
        currentEnergy: latestEnergy[0],
        devices,
        hourlyConsumption,
        stats: {
          totalDevices: devices.length,
          connectedDevices: devices.filter(d => d.isConnected).length,
          deviceTypeStats: deviceStats,
          totalConsumption: deviceStats.reduce((acc, curr) => acc + curr.totalConsumption, 0)
        },
        budget: currentBudget
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }

  // Get historical consumption data
  async getHistoricalConsumption(startDate: Date, endDate: Date) {
    return this.energyModel.aggregate([
      {
        $match: {
          timestamp: {
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
            hour: { $hour: "$timestamp" }
          },
          consumption: { $sum: "$energyConsumption" },
          deviceConsumption: { $first: "$deviceConsumption" }
        }
      },
      {
        $sort: { "_id.date": 1, "_id.hour": 1 }
      }
    ]);
  }

  // Get device-specific consumption
  async getDeviceConsumption(deviceId: string) {
    return this.energyModel.find({ deviceId })
      .sort({ timestamp: -1 })
      .limit(24)
      .exec();
  }

  // Get current budget
  private async getCurrentBudget() {
    const now = new Date();
    return this.budgetModel.findOne({
      startDate: { $lte: now },
      endDate: { $gte: now }
    }).exec();
  }
}