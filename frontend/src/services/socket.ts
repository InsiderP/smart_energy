import { io, Socket } from 'socket.io-client';
import { EnergyData, DeviceData } from '@/types/energy';

class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;

  private constructor() {
    this.socket = io('http://localhost:3001/energy', {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    this.socket.on('connect_error', (error) => {
      console.log('Connection error:', error.message);
    });
  }

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public onEnergyData(callback: (data: EnergyData) => void) {
    this.socket?.on('energyData', callback);
  }

  public getHistoricalData(date: Date) {
    this.socket?.emit('getHistoricalData', date);
  }

  public onHistoricalData(callback: (data: EnergyData[]) => void) {
    this.socket?.on('historicalData', callback);
  }

  public onDeviceData(callback: (data: DeviceData[]) => void) {
    this.socket?.on('deviceData', callback);
  }

  public disconnect() {
    this.socket?.disconnect();
  }
}

export const socketService = SocketService.getInstance(); 