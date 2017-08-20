import { Data } from './types';

/**
 * Transform the given camel case text to a display text.
 * e.g.: 
 * myAttribute => My Attribute
 * MyEntity => My Entity
 * 
 * @param camelCase the camel case text to change, must not be null
 */
export const toDisplayName = (camelCase: string): string => {
  return camelCase
    // insert a space before all caps
    .replace(/([A-Z])/g, ' $1')
    // uppercase the first character
    .replace(/^./, function(str){ return str.toUpperCase(); });
}

export const resolveOrNull = (data: Data | null | undefined, props: any): string | null => {
  return data ? resolve(data, props) : null;
}

export const resolve = (data: Data, props: any): string => {
  if(typeof data === 'function') {
    return data(props);
  }
  return data;
}