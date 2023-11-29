import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AccountDocument = HydratedDocument<Account>;

@Schema()
export class Account {
  constructor(from: {}) {
    return {
      ID: from['ID'],
      ProfilePic: from['profilePic'],
      email: from['email'],
      phone: from['phone'],
      firstName: from['firstName'],
      lastName: from['lastName'],
      links: from['links'],
      slug: from['slug'],
      bio: from['bio'],
      password: from['password'],
    }
  }

  @Prop()
  ProfilePic: string;
  
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

  @Prop({type: {}})
  links: {};

  @Prop()
  slug: string;

  @Prop()
  bio: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);