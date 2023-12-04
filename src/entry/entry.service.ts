import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Entry } from 'src/schemas/entry.schema';

@Injectable()
export class EntryService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(Entry.name) private entryModel: Model<Entry>,
  ) {}

  async create(entry: Entry) {    
    const createdEntry = new this.entryModel(entry);

    await createdEntry.save();
  }

  async get(accountID: string) : Promise<Entry[]> {
    const entries = await this.entryModel.find({
      "accountID": accountID, 
    })

    return entries;
  }

  async getOne(entryID: string) : Promise<Entry> {
    const entry = await this.entryModel.findOne({
      "ID": entryID,
    })

    return entry;
  }

  async changeField(entryID: string, field: string, value: any) : Promise<Entry> {
    const modify = {}
    modify[field] = value;
    
    const entry = await this.entryModel.findOneAndUpdate(
      {'ID': entryID},
      {
        "$set": modify,
      },
    )

    entry[field] = value;

    return new Entry(entry);
  }

  async change(entryID: string, title: string, description: string, customerLink: string) : Promise<Entry> {    
    const entry = await this.entryModel.findOneAndUpdate(
      {'ID': entryID},
      {
        "$set": {
          title: title,
          description: description,
          customerLink: customerLink,
        },
      },
    )

    entry.title = title;
    entry.description = description;
    entry.customerLink = customerLink;

    return new Entry(entry);
  }
}
