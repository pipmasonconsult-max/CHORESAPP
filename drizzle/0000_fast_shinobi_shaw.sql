CREATE TABLE `achievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`kid_id` int NOT NULL,
	`type` enum('hours_milestone','earnings_milestone','streak','investment_return','savings_goal') NOT NULL,
	`name` varchar(200) NOT NULL,
	`description` text,
	`value` decimal(10,2) NOT NULL,
	`unlocked_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `achievements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `automatic_transfers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`kid_id` int NOT NULL,
	`source_account_id` int NOT NULL,
	`destination_account_id` int NOT NULL,
	`transfer_type` enum('fixed','percentage') NOT NULL,
	`amount` decimal(10,2),
	`percentage` decimal(5,2),
	`frequency` enum('daily','weekly','biweekly','monthly') NOT NULL,
	`start_date` timestamp NOT NULL,
	`end_date` timestamp,
	`last_executed_at` timestamp,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `automatic_transfers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bank_accounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`kid_id` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`account_type` enum('main','savings','investment','custom') NOT NULL,
	`balance` decimal(10,2) NOT NULL DEFAULT '0.00',
	`icon` varchar(50),
	`color` varchar(20),
	`goal_amount` decimal(10,2),
	`is_protected` boolean NOT NULL DEFAULT false,
	`sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bank_accounts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chore_assignments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`chore_id` int NOT NULL,
	`kid_id` int,
	`assigned_by` int NOT NULL,
	`assigned_at` timestamp NOT NULL DEFAULT (now()),
	`is_active` boolean NOT NULL DEFAULT true,
	CONSTRAINT `chore_assignments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`payment_amount` decimal(10,2) NOT NULL,
	`frequency` enum('daily','weekly','monthly') NOT NULL,
	`time_window` enum('morning','day','afternoon','evening','anytime') NOT NULL DEFAULT 'anytime',
	`difficulty` enum('easy','medium','hard') NOT NULL,
	`chore_type` enum('individual','first_come') NOT NULL DEFAULT 'individual',
	`estimated_minutes` int NOT NULL DEFAULT 15,
	`is_pre_populated` boolean NOT NULL DEFAULT false,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `investment_options` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`interest_rate` decimal(5,2) NOT NULL,
	`rate_frequency` enum('daily','weekly','monthly','yearly') NOT NULL,
	`compound_frequency` enum('daily','weekly','monthly') NOT NULL DEFAULT 'daily',
	`risk_level` enum('low','medium','high') NOT NULL,
	`minimum_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
	`is_active` boolean NOT NULL DEFAULT true,
	`sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `investment_options_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `investments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`kid_id` int NOT NULL,
	`account_id` int NOT NULL,
	`option_id` int NOT NULL,
	`principal_amount` decimal(10,2) NOT NULL,
	`current_value` decimal(10,2) NOT NULL,
	`total_gains` decimal(10,2) NOT NULL DEFAULT '0.00',
	`start_date` timestamp NOT NULL,
	`maturity_date` timestamp,
	`withdrawn_at` timestamp,
	`status` enum('active','matured','withdrawn') NOT NULL DEFAULT 'active',
	`last_calculated_at` timestamp NOT NULL DEFAULT (now()),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `investments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `kids` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`name` text NOT NULL,
	`birthday` timestamp NOT NULL,
	`avatar_color` varchar(20) NOT NULL DEFAULT '#EC4899',
	`pocket_money_amount` decimal(10,2) NOT NULL DEFAULT '10.00',
	`pocket_money_frequency` enum('daily','weekly','biweekly','monthly') NOT NULL DEFAULT 'weekly',
	`payout_frequency` enum('weekly','biweekly','monthly') NOT NULL DEFAULT 'weekly',
	`payout_day` int NOT NULL DEFAULT 5,
	`last_payout_date` timestamp,
	`auto_payout_enabled` boolean NOT NULL DEFAULT true,
	`savings_percentage` decimal(5,2) NOT NULL DEFAULT '10.00',
	`auto_savings_enabled` boolean NOT NULL DEFAULT true,
	`current_earnings` decimal(10,2) NOT NULL DEFAULT '0.00',
	`total_hours_worked` decimal(10,2) NOT NULL DEFAULT '0.00',
	`preferred_music` varchar(50) DEFAULT 'lets_go',
	`music_volume` int NOT NULL DEFAULT 70,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `kids_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payout_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`kid_id` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`savings_amount` decimal(10,2) NOT NULL,
	`main_account_amount` decimal(10,2) NOT NULL,
	`payout_type` enum('standard','invested','custom_split') NOT NULL,
	`period_start` timestamp NOT NULL,
	`period_end` timestamp NOT NULL,
	`paid_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `payout_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`chore_id` int NOT NULL,
	`kid_id` int NOT NULL,
	`status` enum('in_progress','pending_approval','approved','rejected') NOT NULL DEFAULT 'in_progress',
	`started_at` timestamp NOT NULL,
	`completed_at` timestamp,
	`approved_at` timestamp,
	`time_to_complete` int,
	`time_spent_minutes` int,
	`earnings_amount` decimal(10,2),
	`photo_url` text,
	`rejection_reason` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `time_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`kid_id` int NOT NULL,
	`task_id` int,
	`date` timestamp NOT NULL,
	`hours_worked` decimal(5,2) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `time_entries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`kid_id` int NOT NULL,
	`account_id` int NOT NULL,
	`type` enum('credit','debit','transfer_in','transfer_out','payout','investment_gain','chore_earning') NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`balance_after` decimal(10,2) NOT NULL,
	`description` text,
	`related_transaction_id` int,
	`related_task_id` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`google_id` varchar(255),
	`email` varchar(320) NOT NULL,
	`name` text NOT NULL,
	`profile_picture` text,
	`openId` varchar(64),
	`loginMethod` varchar(64),
	`username` varchar(50),
	`password_hash` varchar(255),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`timezone` varchar(50) NOT NULL DEFAULT 'America/New_York',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_google_id_unique` UNIQUE(`google_id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`),
	CONSTRAINT `users_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
ALTER TABLE `achievements` ADD CONSTRAINT `achievements_kid_id_kids_id_fk` FOREIGN KEY (`kid_id`) REFERENCES `kids`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `automatic_transfers` ADD CONSTRAINT `automatic_transfers_kid_id_kids_id_fk` FOREIGN KEY (`kid_id`) REFERENCES `kids`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `automatic_transfers` ADD CONSTRAINT `automatic_transfers_source_account_id_bank_accounts_id_fk` FOREIGN KEY (`source_account_id`) REFERENCES `bank_accounts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `automatic_transfers` ADD CONSTRAINT `automatic_transfers_destination_account_id_bank_accounts_id_fk` FOREIGN KEY (`destination_account_id`) REFERENCES `bank_accounts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bank_accounts` ADD CONSTRAINT `bank_accounts_kid_id_kids_id_fk` FOREIGN KEY (`kid_id`) REFERENCES `kids`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chore_assignments` ADD CONSTRAINT `chore_assignments_chore_id_chores_id_fk` FOREIGN KEY (`chore_id`) REFERENCES `chores`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chore_assignments` ADD CONSTRAINT `chore_assignments_kid_id_kids_id_fk` FOREIGN KEY (`kid_id`) REFERENCES `kids`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chore_assignments` ADD CONSTRAINT `chore_assignments_assigned_by_users_id_fk` FOREIGN KEY (`assigned_by`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chores` ADD CONSTRAINT `chores_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `investment_options` ADD CONSTRAINT `investment_options_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `investments` ADD CONSTRAINT `investments_kid_id_kids_id_fk` FOREIGN KEY (`kid_id`) REFERENCES `kids`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `investments` ADD CONSTRAINT `investments_account_id_bank_accounts_id_fk` FOREIGN KEY (`account_id`) REFERENCES `bank_accounts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `investments` ADD CONSTRAINT `investments_option_id_investment_options_id_fk` FOREIGN KEY (`option_id`) REFERENCES `investment_options`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `kids` ADD CONSTRAINT `kids_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payout_history` ADD CONSTRAINT `payout_history_kid_id_kids_id_fk` FOREIGN KEY (`kid_id`) REFERENCES `kids`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_chore_id_chores_id_fk` FOREIGN KEY (`chore_id`) REFERENCES `chores`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_kid_id_kids_id_fk` FOREIGN KEY (`kid_id`) REFERENCES `kids`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `time_entries` ADD CONSTRAINT `time_entries_kid_id_kids_id_fk` FOREIGN KEY (`kid_id`) REFERENCES `kids`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `time_entries` ADD CONSTRAINT `time_entries_task_id_tasks_id_fk` FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_kid_id_kids_id_fk` FOREIGN KEY (`kid_id`) REFERENCES `kids`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_account_id_bank_accounts_id_fk` FOREIGN KEY (`account_id`) REFERENCES `bank_accounts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `kid_id_idx` ON `achievements` (`kid_id`);--> statement-breakpoint
CREATE INDEX `kid_id_idx` ON `automatic_transfers` (`kid_id`);--> statement-breakpoint
CREATE INDEX `kid_id_idx` ON `bank_accounts` (`kid_id`);--> statement-breakpoint
CREATE INDEX `chore_id_idx` ON `chore_assignments` (`chore_id`);--> statement-breakpoint
CREATE INDEX `kid_id_idx` ON `chore_assignments` (`kid_id`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `chores` (`user_id`);--> statement-breakpoint
CREATE INDEX `frequency_idx` ON `chores` (`frequency`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `investment_options` (`user_id`);--> statement-breakpoint
CREATE INDEX `kid_id_idx` ON `investments` (`kid_id`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `investments` (`status`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `kids` (`user_id`);--> statement-breakpoint
CREATE INDEX `kid_id_idx` ON `payout_history` (`kid_id`);--> statement-breakpoint
CREATE INDEX `paid_at_idx` ON `payout_history` (`paid_at`);--> statement-breakpoint
CREATE INDEX `kid_id_idx` ON `tasks` (`kid_id`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `tasks` (`status`);--> statement-breakpoint
CREATE INDEX `completed_at_idx` ON `tasks` (`completed_at`);--> statement-breakpoint
CREATE INDEX `kid_id_idx` ON `time_entries` (`kid_id`);--> statement-breakpoint
CREATE INDEX `date_idx` ON `time_entries` (`date`);--> statement-breakpoint
CREATE INDEX `kid_id_idx` ON `transactions` (`kid_id`);--> statement-breakpoint
CREATE INDEX `account_id_idx` ON `transactions` (`account_id`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `transactions` (`created_at`);--> statement-breakpoint
CREATE INDEX `google_id_idx` ON `users` (`google_id`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `users` (`email`);