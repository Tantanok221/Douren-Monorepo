import {artistBaseSchemaWithTagType, eventArtistBaseSchemaType} from "@pkg/type";

export function isEventArtistBaseSchema(data: eventArtistBaseSchemaType | artistBaseSchemaWithTagType | undefined): data is eventArtistBaseSchemaType {
  return data !== undefined &&
    typeof data === 'object' &&
    'boothName' in data &&
    'locationDay01' in data &&
    'locationDay02' in data &&
    'locationDay03' in data &&
    'DM' in data;
}
