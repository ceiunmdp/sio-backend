import { Connection, EntityManager } from 'typeorm';

export abstract class TransactionUtil {
  static async execute(connection: Connection, callback: (manager: EntityManager) => Promise<any>) {
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await callback(queryRunner.manager);
      await queryRunner.commitTransaction();
      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
