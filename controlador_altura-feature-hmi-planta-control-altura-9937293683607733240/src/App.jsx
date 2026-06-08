import React from 'react';
import { MqttProvider } from './mqtt/MqttProvider';
import TopNav from './components/TopNav';
import MetricsCards from './components/MetricsCards';
import LiveResponseChart from './components/LiveResponseChart';
import ControlPanel from './components/ControlPanel';
import TelemetryFeed from './components/TelemetryFeed';
import './styles/globals.css';

function App() {
  return (
    <MqttProvider>
      <div className="app-layout">
        <TopNav />

        <main className="main-content">
          <MetricsCards />

          {/* Main Content Grid */}
          <div className="dashboard-grid">
            <LiveResponseChart />
            <ControlPanel />
          </div>

          {/* Secondary Content Grid */}
          <div className="dashboard-grid">
            <TelemetryFeed />
          </div>
        </main>
      </div>
    </MqttProvider>
  );
}

export default App;
