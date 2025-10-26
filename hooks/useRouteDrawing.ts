import { useMemo } from 'react';
import { ClientCoords, ClientMainData } from '../api/client';

interface CoordsDictionary {
  [clientId: string]: ClientCoords;
}

interface UsePolylineProps {
  coords: CoordsDictionary;
  clients?: ClientMainData[];
  options?: {
    enableBounds?: boolean;
    enableOptimization?: boolean;
    strokeColor?: string;
    strokeWidth?: number;
    strokeOpacity?: number;
    tolerance?: number;
  };
}

interface UsePolylineReturn {
  polylineGeometry: number[][];
  optimizedPolylineGeometry: number[][];
  bounds: [[number, number], [number, number]] | null;
  center: [number, number] | null;
  zoom: number | null;
  isEmpty: boolean;
  isValid: boolean;
  isOptimized: boolean;
  getPointByClientId: (clientId: string) => number[] | null;
  polylineOptions: {
    strokeColor: string;
    strokeWidth: number;
    strokeOpacity: number;
  };
}

// Дуглас-Пекер
const douglasPeucker = (points: number[][], tolerance: number): number[][] => {
  if (points.length <= 2) return points;
  
  let maxDistance = 0;
  let index = 0;
  const [start, end] = [points[0], points[points.length - 1]];
  
  for (let i = 1; i < points.length - 1; i++) {
    const distance = perpendicularDistance(points[i], start, end);
    if (distance > maxDistance) {
      maxDistance = distance;
      index = i;
    }
  }
  
  if (maxDistance > tolerance) {
    const left = douglasPeucker(points.slice(0, index + 1), tolerance);
    const right = douglasPeucker(points.slice(index), tolerance);
    return left.slice(0, -1).concat(right);
  } else {
    return [start, end];
  }
};

const perpendicularDistance = (point: number[], lineStart: number[], lineEnd: number[]): number => {
  const [x, y] = point;
  const [x1, y1] = lineStart;
  const [x2, y2] = lineEnd;
  
  const area = Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1);
  const lineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  return area / lineLength;
};

export const useRouteDrawing = ({
  coords,
  clients = [],
  options = {}
}: UsePolylineProps): UsePolylineReturn => {
  const {
    enableBounds = true,
    enableOptimization = false,
    strokeColor = '#1e90ff',
    strokeWidth = 4,
    strokeOpacity = 0.7,
    tolerance = 0.01
  } = options;

  const polylineGeometry = useMemo(() => {
    if (!coords || Object.keys(coords).length === 0) {
      return [];
    }

    const points = Object.entries(coords)
      .map(([clientId, coord]) => {
        const lat = parseFloat(coord.latitude);
        const lng = parseFloat(coord.longitude);
        
        // Валидация координат
        if (isNaN(lat) || isNaN(lng)) return null;
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
        
        return [lat, lng] as [number, number];
      })
      .filter((point): point is [number, number] => point !== null);

    return points.length > 1 ? points : [];
  }, [coords]);

  const optimizedPolylineGeometry = useMemo(() => {
    if (!enableOptimization || polylineGeometry.length <= 2) {
      return polylineGeometry;
    }
    
    return douglasPeucker(polylineGeometry, tolerance);
  }, [polylineGeometry, enableOptimization, tolerance]);

  const bounds = useMemo((): [[number, number], [number, number]] | null => {
    if (!enableBounds || polylineGeometry.length === 0) return null;
    
    // Используем простой цикл вместо reduce для избежания проблем с типами
    let minLat = polylineGeometry[0][0];
    let minLng = polylineGeometry[0][1];
    let maxLat = polylineGeometry[0][0];
    let maxLng = polylineGeometry[0][1];

    for (let i = 1; i < polylineGeometry.length; i++) {
      const [lat, lng] = polylineGeometry[i];
      minLat = Math.min(minLat, lat);
      minLng = Math.min(minLng, lng);
      maxLat = Math.max(maxLat, lat);
      maxLng = Math.max(maxLng, lng);
    }

    const latPadding = (maxLat - minLat) * 0.05;
    const lngPadding = (maxLng - minLng) * 0.05;
    
    return [
      [minLat - latPadding, minLng - lngPadding],
      [maxLat + latPadding, maxLng + lngPadding]
    ];
  }, [polylineGeometry, enableBounds]);

  const center = useMemo((): [number, number] | null => {
    if (!bounds) return null;
    
    return [
      (bounds[0][0] + bounds[1][0]) / 2,
      (bounds[0][1] + bounds[1][1]) / 2
    ];
  }, [bounds]);

  const zoom = useMemo(() => {
    if (!bounds) return null;
    
    const latDiff = bounds[1][0] - bounds[0][0];
    const lngDiff = bounds[1][1] - bounds[0][1];
    const maxDiff = Math.max(latDiff, lngDiff);
    
    if (maxDiff > 40) return 4;
    if (maxDiff > 20) return 5;
    if (maxDiff > 10) return 6;
    if (maxDiff > 5) return 7;
    if (maxDiff > 2) return 8;
    if (maxDiff > 1) return 9;
    if (maxDiff > 0.5) return 10;
    if (maxDiff > 0.2) return 11;
    if (maxDiff > 0.1) return 12;
    return 13;
  }, [bounds]);

  const getPointByClientId = useMemo(() => 
    (clientId: string): number[] | null => {
      const coord = coords[clientId];
      if (!coord) return null;
      
      const lat = parseFloat(coord.latitude);
      const lng = parseFloat(coord.longitude);
      
      return isNaN(lat) || isNaN(lng) ? null : [lat, lng];
    },
    [coords]
  );

  return {
    polylineGeometry,
    optimizedPolylineGeometry: enableOptimization ? optimizedPolylineGeometry : polylineGeometry,
    bounds,
    center,
    zoom,
    isEmpty: polylineGeometry.length === 0,
    isValid: polylineGeometry.length > 1,
    isOptimized: enableOptimization && optimizedPolylineGeometry.length < polylineGeometry.length,
    getPointByClientId,
    polylineOptions: {
      strokeColor,
      strokeWidth,
      strokeOpacity
    }
  };
};