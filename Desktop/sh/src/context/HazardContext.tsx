import React, { createContext, useContext, useState, useEffect } from 'react';
import { HazardZone } from '../types/hazard';
import { hazardService } from '../services/hazardService';
import { MOCK_HAZARD_ZONES } from '../data/mockHazards';

export interface MapLayerConfig {
  landslide: boolean;
  flood: boolean;
  radar: boolean;
  roads: boolean;
  shelters: boolean;
  teams: boolean;
}

interface HazardContextType {
  zones: HazardZone[];
  selectedZone: HazardZone;
  setSelectedZone: (zone: HazardZone) => void;
  selectZoneById: (zoneId: string) => void;
  timeOffsetHours: number;
  setTimeOffsetHours: (hours: number) => void;
  layers: MapLayerConfig;
  toggleLayer: (key: keyof MapLayerConfig) => void;
  unreadAlertsCount: number;
  decrementAlertCount: () => void;
  clearAlertCount: () => void;
}

const defaultLayers: MapLayerConfig = {
  landslide: true,
  flood: true,
  radar: true,
  roads: true,
  shelters: true,
  teams: true,
};

const HazardContext = createContext<HazardContextType | undefined>(undefined);

export const HazardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timeOffsetHours, setTimeOffsetHours] = useState<number>(0);
  const [zones, setZones] = useState<HazardZone[]>(MOCK_HAZARD_ZONES);
  const [selectedZone, setSelectedZone] = useState<HazardZone>(MOCK_HAZARD_ZONES[0]); // default Meppadi
  const [layers, setLayers] = useState<MapLayerConfig>(defaultLayers);
  const [unreadAlertsCount, setUnreadAlertsCount] = useState<number>(3);

  // Recalculate forecast whenever timeOffsetHours changes
  useEffect(() => {
    const updated = hazardService.getSimulatedForecast(timeOffsetHours);
    setZones(updated);
    const updatedSelected = updated.find((z) => z.id === selectedZone.id) || updated[0];
    setSelectedZone(updatedSelected);
  }, [timeOffsetHours]);

  const selectZoneById = (zoneId: string) => {
    const found = zones.find((z) => z.id === zoneId);
    if (found) setSelectedZone(found);
  };

  const toggleLayer = (key: keyof MapLayerConfig) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const decrementAlertCount = () => {
    setUnreadAlertsCount((prev) => Math.max(0, prev - 1));
  };

  const clearAlertCount = () => {
    setUnreadAlertsCount(0);
  };

  return (
    <HazardContext.Provider
      value={{
        zones,
        selectedZone,
        setSelectedZone,
        selectZoneById,
        timeOffsetHours,
        setTimeOffsetHours,
        layers,
        toggleLayer,
        unreadAlertsCount,
        decrementAlertCount,
        clearAlertCount,
      }}
    >
      {children}
    </HazardContext.Provider>
  );
};

export const useHazard = (): HazardContextType => {
  const context = useContext(HazardContext);
  if (!context) {
    throw new Error('useHazard must be used within a HazardProvider');
  }
  return context;
};
