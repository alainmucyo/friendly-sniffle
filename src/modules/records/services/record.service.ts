import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { RecordDto } from "../dtos/record.dto";
import { RedisHelper } from "../../../helpers/redis-helper";
import { RecordEntity } from "../entities/record.entity";

@Injectable()
export class RecordService {
  constructor(private readonly redis: RedisHelper) {}
  private readonly REDIS_KEY = `records`;
  private readonly TTL = 60 * 60; // An hour

  async cacheRecords(records: RecordDto[]): Promise<void> {
    // Cache the record for an hour
    await this.redis.set(this.REDIS_KEY, records, this.TTL);
  }

  // Returns all cached records
  async getCachedRecords(
    pageSize: number,
    pageNumber: number,
  ): Promise<RecordDto[]> {
    const records: RecordDto[] = await this.redis.get(this.REDIS_KEY);
    if (!records) return [];
    return records.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  }

  // Saves cached record to DB
  async saveCachedRecordsToDB(errorFree: boolean) {
    const records: RecordDto[] = await this.redis.get(this.REDIS_KEY);
    if (!records) throw new BadRequestException("No cached records available");
    for (const r of records) {
      if (errorFree && r.errors.length > 0) continue;
      const record = new RecordEntity();
      record.nid = r.nid;
      record.phoneNumber = r.phoneNumber;
      record.email = r.email;
      record.names = r.names;
      record.gender = r.gender;
      record.errors = r.errors;
      await record.save();
    }

    // Deletes the cache
    this.redis.del(this.REDIS_KEY);
  }

  async cachedRecordsExists(): Promise<boolean> {
    const exists = await this.redis.exists(this.REDIS_KEY);
    // Returns true if exists is one and false if not equal 1
    return exists == 1;
  }

  // Finds all records from the database with pagination
  async findAllFromDB(pageSize: number, pageNumber: number): Promise<any> {
    const take = pageSize || 10;
    const page = Number(pageNumber) || 1;
    const skip = (page - 1) * take;
    const [list, total] = await RecordEntity.findAndCount({
      order: {
        createdAt: "DESC",
      },
      take,
      skip,
    });
    const lastPage = Math.ceil(total / take);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;
    return {
      list,
      prevPage,
      nextPage,
      lastPage,
      currentPage: page,
      totalRecords: total,
    };
  }
}
