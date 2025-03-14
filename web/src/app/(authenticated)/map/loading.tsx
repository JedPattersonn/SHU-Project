import { Map } from 'lucide-react';

export default function Loading() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-white">
      <div className="text-center space-y-4">
        <Map className="w-12 h-12 text-blue-500 mx-auto animate-spin [animation-duration:2s]" />
        <p className="text-gray-500 font-medium">Loading map data...</p>
      </div>
    </div>
  );
} 