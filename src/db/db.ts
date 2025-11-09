import type { User } from "../types/user.types.js";

export class DB {
  private users: Map<string, User> = new Map();

  create(user: User): User {
    this.users.set(user.id, user);
    return user;
  }

  getAll(): User[] {
    return Array.from(this.users.values());
  }

  getUserById(id: string): User|undefined {
    return this.users.get(id);
  }

  updateUser(id: string, data: User): User|undefined {
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
