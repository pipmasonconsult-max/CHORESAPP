CREATE TABLE IF NOT EXISTS `earning_periods` (
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
ALTER TABLE `kids` ADD COLUMN IF NOT EXISTS `net_wealth` decimal(10,2) DEFAULT '0' NOT NULL;
--> statement-breakpoint
ALTER TABLE `tasks` ADD COLUMN IF NOT EXISTS `approved` boolean DEFAULT false NOT NULL;
