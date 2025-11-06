CREATE TABLE `chore_assignments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`chore_id` int NOT NULL,
	`kid_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chore_assignments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`payment_amount` decimal(10,2) NOT NULL,
	`frequency` enum('daily','weekly','monthly') NOT NULL,
	`chore_type` enum('shared','individual') NOT NULL,
	`is_pre_populated` boolean NOT NULL DEFAULT false,
	`start_hour` int NOT NULL DEFAULT 0,
	`end_hour` int NOT NULL DEFAULT 23,
	`difficulty` enum('easy','medium','hard') NOT NULL DEFAULT 'medium',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `kids` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`name` text NOT NULL,
	`birthday` timestamp NOT NULL,
	`pocket_money_amount` decimal(10,2) NOT NULL,
	`pocket_money_frequency` enum('daily','weekly','monthly') NOT NULL,
	`avatar_color` varchar(7) NOT NULL DEFAULT '#4F46E5',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `kids_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`chore_id` int NOT NULL,
	`kid_id` int NOT NULL,
	`started_at` timestamp,
	`completed_at` timestamp,
	`time_to_complete` int,
	`photo_url` text,
	`amount_earned` decimal(10,2) NOT NULL,
	`approved` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64),
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`password` text,
	`timezone` varchar(64) DEFAULT 'America/New_York',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
ALTER TABLE `chore_assignments` ADD CONSTRAINT `chore_assignments_chore_id_chores_id_fk` FOREIGN KEY (`chore_id`) REFERENCES `chores`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chore_assignments` ADD CONSTRAINT `chore_assignments_kid_id_kids_id_fk` FOREIGN KEY (`kid_id`) REFERENCES `kids`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chores` ADD CONSTRAINT `chores_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `kids` ADD CONSTRAINT `kids_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_chore_id_chores_id_fk` FOREIGN KEY (`chore_id`) REFERENCES `chores`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_kid_id_kids_id_fk` FOREIGN KEY (`kid_id`) REFERENCES `kids`(`id`) ON DELETE no action ON UPDATE no action;