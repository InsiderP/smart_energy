export interface EnergyData {
  timestamp: Date;
  deviceId: string;
  consumption: number;
  hvac?: number;
  lighting?: number;
  appliances?: number;
  waterHeating?: number;
  other?: number;
  deviceConsumption?: Record<string, number>;
  metadata?: {
    temperature: number;
    humidity: number;
  };
}

export interface DeviceData {
  deviceId: string;
  deviceName: string;
  deviceType: string;
  consumption: number;
  lastReading: Date;
  isConnected: boolean;
}

export interface Device {
  deviceId: string;
  deviceName: string;
  deviceType: string;
  isActive: boolean;
}

export interface EnergyBudget {
  userId: string;
  dailyBudget: number;
  monthlyBudget: number;
  alertEnabled: boolean;
  alertMethods: string[];
} 
// export interface EnergyData {
//   deviceId: string;
//   timestamp: Date;
//   energyConsumption: number;
//   deviceConsumption: Record<string, number>;
//   isConnected: boolean;
// }

export interface DeviceData {
  deviceId: string;
  deviceName: string;
  deviceType: string;
  isConnected: boolean;
  specifications: Record<string, any>;
}