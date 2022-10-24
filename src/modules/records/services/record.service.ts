import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { RecordDto } from "../dtos/record.dto";
import { RedisHelper } from "../../../helpers/redis-helper";
import { RecordEntity } from "../entities/record.entity";
import { RecordsTypesEnum } from "../enums/records-types.enum";

@Injectable()
export class RecordService {
  constructor(private readonly redis: RedisHelper) {}
  private readonly REDIS_KEY = `records`;
  private readonly TTL = 60 * 60; // An hour

  async cacheRecords(records: RecordDto[]): Promise<void> {
    // Cache the record for an hour
    await this.redis.set(this.REDIS_KEY, records, this.TTL);
  }

  async getCachedRecords(pageSize: number, pageNumber: number) {
    const records: RecordDto[] = await this.redis.get(this.REDIS_KEY);
    if (!records) throw new NotFoundException("No cached records available");
    return records.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  }

  // Saves cached record to DB
  async saveCachedRecordsToDB(type: RecordsTypesEnum) {
    const records: RecordDto[] = await this.redis.get(this.REDIS_KEY);
    if (!records) throw new BadRequestException("No cached records available");
    for (const r of records) {
      if (type == RecordsTypesEnum.ErrorFree && r.errors.length > 0) continue;
      const record = new RecordEntity();
      record.nid = r.nid;
      record.phoneNumber = r.phoneNumber;
      record.email = r.email;
      record.names = r.names;
      record.gender = r.gender;
      record.errors = r.errors;
      await record.save();
    }
    this.redis.del(this.REDIS_KEY);
  }
}
