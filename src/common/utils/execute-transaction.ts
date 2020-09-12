// import { Connection, EntityManager } from 'typeorm';

// const executeTransaction = async (connection: Connection, callback: (manager: EntityManager) => Promise<any>) => {
//   const queryRunner = connection.createQueryRunner();
//   await queryRunner.connect();
//   await queryRunner.startTransaction('REPEATABLE READ'); // "READ UNCOMMITTED" | "READ COMMITTED" | "REPEATABLE READ" | "SERIALIZABLE";
//   try {
//     const result = await callback(queryRunner.manager);
//     await queryRunner.commitTransaction();
//     return result;
//   } catch (err) {
//     await queryRunner.rollbackTransaction();
//     throw err;
//   } finally {
//     await queryRunner.release();
//   }
// };
