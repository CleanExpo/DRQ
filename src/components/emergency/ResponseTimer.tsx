import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Clock, Truck, MapPin } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ResponseTimerProps {
  estimatedTime: string;
  status: 'pending' | 'enRoute' | 'onSite';
  lastUpdate?: string;
}

const statusConfig = {
  pending: {
    icon: Clock,
    color: 'text-yellow-500',
    progress: 33,
    text: 'Processing Request'
  },
  enRoute: {
    icon: Truck,
    color: 'text-blue-500',
    progress: 66,
    text: 'Team En Route'
  },
  onSite: {
    icon: MapPin,
    color: 'text-green-500',
    progress: 100,
    text: 'Team On Site'
  }
};

export const ResponseTimer: React.FC<ResponseTimerProps> = ({
  estimatedTime,
  status,
  lastUpdate
}) => {
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <StatusIcon className={cn("h-5 w-5", config.color)} />
          <span>{config.text}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={config.progress} className="h-2" />
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Estimated Arrival:</span>
            <span className="font-medium">{estimatedTime}</span>
          </div>
          
          {lastUpdate && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Last Update:</span>
              <span className="text-xs">{lastUpdate}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResponseTimer;
