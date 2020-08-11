// import { MigrationInterface, QueryRunner } from 'typeorm';

// export class InitialMigration1597146965505 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     queryRunner.query(`
//       -- MySQL dump 10.13  Distrib 5.5.62, for Win64 (AMD64)
//       --
//       -- Host: localhost    Database: icei
//       -- ------------------------------------------------------
//       -- Server version	8.0.21

//       /*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
//       /*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
//       /*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
//       /*!40101 SET NAMES utf8 */;
//       /*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
//       /*!40103 SET TIME_ZONE='+00:00' */;
//       /*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
//       /*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
//       /*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
//       /*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

//       --
//       -- Table structure for table campus
//       --

//       DROP TABLE IF EXISTS campus;
//       /*!40101 SET @saved_cs_client     = @@character_set_client */;
//       /*!40101 SET character_set_client = utf8 */;
//       CREATE TABLE campus (
//         id varchar(36) COLLATE utf8mb4_spanish_ci NOT NULL,
//         created datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
//         updated datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
//         deleted_at datetime(6) DEFAULT NULL,
//         version int NOT NULL,
//         PRIMARY KEY (id)
//       ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
//       /*!40101 SET character_set_client = @saved_cs_client */;

//       --
//       -- Dumping data for table campus
//       --

//       LOCK TABLES campus WRITE;
//       /*!40000 ALTER TABLE campus DISABLE KEYS */;
//       /*!40000 ALTER TABLE campus ENABLE KEYS */;
//       UNLOCK TABLES;

//       --
//       -- Table structure for table careers
//       --

//       DROP TABLE IF EXISTS careers;
//       /*!40101 SET @saved_cs_client     = @@character_set_client */;
//       /*!40101 SET character_set_client = utf8 */;
//       CREATE TABLE careers (
//         id varchar(36) COLLATE utf8mb4_spanish_ci NOT NULL,
//         created datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
//         updated datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
//         deleted_at datetime(6) DEFAULT NULL,
//         version int NOT NULL,
//         name varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
//         PRIMARY KEY (id),
//         UNIQUE KEY name-idx (name)
//       ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
//       /*!40101 SET character_set_client = @saved_cs_client */;

//       --
//       -- Dumping data for table careers
//       --

//       LOCK TABLES careers WRITE;
//       /*!40000 ALTER TABLE careers DISABLE KEYS */;
//       /*!40000 ALTER TABLE careers ENABLE KEYS */;
//       UNLOCK TABLES;

//       --
//       -- Table structure for table careers_courses_relations
//       --

//       DROP TABLE IF EXISTS careers_courses_relations;
//       /*!40101 SET @saved_cs_client     = @@character_set_client */;
//       /*!40101 SET character_set_client = utf8 */;
//       CREATE TABLE careers_courses_relations (
//         id varchar(36) COLLATE utf8mb4_spanish_ci NOT NULL,
//         career_id varchar(36) COLLATE utf8mb4_spanish_ci NOT NULL,
//         course_id varchar(36) COLLATE utf8mb4_spanish_ci NOT NULL,
//         relation_id varchar(36) COLLATE utf8mb4_spanish_ci NOT NULL,
//         PRIMARY KEY (id),
//         KEY FK_60215fb570eaa931e694ea370ff (career_id),
//         KEY FK_f5a0c9ecad80e69f4dfdf4c7e1f (course_id),
//         KEY FK_67261396becb9996361f36fc2c3 (relation_id),
//         CONSTRAINT FK_60215fb570eaa931e694ea370ff FOREIGN KEY (career_id) REFERENCES careers (id),
//         CONSTRAINT FK_67261396becb9996361f36fc2c3 FOREIGN KEY (relation_id) REFERENCES relations (id),
//         CONSTRAINT FK_f5a0c9ecad80e69f4dfdf4c7e1f FOREIGN KEY (course_id) REFERENCES courses (id)
//       ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
//       /*!40101 SET character_set_client = @saved_cs_client */;

//       --
//       -- Dumping data for table careers_courses_relations
//       --

//       LOCK TABLES careers_courses_relations WRITE;
//       /*!40000 ALTER TABLE careers_courses_relations DISABLE KEYS */;
//       /*!40000 ALTER TABLE careers_courses_relations ENABLE KEYS */;
//       UNLOCK TABLES;

//       --
//       -- Table structure for table courses
//       --

//       DROP TABLE IF EXISTS courses;
//       /*!40101 SET @saved_cs_client     = @@character_set_client */;
//       /*!40101 SET character_set_client = utf8 */;
//       CREATE TABLE courses (
//         id varchar(36) COLLATE utf8mb4_spanish_ci NOT NULL,
//         created datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
//         updated datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
//         deleted_at datetime(6) DEFAULT NULL,
//         version int NOT NULL,
//         name varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
//         PRIMARY KEY (id),
//         UNIQUE KEY IDX_6ba1a54849ae17832337a39d5e (name)
//       ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
//       /*!40101 SET character_set_client = @saved_cs_client */;

//       --
//       -- Dumping data for table courses
//       --

//       LOCK TABLES courses WRITE;
//       /*!40000 ALTER TABLE courses DISABLE KEYS */;
//       /*!40000 ALTER TABLE courses ENABLE KEYS */;
//       UNLOCK TABLES;

//       --
//       -- Table structure for table functionalities
//       --

//       DROP TABLE IF EXISTS functionalities;
//       /*!40101 SET @saved_cs_client     = @@character_set_client */;
//       /*!40101 SET character_set_client = utf8 */;
//       CREATE TABLE functionalities (
//         id varchar(36) COLLATE utf8mb4_spanish_ci NOT NULL,
//         created datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
//         updated datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
//         deleted_at datetime(6) DEFAULT NULL,
//         version int NOT NULL,
//         name varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
//         supraFunctionalityId varchar(36) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
//         PRIMARY KEY (id),
//         KEY FK_904463fded13b638ce208d9062d (supraFunctionalityId),
//         CONSTRAINT FK_904463fded13b638ce208d9062d FOREIGN KEY (supraFunctionalityId) REFERENCES functionalities (id)
//       ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
//       /*!40101 SET character_set_client = @saved_cs_client */;

//       --
//       -- Dumping data for table functionalities
//       --

//       LOCK TABLES functionalities WRITE;
//       /*!40000 ALTER TABLE functionalities DISABLE KEYS */;
//       /*!40000 ALTER TABLE functionalities ENABLE KEYS */;
//       UNLOCK TABLES;

//       --
//       -- Table structure for table functionalities_closure
//       --

//       DROP TABLE IF EXISTS functionalities_closure;
//       /*!40101 SET @saved_cs_client     = @@character_set_client */;
//       /*!40101 SET character_set_client = utf8 */;
//       CREATE TABLE functionalities_closure (
//         id_ancestor varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
//         id_descendant varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
//         PRIMARY KEY (id_ancestor,id_descendant),
//         KEY IDX_d244346d655bfdfe4cf072c98d (id_ancestor),
//         KEY IDX_2c8119a879a285969bc4bceb4a (id_descendant),
//         CONSTRAINT FK_2c8119a879a285969bc4bceb4ad FOREIGN KEY (id_descendant) REFERENCES functionalities (id),
//         CONSTRAINT FK_d244346d655bfdfe4cf072c98de FOREIGN KEY (id_ancestor) REFERENCES functionalities (id)
//       ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
//       /*!40101 SET character_set_client = @saved_cs_client */;

//       --
//       -- Dumping data for table functionalities_closure
//       --

//       LOCK TABLES functionalities_closure WRITE;
//       /*!40000 ALTER TABLE functionalities_closure DISABLE KEYS */;
//       /*!40000 ALTER TABLE functionalities_closure ENABLE KEYS */;
//       UNLOCK TABLES;

//       --
//       -- Table structure for table functionalities_roles
//       --

//       DROP TABLE IF EXISTS functionalities_roles;
//       /*!40101 SET @saved_cs_client     = @@character_set_client */;
//       /*!40101 SET character_set_client = utf8 */;
//       CREATE TABLE functionalities_roles (
//         functionality_id varchar(36) COLLATE utf8mb4_spanish_ci NOT NULL,
//         role_id varchar(36) COLLATE utf8mb4_spanish_ci NOT NULL,
//         PRIMARY KEY (functionality_id,role_id),
//         KEY IDX_85fe744ab2dcf89d042ce82588 (functionality_id),
//         KEY IDX_54a0a268894b61e66e0c2364bd (role_id),
//         CONSTRAINT FK_54a0a268894b61e66e0c2364bdc FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE,
//         CONSTRAINT FK_85fe744ab2dcf89d042ce825881 FOREIGN KEY (functionality_id) REFERENCES functionalities (id) ON DELETE CASCADE
//       ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
//       /*!40101 SET character_set_client = @saved_cs_client */;

//       --
//       -- Dumping data for table functionalities_roles
//       --

//       LOCK TABLES functionalities_roles WRITE;
//       /*!40000 ALTER TABLE functionalities_roles DISABLE KEYS */;
//       /*!40000 ALTER TABLE functionalities_roles ENABLE KEYS */;
//       UNLOCK TABLES;

//       --
//       -- Table structure for table relations
//       --

//       DROP TABLE IF EXISTS relations;
//       /*!40101 SET @saved_cs_client     = @@character_set_client */;
//       /*!40101 SET character_set_client = utf8 */;
//       CREATE TABLE relations (
//         id varchar(36) COLLATE utf8mb4_spanish_ci NOT NULL,
//         created datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
//         updated datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
//         deleted_at datetime(6) DEFAULT NULL,
//         version int NOT NULL,
//         name varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
//         PRIMARY KEY (id),
//         UNIQUE KEY IDX_f8d13fbb01d7809d7344d56400 (name)
//       ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
//       /*!40101 SET character_set_client = @saved_cs_client */;

//       --
//       -- Dumping data for table relations
//       --

//       LOCK TABLES relations WRITE;
//       /*!40000 ALTER TABLE relations DISABLE KEYS */;
//       /*!40000 ALTER TABLE relations ENABLE KEYS */;
//       UNLOCK TABLES;

//       --
//       -- Table structure for table roles
//       --

//       DROP TABLE IF EXISTS roles;
//       /*!40101 SET @saved_cs_client     = @@character_set_client */;
//       /*!40101 SET character_set_client = utf8 */;
//       CREATE TABLE roles (
//         id varchar(36) COLLATE utf8mb4_spanish_ci NOT NULL,
//         created datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
//         updated datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
//         deleted_at datetime(6) DEFAULT NULL,
//         version int NOT NULL,
//         name varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
//         PRIMARY KEY (id)
//       ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
//       /*!40101 SET character_set_client = @saved_cs_client */;

//       --
//       -- Dumping data for table roles
//       --

//       LOCK TABLES roles WRITE;
//       /*!40000 ALTER TABLE roles DISABLE KEYS */;
//       /*!40000 ALTER TABLE roles ENABLE KEYS */;
//       UNLOCK TABLES;

//       --
//       -- Table structure for table users
//       --

//       DROP TABLE IF EXISTS users;
//       /*!40101 SET @saved_cs_client     = @@character_set_client */;
//       /*!40101 SET character_set_client = utf8 */;
//       CREATE TABLE users (
//         id varchar(36) COLLATE utf8mb4_spanish_ci NOT NULL,
//         created datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
//         updated datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
//         deleted_at datetime(6) DEFAULT NULL,
//         version int NOT NULL,
//         balance int DEFAULT NULL,
//         dni varchar(255) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
//         available_copies int DEFAULT NULL,
//         remaining_copies int DEFAULT NULL,
//         type enum('admin','campus','professorship','scholarship','student') COLLATE utf8mb4_spanish_ci NOT NULL,
//         course_id varchar(36) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
//         campus_id varchar(36) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
//         PRIMARY KEY (id),
//         KEY IDX_94e2000b5f7ee1f9c491f0f8a8 (type),
//         KEY FK_af2518518efa1699a1a24903de9 (course_id),
//         KEY FK_5156575a338031523af209fa4c8 (campus_id),
//         CONSTRAINT FK_5156575a338031523af209fa4c8 FOREIGN KEY (campus_id) REFERENCES campus (id),
//         CONSTRAINT FK_af2518518efa1699a1a24903de9 FOREIGN KEY (course_id) REFERENCES courses (id)
//       ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
//       /*!40101 SET character_set_client = @saved_cs_client */;

//       --
//       -- Dumping data for table users
//       --

//       LOCK TABLES users WRITE;
//       /*!40000 ALTER TABLE users DISABLE KEYS */;
//       /*!40000 ALTER TABLE users ENABLE KEYS */;
//       UNLOCK TABLES;

//       --
//       -- Table structure for table users_roles
//       --

//       DROP TABLE IF EXISTS users_roles;
//       /*!40101 SET @saved_cs_client     = @@character_set_client */;
//       /*!40101 SET character_set_client = utf8 */;
//       CREATE TABLE users_roles (
//         user_id varchar(36) COLLATE utf8mb4_spanish_ci NOT NULL,
//         role_id varchar(36) COLLATE utf8mb4_spanish_ci NOT NULL,
//         PRIMARY KEY (user_id,role_id),
//         KEY IDX_e4435209df12bc1f001e536017 (user_id),
//         KEY IDX_1cf664021f00b9cc1ff95e17de (role_id),
//         CONSTRAINT FK_1cf664021f00b9cc1ff95e17de4 FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE,
//         CONSTRAINT FK_e4435209df12bc1f001e5360174 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
//       ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
//       /*!40101 SET character_set_client = @saved_cs_client */;

//       --
//       -- Dumping data for table users_roles
//       --

//       LOCK TABLES users_roles WRITE;
//       /*!40000 ALTER TABLE users_roles DISABLE KEYS */;
//       /*!40000 ALTER TABLE users_roles ENABLE KEYS */;
//       UNLOCK TABLES;

//       --
//       -- Dumping routines for database 'icei'
//       --
//       /*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

//       /*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
//       /*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
//       /*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
//       /*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
//       /*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
//       /*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
//       /*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

//       -- Dump completed on 2020-08-11  9:07:22
//     `);
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {}
// }
