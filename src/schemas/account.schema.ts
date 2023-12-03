import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AccountDocument = HydratedDocument<Account>;

@Schema()
export class Account {
  constructor(from: {}) {
    return {
      ID: from['ID'],
      email: from['email'],
      phone: from['phone'],
      firstName: from['firstName'],
      lastName: from['lastName'],
      password: from['password'],
      slug: from['slug'],
      links: from['links'],
      bio: from['bio'],
    }
  }
  
  @Prop()
  ID: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  password: string;

  @Prop()
  slug: string;

  @Prop({type: {}})
  links: {};

  @Prop()
  bio: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);