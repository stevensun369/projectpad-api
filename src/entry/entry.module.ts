import { Module } from '@nestjs/common';
import { EntryService } from './entry.service';
import { AuthService } from 'src/auth/auth.service';
import { EntryController } from './entry.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Entry, EntrySchema } from 'src/schemas/entry.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{name: Entry.name, schema: EntrySchema}],
    )
  ],
  providers: [AuthService, EntryService],
  controllers: [EntryController],
})
export class EntryModule {}
