import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { EnergyService } from '../services/energy.service';
  
  @WebSocketGateway({
    cors: {
      origin: '*',
    },
  })
  export class EnergyGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    private interval: NodeJS.Timeout;
  
    constructor(private readonly energyService: EnergyService) {}
  
    handleConnection(client: Socket) {
      console.log(`Client connected: ${client.id}`);
      this.startEmitting();
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
      if (this.server.engine.clientsCount === 0) {
        clearInterval(this.interval);
      }
    }
  
    private startEmitting() {
      if (!this.interval) {
        this.interval = setInterval(async () => {
          const data = await this.energyService.generateRealtimeData();
          await this.energyService.saveEnergyData(data);
          this.server.emit('energyData', data);
        }, 1000);
      }
    }
  }