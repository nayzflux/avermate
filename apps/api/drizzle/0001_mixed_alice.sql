CREATE TABLE `custom_averages` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`subjects` text NOT NULL,
	`user_id` text NOT NULL,
	`is_main_average` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE cascade ON DELETE cascade
);
