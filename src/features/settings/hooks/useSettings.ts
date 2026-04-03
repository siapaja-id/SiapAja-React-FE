import { useStore } from '@/src/store/main.store';
import { ThemeColor, TextSize, ZoomLevel } from '@/src/shared/types/app.types';

export const useSettings = () => {
  const { themeColor, setThemeColor, textSize, setTextSize, zoomLevel, setZoomLevel } = useStore();

  const colors: { id: ThemeColor; value: string; label: string }[] = [
    { id: 'red', value: '#DC2626', label: 'Crimson' },
    { id: 'blue', value: '#3B82F6', label: 'Ocean' },
    { id: 'emerald', value: '#10B981', label: 'Emerald' },
    { id: 'violet', value: '#8B5CF6', label: 'Amethyst' },
    { id: 'amber', value: '#F59E0B', label: 'Amber' },
  ];

  const textSizes: { id: TextSize; label: string }[] = [
    { id: 'sm', label: 'Small' },
    { id: 'md', label: 'Medium' },
    { id: 'lg', label: 'Large' },
  ];

  const zooms: { id: ZoomLevel; label: string }[] = [
    { id: 90, label: '90%' },
    { id: 100, label: '100%' },
    { id: 110, label: '110%' },
    { id: 120, label: '120%' },
  ];

  return {
    themeColor,
    setThemeColor,
    textSize,
    setTextSize,
    zoomLevel,
    setZoomLevel,
    colors,
    textSizes,
    zooms,
  };
};
