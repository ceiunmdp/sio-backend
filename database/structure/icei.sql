-- MySQL Script generated by MySQL Workbench
-- Tue Jul 28 18:40:33 2020
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema icei
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `icei` ;

-- -----------------------------------------------------
-- Schema icei
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `icei` ;
USE `icei` ;

-- -----------------------------------------------------
-- Table `icei`.`roles`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `icei`.`roles` ;

CREATE TABLE IF NOT EXISTS `icei`.`roles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(25) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `icei`.`users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `icei`.`users` ;

CREATE TABLE IF NOT EXISTS `icei`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `role_id` INT NOT NULL,
  `type` TINYINT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `icei`.`campuses`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `icei`.`campuses` ;

CREATE TABLE IF NOT EXISTS `icei`.`campuses` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(25) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `icei`.`orders`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `icei`.`orders` ;

CREATE TABLE IF NOT EXISTS `icei`.`orders` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `campus_id` INT NOT NULL,
  `amount_paid` DECIMAL(6,2) NOT NULL,
  `total` DECIMAL(6,2) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `icei`.`states`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `icei`.`states` ;

CREATE TABLE IF NOT EXISTS `icei`.`states` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(25) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `icei`.`careers`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `icei`.`careers` ;

CREATE TABLE IF NOT EXISTS `icei`.`careers` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

CREATE UNIQUE INDEX `name_UNIQUE` ON `icei`.`careers` (`name` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `icei`.`configurations`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `icei`.`configurations` ;

CREATE TABLE IF NOT EXISTS `icei`.`configurations` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `double_sided` TINYINT(1) NOT NULL,
  `slides_per_sheet` SMALLINT NOT NULL,
  `colour` TINYINT(1) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `icei`.`items`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `icei`.`items` ;

CREATE TABLE IF NOT EXISTS `icei`.`items` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(64) NOT NULL,
  `price` DECIMAL(6,2) NOT NULL,
  `type` TINYINT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `icei`.`bindings`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `icei`.`bindings` ;

CREATE TABLE IF NOT EXISTS `icei`.`bindings` (
  `id` INT NOT NULL,
  `sheets_limit` SMALLINT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `icei`.`binding_groups`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `icei`.`binding_groups` ;

CREATE TABLE IF NOT EXISTS `icei`.`binding_groups` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `item_id` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `icei`.`files`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `icei`.`files` ;

CREATE TABLE IF NOT EXISTS `icei`.`files` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `extension` VARCHAR(45) NULL,
  `number_of_sheets` SMALLINT NOT NULL,
  `type` TINYINT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `icei`.`orders_files`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `icei`.`orders_files` ;

CREATE TABLE IF NOT EXISTS `icei`.`orders_files` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `order_id` INT NOT NULL,
  `file_id` INT NOT NULL,
  `state_id` INT NOT NULL,
  `configuration_id` INT NOT NULL,
  `binding_group_id` INT NULL,
  `order` TINYINT NULL,
  `total` DECIMAL(6,2) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `icei`.`notification_types`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `icei`.`notification_types` ;

CREATE TABLE IF NOT EXISTS `icei`.`notification_types` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `description` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `icei`.`notifications`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `icei`.`notifications` ;

CREATE TABLE IF NOT EXISTS `icei`.`notifications` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `notification_type_id` INT NOT NULL,
  `message` VARCHAR(128) NOT NULL,
  `date` DATETIME NOT NULL,
  `type` TINYINT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `icei`.`movement_types`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `icei`.`movement_types` ;

CREATE TABLE IF NOT EXISTS `icei`.`movement_types` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '	',
  `description` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `icei`.`movements`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `icei`.`movements` ;

CREATE TABLE IF NOT EXISTS `icei`.`movements` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `source_user_id` INT NOT NULL,
  `taget_user_id` INT NOT NULL,
  `movement_type_id` INT NOT NULL,
  `amount` DECIMAL(6,2) NOT NULL,
  `date` DATETIME NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `icei`.`courses`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `icei`.`courses` ;

CREATE TABLE IF NOT EXISTS `icei`.`courses` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

CREATE UNIQUE INDEX `name_UNIQUE` ON `icei`.`courses` (`name` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `icei`.`relations`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `icei`.`relations` ;

CREATE TABLE IF NOT EXISTS `icei`.`relations` (
  `id` INT NOT NULL,
  `name` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

CREATE UNIQUE INDEX `name_UNIQUE` ON `icei`.`relations` (`name` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `icei`.`careers_courses`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `icei`.`careers_courses` ;

CREATE TABLE IF NOT EXISTS `icei`.`careers_courses` (
  `career_id` INT NOT NULL,
  `course_id` INT NOT NULL,
  `relation_id` INT NOT NULL,
  PRIMARY KEY (`career_id`, `course_id`, `relation_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `icei`.`system_files`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `icei`.`system_files` ;

CREATE TABLE IF NOT EXISTS `icei`.`system_files` (
  `file_id` INT NOT NULL,
  `course_id` INT NOT NULL,
  PRIMARY KEY (`file_id`, `course_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `icei`.`uploaded_files`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `icei`.`uploaded_files` ;

CREATE TABLE IF NOT EXISTS `icei`.`uploaded_files` (
  `file_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`file_id`, `user_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `icei`.`campus_users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `icei`.`campus_users` ;

CREATE TABLE IF NOT EXISTS `icei`.`campus_users` (
  `id` INT NOT NULL,
  `campus_id` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `icei`.`students`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `icei`.`students` ;

CREATE TABLE IF NOT EXISTS `icei`.`students` (
  `id` INT NOT NULL,
  `dni` VARCHAR(24) NOT NULL,
  `balance` DECIMAL(6,2) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

CREATE UNIQUE INDEX `dni_UNIQUE` ON `icei`.`students` (`dni` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `icei`.`professorships`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `icei`.`professorships` ;

CREATE TABLE IF NOT EXISTS `icei`.`professorships` (
  `id` INT NOT NULL,
  `course_id` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `icei`.`scholarship_list`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `icei`.`scholarship_list` ;

CREATE TABLE IF NOT EXISTS `icei`.`scholarship_list` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `dni` VARCHAR(24) NOT NULL,
  `name` VARCHAR(64) NOT NULL,
  `surname` VARCHAR(64) NOT NULL,
  `available_copies` SMALLINT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

CREATE UNIQUE INDEX `dni_UNIQUE` ON `icei`.`scholarship_list` (`dni` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `icei`.`scholarship_students`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `icei`.`scholarship_students` ;

CREATE TABLE IF NOT EXISTS `icei`.`scholarship_students` (
  `id` INT NOT NULL,
  `scholarship_list_id` INT NOT NULL,
  `available_copies` SMALLINT NOT NULL,
  `remaining_copies` SMALLINT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `icei`.`orders_states`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `icei`.`orders_states` ;

CREATE TABLE IF NOT EXISTS `icei`.`orders_states` (
  `order_id` INT NOT NULL,
  `state_id` INT NOT NULL,
  `date` DATETIME NOT NULL,
  PRIMARY KEY (`order_id`, `state_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `icei`.`physical_files`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `icei`.`physical_files` ;

CREATE TABLE IF NOT EXISTS `icei`.`physical_files` (
  `file_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`file_id`, `user_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `icei`.`notification_requests`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `icei`.`notification_requests` ;

CREATE TABLE IF NOT EXISTS `icei`.`notification_requests` (
  `notification_id` INT NOT NULL,
  `order_id` INT NOT NULL,
  PRIMARY KEY (`notification_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `icei`.`modules`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `icei`.`modules` ;

CREATE TABLE IF NOT EXISTS `icei`.`modules` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(25) NOT NULL,
  `module_id` INT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `icei`.`functionalities`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `icei`.`functionalities` ;

CREATE TABLE IF NOT EXISTS `icei`.`functionalities` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `code` VARCHAR(25) NOT NULL,
  `module_id` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

CREATE UNIQUE INDEX `ruta_UNIQUE` ON `icei`.`functionalities` (`code` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `icei`.`functionalities_roles`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `icei`.`functionalities_roles` ;

CREATE TABLE IF NOT EXISTS `icei`.`functionalities_roles` (
  `functionality_id` INT NOT NULL,
  `role_id` INT NOT NULL,
  PRIMARY KEY (`functionality_id`, `role_id`))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
