import Dexie, { type Table } from 'dexie';
import type { Game, Playthrough, Round } from './types';

class Database extends Dexie {
  games!: Table<Game, string>;
  playthroughs!: Table<Playthrough, string>;
  rounds!: Table<Round, string>;

  constructor() {
    super('newround-db');

    this.version(1).stores({
      games: 'id, name, createdAt, updatedAt',
      playthroughs: 'id, gameId, createdAt, updatedAt',
      rounds: 'id, gameId, playthroughId, createdAt, updatedAt',
    });

    this.version(2).stores({
      games: 'id, name, createdAt, updatedAt, isTestData',
      playthroughs: 'id, gameId, createdAt, updatedAt, isTestData',
      rounds: 'id, gameId, playthroughId, createdAt, updatedAt, isTestData',
    });
  }
}

export const db = new Database();

export const wipeDatabase = async () => {
  await db.delete();
  await db.open();
};
