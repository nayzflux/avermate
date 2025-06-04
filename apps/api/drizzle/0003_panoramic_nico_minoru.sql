CREATE TABLE `card_layouts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`page` text NOT NULL,
	`cards` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `card_templates` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`identifier` text NOT NULL,
	`config` text NOT NULL,
	`user_id` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `accounts` (`user_id`);--> statement-breakpoint
CREATE INDEX `account_id_provider_id_idx` ON `accounts` (`account_id`,`provider_id`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `custom_averages` (`user_id`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `grades` (`user_id`);--> statement-breakpoint
CREATE INDEX `subject_id_idx` ON `grades` (`subject_id`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `periods` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_unique` ON `sessions` (`token`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `subjects` (`user_id`);