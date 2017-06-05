import { ComponentProps } from './components';


/**
 * The interface that represents a piece of data.
 * 
 * Onlyone attribute of this interface should be set at once.
 * 
 * It is recomended to use factory functions to easily create and instance of this interface.
 */
export interface Data {
  /** The constant value that this data represents, only one attribute in this interface should be set at once. */
  constant?: any;
  /** The name of the attribute to use as data source. Only valid in places where there is an entity available. */
  attribute?: string;
  /** The path inside of the components properties to look for the value. */
  pathInProps?: string[];
}