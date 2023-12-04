import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EntryDocument = HydratedDocument<Entry>;

@Schema()
export class Entry {
  constructor(from: {}) {
    return {
      ID: from['ID'],
      accountID: from['accountID'],
      title: from['title'],
      description: from['description'],
      images: from['images'],
      customerLink: from['customerLink'],
      hidden: from['hidden'],
      createdAt: from['createdAt'],
      order: from['order'],
    }
  }
  
  @Prop()
  ID: string
  
  @Prop()
  accountID: string

  @Prop()
  title: string

  @Prop()
  description: string

  @Prop()
  images: {name: string, order: number}[]

  @Prop()
  customerLink: string

  @Prop()
  hidden: boolean

  @Prop()
  createdAt: Date 

  @Prop()
  order: number
}

export const EntrySchema = SchemaFactory.createForClass(Entry);