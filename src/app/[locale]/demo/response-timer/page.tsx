import { ResponseTimer } from '../../../../components/emergency/ResponseTimer';

export default function ResponseTimerDemo() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Response Timer Demo</h1>
      
      <div className="space-y-8">
        {/* Pending State */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Pending State</h2>
          <ResponseTimer
            status="pending"
            estimatedTime="15 minutes"
            lastUpdate="Just now"
          />
        </div>

        {/* En Route State */}
        <div>
          <h2 className="text-lg font-semibold mb-2">En Route State</h2>
          <ResponseTimer
            status="enRoute"
            estimatedTime="5 minutes"
            lastUpdate="2 minutes ago"
          />
        </div>

        {/* On Site State */}
        <div>
          <h2 className="text-lg font-semibold mb-2">On Site State</h2>
          <ResponseTimer
            status="onSite"
            estimatedTime="Arrived"
            lastUpdate="1 minute ago"
          />
        </div>
      </div>
    </div>
  );
}
