import { mysqlTable, serial, varchar, text, timestamp, int } from 'drizzle-orm/mysql-core';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const users = mysqlTable('users', {
    id: serial('id').primaryKey(),
    username: varchar('username', { length: 255 }).notNull().unique(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
});

export const projects = mysqlTable('projects', {
  id: serial('id').primaryKey(),
  userId: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow()
});

export const tasks = mysqlTable('tasks', {
  id: serial('id').primaryKey(),
  projectId: int('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  userId: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 50 }).notNull(),
  priority: varchar('priority', { length: 50 }).notNull(),
  dueDate: timestamp('due_date'),
  createdAt: timestamp('created_at').defaultNow()
});

export const comments = mysqlTable('comments', {
  id: serial('id').primaryKey(),
  taskId: int('task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  userId: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  comment: text('comment').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

export const taskAssignees = mysqlTable('task_assignees', {
  id: serial('id').primaryKey(),
  taskId: int('task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  userId: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' })
});

export const labels = mysqlTable('labels', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  color: varchar('color', { length: 7 }).notNull()  // HEX color code
});

export const taskLabels = mysqlTable('task_labels', {
  id: serial('id').primaryKey(),
  taskId: int('task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  labelId: int('label_id').notNull().references(() => labels.id, { onDelete: 'cascade' })
});

export async function createDatabase() {
    const connection = await mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        database: process.env.DATABASE,
        port: 3306,
        password: process.env.PASSWORD 
    });

    return drizzle(connection);
}
