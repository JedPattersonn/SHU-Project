import React from 'react';
import InteractiveHeatMap from '@/components/map/interactive-map';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Map | Energy Dashboard"
}

function App() {
  return (
    <div>
      <InteractiveHeatMap />
    </div>
  );
}

export default App;