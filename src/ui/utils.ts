import { isArray } from 'lodash';

export const uiPath = (path: string | string[]): string | string[] => {
  if(isArray(path)) {
    return ['hypract', 'ui'].concat(path);
  }
  return 'hypract.ui.' + path;
}
