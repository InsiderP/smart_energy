"use client"
import { useEffect, useState } from 'react';
import { Line, Bar, AreaChart, Area, LineChart, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { H1 } from '@/components/ui/typography';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Bell, Settings } from 'lucide-react';
import { socketService } from '@/services/socket';
import { EnergyData, DeviceData } from '@/types/energy';
import { format } from 'date-fns';

// Add new interfaces for structured data
interface DeviceConsumption {
  deviceId: string;
  deviceName: string;
  deviceType: string;
  consumption: number;
  lastReading: Date;
}

interface HourlyConsumption {
  hour: string;
  consumption: number;
  devices: Record<string, number>;
}

export default function Dashboard() {
  const [energyData, setEnergyData] = useState<EnergyData[]>([]);
  const [deviceData, setDeviceData] = useState<DeviceData[]>([]);
  const [hourlyData, setHourlyData] = useState<HourlyConsumption[]>([]);
  const [topDevices, setTopDevices] = useState<DeviceConsumption[]>([]);
  const [budget, setBudget] = useState<number>(100);
  const [alert, setAlert] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [totalConsumption, setTotalConsumption] = useState<number>(0);
  const [budgetInput, setBudgetInput] = useState<string>('100');
  const [currentEnergy, setCurrentEnergy] = useState<EnergyData | null>(null);
  const [devices, setDevices] = useState<DeviceData[]>([]);
  const [hourlyConsumption, setHourlyConsumption] = useState<HourlyConsumption[]>([]);
  const [stats, setStats] = useState<any>(null);

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    setIsClient(true);

    // Subscribe to real-time device data
    socketService.onDeviceData((devices) => {
      setDeviceData(devices);
      updateTopDevices(devices);
    });

    // Subscribe to real-time energy data
    socketService.onEnergyData((data) => {
      setEnergyData((prevData) => {
        const updatedData = [...prevData, data].slice(-20);
        updateConsumptionMetrics(updatedData);
        return updatedData;
      });
    });

    // Get historical data for today
    const today = new Date();
    socketService.getHistoricalData(today);
    socketService.onHistoricalData((historicalData) => {
      setEnergyData(historicalData.slice(-20));
      processHourlyData(historicalData);
    });
// Add this to your Dashboard component
const fetchDashboardData = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/energy/dashboard');
    const data = await response.json();
    console.log(data)
    setCurrentEnergy(data.currentEnergy);
    setDevices(data.devices);
    setHourlyConsumption(data.hourlyConsumption);
    setStats(data.stats);
    setBudget(data.budget?.amount || 100);
    
    // Process data for charts
    processChartData(data);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  }
};

const processChartData = (data: any) => {
  // Check if hourlyConsumption exists and is an array
  const hourlyData = Array.isArray(data.hourlyConsumption) ? data.hourlyConsumption.map((item: any) => ({
    hour: `${item.hour}:00`,
    consumption: item.consumption
  })) : []; // Default to an empty array if not available

  setHourlyData(hourlyData);

  // Process device type data for pie chart
  const deviceTypeData = data.stats.deviceTypeStats.map((stat: any) => ({
    name: stat._id,
    value: stat.totalConsumption
  }));
  setTopDevices(deviceTypeData);

  // Update total consumption
  setTotalConsumption(data.stats.totalConsumption);
};

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Update every 30 seconds

    return () => {
      socketService.disconnect();
      clearInterval(interval);
    };
  }, []);

  const processHourlyData = (data: EnergyData[]) => {
    const hourlyMap = new Map<string, HourlyConsumption>();
    
    data.forEach(reading => {
      const hour = format(new Date(reading.timestamp), 'HH:00');
      const existing = hourlyMap.get(hour) || {
        hour,
        consumption: 0,
        devices: {}
      };

      existing.consumption += reading.consumption;
      
      // Aggregate device-specific consumption
      Object.entries(reading.deviceConsumption || {}).forEach(([deviceId, consumption]) => {
        existing.devices[deviceId] = (existing.devices[deviceId] || 0) + consumption;
      });

      hourlyMap.set(hour, existing);
    });

    setHourlyData(Array.from(hourlyMap.values()));
  };

  const updateTopDevices = (devices: DeviceData[]) => {
    const sortedDevices = devices
      .sort((a, b) => b.consumption - a.consumption)
      .slice(0, 5);
    setTopDevices(sortedDevices);
  };

  const updateConsumptionMetrics = (data: EnergyData[]) => {
    const total = data.reduce((acc, val) => acc + val.consumption, 0);
    setTotalConsumption(total);
    
    if (total > budget) {
      setAlert('Energy usage exceeded budget!');
    }
  };

  const handleBudgetUpdate = () => {
    const newBudget = parseFloat(budgetInput);
    if (!isNaN(newBudget) && newBudget > 0) {
      setBudget(newBudget);
      setAlert(null);
    }
  };

  if (!isClient) {
    return null;
  }

  const formatChartData = (data: EnergyData) => ({
    time: format(new Date(data.timestamp), 'HH:mm'),
    ...data
  });

  return (
    <div className="container mx-auto p-4">
      <section className='w-full flex justify-between items-center mb-6'>
        <div>
          <H1 className='font-semibold text-2xl mb-2'>Energy Consumption Dashboard</H1>
          <div className="flex gap-2 items-center">
            <Badge variant="outline">Real-time</Badge>
            <Badge variant="secondary">
              Total: {totalConsumption.toFixed(2)} kWh
            </Badge>
            {energyData.length > 0 && energyData[energyData.length - 1].metadata && (
              <>
                <Badge variant="outline">
                  Temp: {energyData[energyData.length - 1].metadata?.temperature?.toFixed(1) ?? 'N/A'}°C
                </Badge>
                <Badge variant="outline">
                  Humidity: {energyData[energyData.length - 1].metadata?.humidity?.toFixed(1) ?? 'N/A'}%
                </Badge>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Input 
              type="number" 
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              placeholder="Set budget (kWh)"
              className="w-32"
            />
            <Button onClick={handleBudgetUpdate}>Set Budget</Button>
          </div>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {alert && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {alert}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Hourly Consumption Chart */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Hourly Energy Consumption</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="consumption" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Energy Consuming Devices */}
        <Card>
          <CardHeader>
            <CardTitle>Top Energy Consumers</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topDevices}
                  dataKey="consumption"
                  nameKey="deviceName"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {topDevices.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Type Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Device Type Consumption</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={energyData.map(formatChartData)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="smart-bulb" stackId="1" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="smart-plug" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                <Area type="monotone" dataKey="appliance" stackId="1" stroke="#ffc658" fill="#ffc658" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Real-time Consumption Trends */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Real-time Consumption Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={energyData.map(formatChartData)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="consumption" stroke="#8884d8" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Device Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deviceData.slice(0, 5).map(device => (
                <div key={device.deviceId} className="flex justify-between items-center">
                  <span>{device.deviceName}</span>
                  <Badge variant={device.isConnected ? "secondary" : "destructive"}>
                    {device.isConnected ? "Online" : "Offline"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}