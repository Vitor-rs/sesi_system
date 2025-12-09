CREATE TABLE `activities` (
	`id` text PRIMARY KEY NOT NULL,
	`assessment_id` text NOT NULL,
	`name` text NOT NULL,
	`date_assigned` text,
	`date_due` text,
	`description` text,
	`max_value` real DEFAULT 1,
	FOREIGN KEY (`assessment_id`) REFERENCES `assessments`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `assessments` (
	`id` text PRIMARY KEY NOT NULL,
	`class_discipline_id` text NOT NULL,
	`bimester` integer NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`grade` real DEFAULT 10 NOT NULL,
	`max_points` real DEFAULT 10 NOT NULL,
	`date` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`class_discipline_id`) REFERENCES `class_disciplines`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `class_disciplines` (
	`id` text PRIMARY KEY NOT NULL,
	`class_id` text NOT NULL,
	`discipline_id` text NOT NULL,
	`teacher_name` text,
	FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`discipline_id`) REFERENCES `disciplines`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `disciplines` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `formative_templates` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`default_max_points` real NOT NULL,
	`is_generic` integer DEFAULT true,
	`discipline_id` text,
	FOREIGN KEY (`discipline_id`) REFERENCES `disciplines`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `grades` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`assessment_id` text,
	`activity_id` text,
	`value` real,
	`status` text DEFAULT 'present',
	`feedback` text,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`assessment_id`) REFERENCES `assessments`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`activity_id`) REFERENCES `activities`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_student_history` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`type` text NOT NULL,
	`date` text NOT NULL,
	`description` text NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_student_history`("id", "student_id", "type", "date", "description") SELECT "id", "student_id", "type", "date", "description" FROM `student_history`;--> statement-breakpoint
DROP TABLE `student_history`;--> statement-breakpoint
ALTER TABLE `__new_student_history` RENAME TO `student_history`;--> statement-breakpoint
PRAGMA foreign_keys=ON;