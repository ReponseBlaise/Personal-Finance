import { db } from './database';
import { Pot } from './types';

export class PotService {
  static createPot(
    userId: string,
    name: string,
    target: number,
    color: string
  ): Pot {
    if (target <= 0) {
      throw new Error('Target must be greater than 0');
    }

    if (!name || name.trim().length === 0) {
      throw new Error('Pot name is required');
    }

    return db.createPot(userId, name, target, color);
  }

  static getPots(userId: string): Pot[] {
    return db.getPotsByUserId(userId);
  }

  static addToPot(potId: string, userId: string, amount: number): Pot {
    const pot = db.getPotById(potId);

    if (!pot || pot.userId !== userId) {
      throw new Error('Pot not found or does not belong to user');
    }

    if (amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    const newCurrent = pot.current + amount;
    if (newCurrent > pot.target) {
      throw new Error('Amount exceeds pot target');
    }

    const updated = db.updatePot(potId, { current: newCurrent });
    if (!updated) {
      throw new Error('Failed to update pot');
    }

    return updated;
  }

  static withdrawFromPot(potId: string, userId: string, amount: number): Pot {
    const pot = db.getPotById(potId);

    if (!pot || pot.userId !== userId) {
      throw new Error('Pot not found or does not belong to user');
    }

    if (amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    if (amount > pot.current) {
      throw new Error('Insufficient funds in pot');
    }

    const newCurrent = pot.current - amount;
    const updated = db.updatePot(potId, { current: newCurrent });
    if (!updated) {
      throw new Error('Failed to update pot');
    }

    return updated;
  }

  static deletePot(potId: string, userId: string): boolean {
    const pot = db.getPotById(potId);

    if (!pot || pot.userId !== userId) {
      throw new Error('Pot not found or does not belong to user');
    }

    return db.deletePot(potId);
  }
}
