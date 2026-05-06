ALTER TABLE contacts ADD COLUMN status ENUM('pending', 'read', 'replied') NOT NULL DEFAULT 'pending';
