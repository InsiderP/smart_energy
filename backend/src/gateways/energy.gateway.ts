import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { EnergyService } from '../services/energy.service';
  import { startOfDay, endOfDay } from 'date-fns';
  
  @WebSocketGateway({
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
    },
  })
  export class EnergyGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    private connectedClients = 0;
  
    constructor(private readonly energyService: EnergyService) {}
  
    handleConnection(client: Socket) {
      this.connectedClients++;
      console.log(`Client connected: ${client.id}, Total clients: ${this.connectedClients}`);
      
      // Emit initial dashboard data to the newly connected client
      this.emitDashboardData(client);
    }
  
    handleDisconnect(client: Socket) {
      this.connectedClients--;
      console.log(`Client disconnected: ${client.id}, Total clients: ${this.connectedClients}`);
    }
  
    @SubscribeMessage('getDashboardData')
    async handleDashboardData(client: Socket) {
      await this.emitDashboardData(client);
    }
  
    private async emitDashboardData(client: Socket) {
      try {
        const dashboardData = await this.energyService.getDashboardData();
        client.emit('dashboardData', dashboardData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        client.emit('error', { message: 'Failed to fetch dashboard data' });
      }
    }
  
    @SubscribeMessage('getHistoricalData')
    async handleHistoricalData(client: Socket, date: string) {
      try {
        const parsedDate = new Date(date); // Ensure the date is parsed correctly
        const data = await this.energyService.getHistoricalConsumption(startOfDay(parsedDate), endOfDay(parsedDate));
        client.emit('historicalData', data);
      } catch (error) {
        console.error('Error fetching historical data:', error);
        client.emit('error', { message: 'Failed to fetch historical data' });
      }
    }
  
    // @SubscribeMessage('getDeviceData')
    // async handleDeviceData(client: Socket) {
    //   try {
    //     const deviceData = await this.energyService.getDeviceConsumption();
    //     client.emit('deviceData', deviceData);
    //   } catch (error) {
    //     console.error('Error fetching device data:', error);
    //     client.emit('error', { message: 'Failed to fetch device data' });
    //   }
    // }
  }