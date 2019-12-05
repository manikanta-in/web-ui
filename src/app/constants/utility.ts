export const isStringType = (col: any): boolean => !col.type || col.type.toLowerCase() === 'string';

export const isDateType = (col: any): boolean => {
  return col.type && col.type.toLowerCase() === 'date';
};

export const isDropDown = (col: any): boolean => {
  return col.type && col.type.toLowerCase() === 'dropdown';
};

export const isMultiSelect = (col: any): boolean => {
  return col.type && col.type.toLowerCase() === 'multiselect';
};

export const isSlider = (col: any): boolean => {
  return col.type && col.type.toLowerCase() === 'slider';
};

export const isSliderToggle = (col: any): boolean => {
  return col.type && col.type.toLowerCase() === 'slidertoggle';
};
