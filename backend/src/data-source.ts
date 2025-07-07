import { User } from 'src/entity/user.entity';
import { Email } from 'src/entity/email.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();

export const dataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Email],
  synchronize: true,
  logging: false,
} as DataSourceOptions;

export const dataSource = new DataSource(dataSourceOptions);
