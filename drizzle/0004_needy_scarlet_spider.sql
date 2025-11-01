CREATE TABLE `earning_periods` (
	`id` int AUTO_INCREMENT NOT NULL,
	`kid_id` int NOT NULL,
	`total_earned` decimal(10,2) NOT NULL,
	`tasks_completed` int NOT NULL,
	`period_start` timestamp NOT NULL,
	`period_end` timestamp NOT NULL,
	`task_breakdown` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `earning_periods_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `kids` MODIFY COLUMN `name` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `kids` MODIFY COLUMN `birthday` date NOT NULL;--> statement-breakpoint
ALTER TABLE `kids` MODIFY COLUMN `avatar_color` varchar(7) NOT NULL;--> statement-breakpoint
ALTER TABLE `kids` ADD `net_wealth` decimal(10,2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE `earning_periods` ADD CONSTRAINT `earning_periods_kid_id_kids_id_fk` FOREIGN KEY (`kid_id`) REFERENCES `kids`(`id`) ON DELETE no action ON UPDATE no action;