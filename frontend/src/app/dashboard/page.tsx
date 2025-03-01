"use client"
import { useEffect, useState } from 'react';
import { Line, Bar, AreaChart, Area, LineChart, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { H1 } from '@/components/ui/typography';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Bell, Settings } from 'lucide-react';

interface EnergyData {
  time: string;
  consumption: number;
  hvac: number;
  lighting: number;
  appliances: number;
  waterHeating: number;
  other: number;
}

export default function Dashboard() {
  const [energyData, setEnergyData] = useState<EnergyData[]>([]);
  const [budget, setBudget] = useState<number>(100);
  const [alert, setAlert] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [totalConsumption, setTotalConsumption] = useState<number>(0);
  const [budgetInput, setBudgetInput] = useState<string>('100');

  useEffect(() => {
    setIsClient(true);
    // Initialize with dummy data
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      time: `${Math.floor(i / 60)}:${i % 60}`,
      consumption: 5 + Math.sin(i * 0.5) * 2,
      hvac: 3 + Math.cos(i * 0.5) * 1.5,
      lighting: 2 + Math.sin(i * 0.3),
      appliances: 3 + Math.cos(i * 0.4) * 1,
      waterHeating: 1.5 + Math.sin(i * 0.6) * 0.5,
      other: 0.5 + Math.cos(i * 0.3) * 0.3,
    }));

    setEnergyData(initialData);

    // Simulate real-time data updates
    const interval = setInterval(() => {
      setEnergyData((prevData) => {
        const i = prevData.length;
        const newDataPoint = {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          consumption: 5 + Math.sin(i * 0.5) * 2,
          hvac: 3 + Math.cos(i * 0.5) * 1.5,
          lighting: 2 + Math.sin(i * 0.3),
          appliances: 3 + Math.cos(i * 0.4) * 1,
          waterHeating: 1.5 + Math.sin(i * 0.6) * 0.5,
          other: 0.5 + Math.cos(i * 0.3) * 0.3,
        };

        const updatedData = [...prevData, newDataPoint].slice(-20);
        const total = updatedData.reduce((acc, val) => acc + val.consumption, 0);
        setTotalConsumption(total);
        
        if (total > budget) {
          setAlert('Energy usage exceeded budget!');
        }
        return updatedData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [budget]);

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

  return (
    <div className="container mx-auto p-4">
      <section className='w-full flex justify-between items-center mb-6'>
        <div>
          <H1 className='font-semibold text-2xl mb-2'>Energy Consumption Dashboard</H1>
          <div className="flex gap-2 items-center">
            <Badge variant="outline">Real-time</Badge>
            <Badge variant="secondary">Total: {totalConsumption.toFixed(2)} kWh</Badge>
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
        {/* Cards remain the same but with ResponsiveContainer added */}
        <Card>
          <CardHeader>
            <CardTitle>Real-time Energy Usage</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={energyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="consumption" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* HVAC Usage */}
        <Card>
          <CardHeader>
            <CardTitle>HVAC Energy Usage</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={energyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="hvac" stroke="#82ca9d" fill="#82ca9d" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Lighting */}
        <Card>
          <CardHeader>
            <CardTitle>Lighting Consumption</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={energyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="lighting" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Appliances */}
        <Card>
          <CardHeader>
            <CardTitle>Appliances Usage</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={energyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="appliances" stroke="#ff7300" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Water Heating */}
        <Card>
          <CardHeader>
            <CardTitle>Water Heating</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={energyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="waterHeating" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Other Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Other Consumption</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={energyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="other" fill="#413ea0" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}