import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AccountDocument = HydratedDocument<Account>;

@Schema()
export class Account {
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
  links: [{platform: string, url: string}];

  @Prop()
  slug: string;

  @Prop()
  bio: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);