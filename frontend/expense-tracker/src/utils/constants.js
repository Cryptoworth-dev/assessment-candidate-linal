export const CATEGORY_COLORS = {
  Food: '#ef4444',         // Red
  Transport: '#3b82f6',    // Blue
  Utilities: '#f59e0b',    // Amber/Yellow
  Rent: '#8b5cf6',         // Purple
  Entertainment: '#ec4899',// Pink
  Health: '#14b8a6',       // Teal
  Other: '#64748b'         // Gray
};

export const hexToRgba = (hex, opacity) => {
  let r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

  if (opacity) {
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  } else {
      return `rgb(${r}, ${g}, ${b})`;
  }
};
