export const AmberPlainsColors = {
  night: '#0B0E0C',
  forest: '#141A16',
  surface: '#1A221D',
  border: '#26332B',
  borderLight: '#35463C',
  gold: '#C5A059',
  goldLight: '#E0C58A',
  goldDark: '#8F7135',
  sand: '#F4EFE6',
  sandMuted: '#A7A39A',
  sage: '#8FA196',
  emerald: '#10B981',
  amber: '#F59E0B',
  red: '#EF4444',
  blue: '#38BDF8',
};

export default {
  light: {
    text: '#0B0E0C',
    background: '#F4EFE6',
    tint: AmberPlainsColors.gold,
    tabIconDefault: '#8FA196',
    tabIconSelected: AmberPlainsColors.gold,
  },
  dark: {
    text: AmberPlainsColors.sand,
    background: AmberPlainsColors.night,
    tint: AmberPlainsColors.gold,
    tabIconDefault: '#5F6F65',
    tabIconSelected: AmberPlainsColors.gold,
  },
};

