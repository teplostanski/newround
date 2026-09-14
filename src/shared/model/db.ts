import Dexie, { type Table } from 'dexie';
import type { Game, Playthrough, Round } from './types';

class Database extends Dexie {
  games!: Table<Game, string>;
  playthroughs!: Table<Playthrough, string>;
  rounds!: Table<Round, string>;

  constructor() {
    super('newround-db');

    this.version(1).stores({
      games: 'id, name, createdAt, updatedAt, isTestData',
      playthroughs: 'id, gameId, createdAt, updatedAt, isTestData',
      rounds: 'id, gameId, playthroughId, createdAt, updatedAt, isTestData',
    });
  }
}

export const db = new Database();

const setupCascadeDeleteHooks = (db: Database) => {
  db.playthroughs.hook('deleting', function (playthroughId, _, transaction) {
    return transaction
      .table('rounds')
      .where('playthroughId')
      .equals(playthroughId)
      .delete();
  });
  
  db.games.hook('deleting', function (gameId, _, transaction) {
    return transaction
      .table('playthroughs')
      .where('gameId')
      .equals(gameId)
      .delete();
  });
}

setupCascadeDeleteHooks(db);

export const resetDatabase = async () => {
  await db.delete();
  await db.open();
};
