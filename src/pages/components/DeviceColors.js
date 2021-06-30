const rawDeviceColors = [
  // '#EFBB51',
  // '#A06BFF',
  // '#79C2AD',
  // '#F895F0',
  // '#96E1FF',
  // '#E06AC4',
  // '#89A4E0',
  // '#F15C1A',
  '#E93B81',
  '#F5ABC9',
  '#FFE5E2',
  '#B6C9F0',
  '#E99497',
  '#F3C583',
  '#E8E46E',
  '#B3E283',
  '#867AE9',
  '#FFF5AB',
  '#FFCEAD',
  '#C449C2',
];

const deviceColors = i => rawDeviceColors[i % rawDeviceColors.length];

export default deviceColors;
