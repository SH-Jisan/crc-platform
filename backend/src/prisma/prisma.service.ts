import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg"; // 🔥 pg থেকে Pool ইমপোর্ট করতে হবে

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // 🔥 Pool কনফিগারেশনের মাধ্যমে SSL rejectUnauthorized false করে দেওয়া হলো
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL!,
      ssl: {
        rejectUnauthorized: false, // এটি self-signed certificate এরর বাইপাস করবে
      },
    });

    const adapter = new PrismaPg(pool);

    // Prisma-এর টাইপ ডেফিনেশন মিসিং থাকার কারণে আসা এররটি বাইপাস করা হলো
    // @ts-ignore
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}