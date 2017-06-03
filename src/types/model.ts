import { Query } from './queries';

/** The model: all the entities that this app deals with referenced by name. */
export interface Model {
[name: string]: Entity;
}

export interface Entity {
  /** The name of this entity, if not set, this is set to the key of this entity in the Model. */
  name?: string;
  /** The map of attributes by names. */
  attributes: Attributes;
  /** The mappings between attributes and predefined attributes, e.g. title attribute.
   *  This information will be computed on startup and used when rendering lists or cards.
   *  The user may override. */
  mappings?: AttributeMappings
}

export interface AttributeMappings {
  /** The name of the attribute to use as the title. */
  title?: string;
  /** The name of the attribute to use as the URL. */
  url?: string;
  /** The name of the atttribute to use as the description. */
  description?: string;
}

export interface Attributes {
  [name: string]: Attribute;
}

/** The definition for a single attribute. */
export interface Attribute {
  /** Primitive type, or entity name or array of type (e.g. Subject[]). */
  type: SimpleType | string;
  /** The name to display in the UI, if not set, use name key of the attribute with the first letter upper cased. */
  displayName?: string;
  /** The name of this attribute, defaults to the key of the attribute in the entity.attributes. */
  name?: string;
  /** Is this attribute nullable, default: true. */
  nullable?: boolean;
  /** The possible values for this attribute, only applicable if type === 'enum'. */
  enumValues?: Array<EnumValue>;
}

export interface EnumValue {
  /** The string ID of this value. */
  id: string;
  /** The name of this value, as it appears in the UI. */
  name: string;
}

/** The simple types supported for the attributes */
export enum SimpleType {
  /** String that represents in a textual form an entity.
   *  
   *  There should only be one attribute of type TITLE in an entity. */
  TITLE,
  /** String */
  STRING,
  /** Multiline string. */
  TEXT,
  /** String that represents the url of this object
   *  
   *  There should only be one attribute of type URL in an entity. */
  URL,
  BOOLEAN,
  ENUM
}