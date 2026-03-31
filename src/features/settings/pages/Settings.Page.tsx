import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Type, ZoomIn, Check } from 'lucide-react';
import { DetailHeader } from '@/src/shared/ui/SharedUI.Component';
import { useStore } from '@/src/store/main.store';
import { ThemeColor, TextSize, ZoomLevel } from '@/src/shared/types/domain.type';

export const SettingsPage: React.FC = () => {
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

  return (
    <div className="min-h-full bg-background pb-24">
      <DetailHeader title="Settings" subtitle="Preferences & Appearance" />

      <div className="p-4 space-y-6 max-w-2xl mx-auto mt-2">
        {/* Colors Section */}
        <div className="bg-surface-container-low border border-white/5 rounded-3xl p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Palette size={20} />
            </div>
            <div>
              <h3 className="text-base font-black text-on-surface leading-tight mb-0.5">Theme Color</h3>
              <p className="text-xs text-on-surface-variant font-medium">Choose your primary accent color</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            {colors.map((color) => (
              <button
                key={color.id}
                onClick={() => setThemeColor(color.id)}
                className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95`}
                style={{ backgroundColor: color.value }}
                title={color.label}
              >
                {themeColor === color.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-white drop-shadow-md z-10"
                  >
                    <Check size={22} strokeWidth={3} />
                  </motion.div>
                )}
                {themeColor === color.id && (
                  <motion.div
                    layoutId="activeColorRing"
                    className="absolute -inset-1.5 sm:-inset-2 rounded-full border-2"
                    style={{ borderColor: color.value }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Text Size Section */}
        <div className="bg-surface-container-low border border-white/5 rounded-3xl p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-white/5 text-on-surface flex items-center justify-center">
              <Type size={20} />
            </div>
            <div>
              <h3 className="text-base font-black text-on-surface leading-tight mb-0.5">Typography Size</h3>
              <p className="text-xs text-on-surface-variant font-medium">Adjust the base text scale</p>
            </div>
          </div>

          <div className="flex bg-surface-container-highest rounded-2xl p-1 relative border border-white/5">
            {textSizes.map((size) => (
              <button
                key={size.id}
                onClick={() => setTextSize(size.id)}
                className={`relative flex-1 py-3 text-sm font-bold transition-colors ${textSize === size.id ? 'text-on-surface' : 'text-on-surface-variant hover:text-white'}`}
              >
                {textSize === size.id && (
                  <motion.div
                    layoutId="activeTextSize"
                    className="absolute inset-0 bg-surface-container-low border border-white/10 rounded-xl shadow-md"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{size.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Display Zoom Section */}
        <div className="bg-surface-container-low border border-white/5 rounded-3xl p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-white/5 text-on-surface flex items-center justify-center">
              <ZoomIn size={20} />
            </div>
            <div>
              <h3 className="text-base font-black text-on-surface leading-tight mb-0.5">Display Zoom</h3>
              <p className="text-xs text-on-surface-variant font-medium">Scale the entire interface</p>
            </div>
          </div>

          <div className="flex bg-surface-container-highest rounded-2xl p-1 relative border border-white/5">
            {zooms.map((zoom) => (
              <button
                key={zoom.id}
                onClick={() => setZoomLevel(zoom.id)}
                className={`relative flex-1 py-3 text-sm font-bold transition-colors ${zoomLevel === zoom.id ? 'text-on-surface' : 'text-on-surface-variant hover:text-white'}`}
              >
                {zoomLevel === zoom.id && (
                  <motion.div
                    layoutId="activeZoomLevel"
                    className="absolute inset-0 bg-surface-container-low border border-white/10 rounded-xl shadow-md"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{zoom.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};