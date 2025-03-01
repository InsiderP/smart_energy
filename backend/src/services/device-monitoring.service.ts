import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Device } from '../schema/energy.schema';
import { EnergyData } from '../schema/energy.schema';

interface DeviceConfig {
  deviceId: string;
  deviceName: string;
  deviceType: string;
  isActive: boolean;
  specifications: Record<string, any>;
}

class DeviceGenerator {
  private getSmartBulbConfig(id: string, location: string): DeviceConfig {
    return {
      deviceId: `BULB${id}`,
      deviceName: `${location} Smart Bulb`,
      deviceType: 'smart-bulb',
      isActive: true,
      specifications: {
        maxWattage: 9,
        color: true,
        brightness: true,
        colorTemperature: '2700K-6500K',
        lumens: 800,
        lifespan: '25000h',
        wireless: 'WiFi/BLE'
      }
    };
  }

  private getSmartPlugConfig(id: string, location: string): DeviceConfig {
    return {
      deviceId: `PLUG${id}`,
      deviceName: `${location} Smart Plug`,
      deviceType: 'smart-plug',
      isActive: true,
      specifications: {
        maxLoad: '2000W',
        voltage: '220V',
        current: '10A',
        powerMetering: true,
        surge: true,
        wireless: 'WiFi'
      }
    };
  }

  private getCeilingFanConfig(id: string, location: string): DeviceConfig {
    return {
      deviceId: `FAN${id}`,
      deviceName: `${location} Ceiling Fan`,
      deviceType: 'ceiling-fan',
      isActive: true,
      specifications: {
        speeds: 5,
        hasBluetooth: true,
        remoteControl: true,
        reversible: true,
        bladeSize: '52inch',
        lightKit: true,
        wireless: 'WiFi/BLE'
      }
    };
  }

  private getAirPurifierConfig(id: string, location: string): DeviceConfig {
    return {
      deviceId: `PURIFIER${id}`,
      deviceName: `${location} Air Purifier`,
      deviceType: 'air-purifier',
      isActive: true,
      specifications: {
        coverage: '400sqft',
        filterType: 'HEPA',
        pm25Sensor: true,
        cadr: 300,
        noiseLevel: '25-52dB',
        modes: ['auto', 'sleep', 'turbo'],
        wireless: 'WiFi'
      }
    };
  }

  private getHumidifierConfig(id: string, location: string): DeviceConfig {
    return {
      deviceId: `HUMID${id}`,
      deviceName: `${location} Humidifier`,
      deviceType: 'humidifier',
      isActive: true,
      specifications: {
        capacity: '4L',
        autoMode: true,
        mist: 'ultrasonic',
        coverage: '400sqft',
        runtime: '40h',
        modes: ['auto', 'sleep', 'max'],
        wireless: 'WiFi'
      }
    };
  }

  private getCameraConfig(id: string, location: string): DeviceConfig {
    return {
      deviceId: `CAM${id}`,
      deviceName: `${location} Camera`,
      deviceType: 'camera',
      isActive: true,
      specifications: {
        resolution: '2K',
        nightVision: true,
        motionDetection: true,
        storage: '128GB',
        audio: 'two-way',
        fov: '130°',
        wireless: 'WiFi'
      }
    };
  }

  private getDoorLockConfig(id: string, location: string): DeviceConfig {
    return {
      deviceId: `LOCK${id}`,
      deviceName: `${location} Door Lock`,
      deviceType: 'door-lock',
      isActive: true,
      specifications: {
        fingerprint: true,
        pinCode: true,
        nfcCard: true,
        mechanicalKey: true,
        battery: 'AA x 4',
        autoLock: true,
        wireless: 'BLE'
      }
    };
  }

  private getSensorConfig(id: string, location: string, type: string): DeviceConfig {
    return {
      deviceId: `SENSOR${id}`,
      deviceName: `${location} ${type} Sensor`,
      deviceType: 'sensor',
      isActive: true,
      specifications: {
        type: type,
        batteryPowered: true,
        batteryLife: '2 years',
        wireless: 'Zigbee',
        sensitivity: 'adjustable',
        tamperProof: true
      }
    };
  }

  private getVacuumConfig(id: string): DeviceConfig {
    return {
      deviceId: `VAC${id}`,
      deviceName: 'Robot Vacuum',
      deviceType: 'vacuum',
      isActive: true,
      specifications: {
        mapping: true,
        batteryCapacity: '5200mAh',
        suction: '2500Pa',
        runtime: '150min',
        binCapacity: '400ml',
        hepaFilter: true,
        wireless: 'WiFi'
      }
    };
  }

  private getWashingMachineConfig(id: string): DeviceConfig {
    return {
      deviceId: `WASH${id}`,
      deviceName: 'Smart Washing Machine',
      deviceType: 'washing-machine',
      isActive: true,
      specifications: {
        capacity: '8kg',
        programs: 12,
        energyRating: 'A+++',
        wifiEnabled: true,
        spinSpeed: '1400rpm',
        steamFunction: true,
        wireless: 'WiFi'
      }
    };
  }

  private getRefrigeratorConfig(id: string): DeviceConfig {
    return {
      deviceId: `FRIDGE${id}`,
      deviceName: 'Smart Refrigerator',
      deviceType: 'refrigerator',
      isActive: true,
      specifications: {
        capacity: '500L',
        hasFreezer: true,
        inverterCompressor: true,
        temperatureSensors: true,
        doorAlarm: true,
        icemaker: true,
        wireless: 'WiFi'
      }
    };
  }

  public generateDevice(type: string, id: string, location: string = ''): DeviceConfig {
    switch (type.toLowerCase()) {
      case 'smart-bulb':
        return this.getSmartBulbConfig(id, location);
      case 'smart-plug':
        return this.getSmartPlugConfig(id, location);
      case 'ceiling-fan':
        return this.getCeilingFanConfig(id, location);
      case 'air-purifier':
        return this.getAirPurifierConfig(id, location);
      case 'humidifier':
        return this.getHumidifierConfig(id, location);
      case 'camera':
        return this.getCameraConfig(id, location);
      case 'door-lock':
        return this.getDoorLockConfig(id, location);
      case 'sensor':
        return this.getSensorConfig(id, location, 'motion');
      case 'vacuum':
        return this.getVacuumConfig(id);
      case 'washing-machine':
        return this.getWashingMachineConfig(id);
      case 'refrigerator':
        return this.getRefrigeratorConfig(id);
      default:
        throw new Error(`Unknown device type: ${type}`);
    }
  }
}

@Injectable()
export class DeviceMonitoringService implements OnModuleInit {
  constructor(
    @InjectModel(Device.name) private deviceModel: Model<Device>,
    @InjectModel(EnergyData.name) private energyDataModel: Model<EnergyData>,
  ) {}

  async onModuleInit() {
    // console.log('Device Monitoring Service initialized');
    // First seed some devices if none exist
    await this.seedDevices();
    // Then start collecting data
    await this.collectDeviceData();
  }

  private async seedDevices() {
    const existingDevices = await this.deviceModel.countDocuments();
    if (existingDevices === 0) {
    //   console.log('No devices found. Seeding initial devices...');
      
      const deviceGenerator = new DeviceGenerator();
      const initialDevices = [
        // Smart Home Devices
        deviceGenerator.generateDevice('smart-bulb', '001', 'Living Room'),
        deviceGenerator.generateDevice('smart-bulb', '002', 'Bedroom'),
        deviceGenerator.generateDevice('smart-plug', '001', 'Kitchen'),
        deviceGenerator.generateDevice('ceiling-fan', '001', 'Master Bedroom'),
        deviceGenerator.generateDevice('air-purifier', '001', 'Living Room'),
        deviceGenerator.generateDevice('humidifier', '001', 'Bedroom'),

        // Security Devices
        deviceGenerator.generateDevice('camera', '001', 'Front Door'),
        deviceGenerator.generateDevice('camera', '002', 'Backyard'),
        deviceGenerator.generateDevice('door-lock', '001', 'Front Door'),
        deviceGenerator.generateDevice('sensor', '001', 'Living Room Window'),

        // Appliances
        deviceGenerator.generateDevice('vacuum', '001'),
        deviceGenerator.generateDevice('washing-machine', '001'),
        deviceGenerator.generateDevice('refrigerator', '001'),
        deviceGenerator.generateDevice('smart-plug', '002', 'Living Room'),
        deviceGenerator.generateDevice('smart-plug', '003', 'Bedroom')
      ];

      try {
        await this.deviceModel.insertMany(initialDevices);
        // console.log(`Successfully seeded ${initialDevices.length} initial devices`);
      } catch (error) {
        console.error('Error seeding devices:', error);
      }
    } else {
      console.log(`Found ${existingDevices} existing devices, skipping seed`);
    }
  }

  @Cron('*/30 * * * * *') // Runs every 30 seconds
  async collectDeviceData() {
    const timestamp = new Date().toISOString();
    // console.log(`[${timestamp}] Collecting device data...`);
    
    try {
      const devices = await this.deviceModel.find({ isActive: true });
    //   console.log(`Found ${devices.length} active devices`);

      for (const device of devices) {
        const mockSensorData = this.generateMockData(device.deviceType);
        const energyConsumption = this.calculateEnergyConsumption(device.deviceType);
        
        const energyData = new this.energyDataModel({
          deviceId: device.deviceId,
          timestamp: new Date(),
          energyConsumption,
          sensorData: mockSensorData,
          isConnected: Math.random() > 0.1,
        });

        await energyData.save();
        // console.log(`Data collected for device: ${device.deviceId}, consumption: ${energyConsumption}W`);
      }
    } catch (error) {
      console.error('Error collecting device data:', error);
    }
  }

  private calculateEnergyConsumption(deviceType: string): number {
    // Mock energy consumption based on device type
    const baseConsumption = {
      'smart-bulb': 7,
      'smart-plug': 2,
      'ceiling-fan': 75,
      'air-purifier': 40,
      'humidifier': 25,
      'camera': 15,
      'door-lock': 4,
      'sensor': 1,
      'vacuum': 50,
      'washing-machine': 500,
      'refrigerator': 150,
    };

    const consumption = baseConsumption[deviceType] || 10;
    // Add some random variation
    return consumption * (0.8 + Math.random() * 0.4);
  }

  private generateMockData(deviceType: string): Record<string, any> {
    const mockData: Record<string, any> = {};
    const timestamp = new Date();

    switch (deviceType.toLowerCase()) {
      case 'smart-bulb':
        mockData.brightness = Math.floor(Math.random() * 100);
        mockData.color = '#' + Math.floor(Math.random()*16777215).toString(16);
        mockData.colorTemperature = 2700 + Math.floor(Math.random() * 3800); // 2700K-6500K
        mockData.powerState = Math.random() > 0.2;
        mockData.lumens = Math.floor(600 + Math.random() * 400); // 600-1000 lumens
        break;

      case 'smart-plug':
        mockData.powerState = Math.random() > 0.3;
        mockData.voltage = 220 + (Math.random() * 10 - 5); // 215-225V
        mockData.current = Math.random() * 10; // 0-10A
        mockData.powerFactor = 0.85 + (Math.random() * 0.15); // 0.85-1.00
        mockData.frequency = 49.5 + Math.random(); // 49.5-50.5Hz
        break;

      case 'ceiling-fan':
        mockData.speed = Math.floor(Math.random() * 5) + 1; // 1-5
        mockData.direction = Math.random() > 0.5 ? 'forward' : 'reverse';
        mockData.temperature = 20 + Math.random() * 10; // 20-30°C
        mockData.humidity = 30 + Math.random() * 40; // 30-70%
        mockData.oscillation = Math.random() > 0.5;
        mockData.lightState = Math.random() > 0.3;
        break;

      case 'air-purifier':
        mockData.mode = ['auto', 'sleep', 'turbo'][Math.floor(Math.random() * 3)];
        mockData.temperature = 20 + Math.random() * 10; // 20-30°C
        mockData.humidity = 30 + Math.random() * 40; // 30-70%
        mockData.pm25 = Math.floor(Math.random() * 500); // 0-500 μg/m³
        mockData.filterLife = Math.floor(Math.random() * 100); // 0-100%
        mockData.fanSpeed = Math.floor(Math.random() * 100); // 0-100%
        mockData.airQuality = ['good', 'moderate', 'poor'][Math.floor(Math.random() * 3)];
        break;

      case 'humidifier':
        mockData.waterLevel = Math.floor(Math.random() * 100); // 0-100%
        mockData.targetHumidity = 45 + Math.floor(Math.random() * 30); // 45-75%
        mockData.currentHumidity = 30 + Math.random() * 40; // 30-70%
        mockData.mode = ['auto', 'sleep', 'manual'][Math.floor(Math.random() * 3)];
        mockData.mistLevel = Math.floor(Math.random() * 3) + 1; // 1-3
        mockData.filterStatus = Math.floor(Math.random() * 100); // 0-100%
        break;

      case 'camera':
        mockData.recordingStatus = Math.random() > 0.7;
        mockData.motionDetected = Math.random() > 0.8;
        mockData.batteryLevel = Math.floor(Math.random() * 100); // 0-100%
        mockData.storageRemaining = Math.floor(Math.random() * 100); // 0-100%
        mockData.resolution = ['720p', '1080p', '2K', '4K'][Math.floor(Math.random() * 4)];
        mockData.nightMode = Math.random() > 0.5;
        mockData.soundLevel = Math.floor(Math.random() * 100); // 0-100 dB
        break;

      case 'door-lock':
        mockData.lockState = Math.random() > 0.2;
        mockData.batteryLevel = Math.floor(Math.random() * 100); // 0-100%
        mockData.lastAccess = new Date(timestamp.getTime() - Math.random() * 86400000);
        mockData.tamperAlert = Math.random() > 0.95;
        mockData.wrongAttempts = Math.floor(Math.random() * 5);
        mockData.doorState = Math.random() > 0.3 ? 'closed' : 'open';
        break;

      case 'sensor':
        mockData.temperature = 20 + Math.random() * 10; // 20-30°C
        mockData.humidity = 30 + Math.random() * 40; // 30-70%
        mockData.batteryLevel = Math.floor(Math.random() * 100); // 0-100%
        mockData.lastTriggered = new Date(timestamp.getTime() - Math.random() * 3600000);
        mockData.signalStrength = Math.floor(Math.random() * 5); // 0-4 bars
        mockData.state = Math.random() > 0.8 ? 'triggered' : 'normal';
        break;

      case 'vacuum':
        mockData.status = ['cleaning', 'charging', 'returning', 'idle'][Math.floor(Math.random() * 4)];
        mockData.batteryLevel = Math.floor(Math.random() * 100); // 0-100%
        mockData.binFull = Math.random() > 0.7;
        mockData.cleaningArea = Math.floor(Math.random() * 100); // 0-100 m²
        mockData.cleaningTime = Math.floor(Math.random() * 120); // 0-120 minutes
        mockData.errorStatus = Math.random() > 0.95 ? ['stuck', 'wheel_error', 'brush_error'][Math.floor(Math.random() * 3)] : 'normal';
        mockData.fanSpeed = ['eco', 'normal', 'turbo'][Math.floor(Math.random() * 3)];
        break;

      case 'washing-machine':
        mockData.status = ['standby', 'washing', 'spinning', 'drying', 'complete'][Math.floor(Math.random() * 5)];
        mockData.program = ['cotton', 'synthetic', 'wool', 'quick'][Math.floor(Math.random() * 4)];
        mockData.temperature = [20, 30, 40, 60, 90][Math.floor(Math.random() * 5)];
        mockData.spinSpeed = [400, 800, 1000, 1200, 1400][Math.floor(Math.random() * 5)];
        mockData.remainingTime = Math.floor(Math.random() * 120); // 0-120 minutes
        mockData.doorLocked = Math.random() > 0.2;
        mockData.waterLevel = Math.floor(Math.random() * 100); // 0-100%
        break;

      case 'refrigerator':
        mockData.fridgeTemp = 2 + Math.random() * 4; // 2-6°C
        mockData.freezerTemp = -18 + Math.random() * 4; // -18 to -14°C
        mockData.doorOpenCount = Math.floor(Math.random() * 10);
        mockData.humidity = 30 + Math.random() * 20; // 30-50%
        mockData.filterStatus = Math.floor(Math.random() * 100); // 0-100%
        mockData.doorOpen = Math.random() > 0.9;
        mockData.compressorStatus = Math.random() > 0.7;
        mockData.defrostCycle = Math.random() > 0.9;
        break;

      default:
        mockData.powerState = Math.random() > 0.2;
        mockData.lastReading = timestamp;
    }

    // Common metrics for all devices
    mockData.timestamp = timestamp;
    mockData.signalStrength = Math.floor(Math.random() * 5); // 0-4 bars
    mockData.lastUpdate = timestamp;
    mockData.operatingMode = Math.random() > 0.1 ? 'normal' : 'error';
    mockData.networkLatency = Math.floor(Math.random() * 100); // 0-100ms

    return mockData;
  }
} 