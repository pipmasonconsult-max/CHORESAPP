-- Drop all tables to allow fresh migration with correct column types
-- Run this in Railway MySQL database before deploying new version

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `tasks`;
DROP TABLE IF EXISTS `chore_assignments`;
DROP TABLE IF EXISTS `chores`;
DROP TABLE IF EXISTS `kids`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `__drizzle_migrations`;

SET FOREIGN_KEY_CHECKS = 1;
