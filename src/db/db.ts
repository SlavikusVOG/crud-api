import { join } from "node:path";
import type { User } from "../types/user.types.js";
import { v4 as uuidv4 } from 'uuid';
import { readFile, writeFile } from "node:fs/promises";

const directory = import.meta.dirname;
const dbDirname= join( directory, 'database');

const DB_PATH = join(dbDirname, 'users.json');

export class DB {
  private users: Map<string, User> = new Map();

  // TODO: move DB to file
  async load(): Promise<User[]> {
    try {
      const data = await readFile(DB_PATH);
      return JSON.parse(data.toString())
    }
    catch {
      return [];
    }
  }

  // TODO: move DB to file
  async save(users: User[]): Promise<void> {
    await writeFile(DB_PATH, JSON.stringify(users));
  }

  create(data: Omit<User, 'id'>): User {
    const id: string = uuidv4();
    const user: User = {...data, ...{ id }}
    this.users.set(id, user);
    return user;
  }

  getAll(): User[] {
    return Array.from(this.users.values());
  }

  getUserById(id: string): User|undefined {
    return this.users.get(id);
  }

  updateUser(id: string, data: Omit<User, 'id' | 'username' | 'age' | 'hobbies'>): User|undefined {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updatedUser = { ...user, ...data};
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  delete(id: string) {
    return this.users.delete(id);
  }
}

export const db = new DB();
