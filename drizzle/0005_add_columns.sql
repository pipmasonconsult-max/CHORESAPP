-- Add net_wealth to kids table
ALTER TABLE `kids` ADD COLUMN `net_wealth` decimal(10,2) DEFAULT '0' NOT NULL;

-- Add approved to tasks table  
ALTER TABLE `tasks` ADD COLUMN `approved` boolean DEFAULT false NOT NULL;
