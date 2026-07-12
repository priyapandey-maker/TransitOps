-- ==========================================
-- TransitOps ERP - Database Seeder (MySQL 8)
-- ==========================================
-- This script populates the initial required data.
-- Run this script AFTER running schema.sql

-- 1. Insert Base Roles
INSERT IGNORE INTO `roles` (`id`, `name`) VALUES 
(1, 'Admin'),
(2, 'Fleet Manager'),
(3, 'Dispatcher'),
(4, 'Safety Officer'),
(5, 'Financial Analyst');

-- 2. Insert Default Admin User
-- Password: Admin@123
-- Hash generated via bcrypt with salt rounds = 10
INSERT IGNORE INTO `users` (`id`, `role_id`, `first_name`, `last_name`, `email`, `password_hash`, `status`) VALUES 
(1, 1, 'System', 'Admin', 'admin@transitops.local', '$2b$10$jYyajMxALyFD7D53kwUMluUTIUcC9kaS/v4AyM7Gr8EdBKikRJG.a', 'Active');
