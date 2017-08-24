
export const merge = (props?: object, extra: object = {}, extra2: object = {}): object => {
  if(Object.keys(extra).length === 0 && Object.keys(extra2).length === 0) {
    return props;
  }
  return Object.assign({}, props, extra, extra2);
}

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
