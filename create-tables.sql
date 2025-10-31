-- Manual SQL script to create all tables for MAHI app
-- Run this in Railway MySQL database console

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  openId VARCHAR(64) UNIQUE,
  name TEXT,
  email VARCHAR(320),
  loginMethod VARCHAR(64),
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  password TEXT,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  lastSignedIn TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS kids (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name TEXT NOT NULL,
  birthday TIMESTAMP NOT NULL,
  pocket_money_amount DECIMAL(10, 2) NOT NULL,
  pocket_money_frequency ENUM('daily', 'weekly', 'monthly') NOT NULL,
  avatar_color VARCHAR(7) NOT NULL DEFAULT '#4F46E5',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS chores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  payment_amount DECIMAL(10, 2) NOT NULL,
  frequency ENUM('daily', 'weekly', 'monthly') NOT NULL,
  chore_type ENUM('shared', 'individual') NOT NULL,
  is_pre_populated BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS chore_assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  chore_id INT NOT NULL,
  kid_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chore_id) REFERENCES chores(id) ON DELETE CASCADE,
  FOREIGN KEY (kid_id) REFERENCES kids(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  chore_id INT NOT NULL,
  kid_id INT NOT NULL,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  time_to_complete INT,
  photo_url TEXT,
  amount_earned DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chore_id) REFERENCES chores(id) ON DELETE CASCADE,
  FOREIGN KEY (kid_id) REFERENCES kids(id) ON DELETE CASCADE
);
