CREATE TABLE `city` (
	`id` varchar(36) NOT NULL,
	`name` text NOT NULL,
	`created_at` timestamp NOT NULL,
	`updated_at` timestamp NOT NULL,
	CONSTRAINT `city_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `energy_data` (
	`id` varchar(36) NOT NULL,
	`city_id` varchar(36) NOT NULL,
	`network_manager_id` varchar(36) NOT NULL,
	`purchase_area` text NOT NULL,
	`street` text NOT NULL,
	`zip_code_from` varchar(6) NOT NULL,
	`zip_code_to` varchar(6) NOT NULL,
	`num_connections` float NOT NULL,
	`delivery_perc` float NOT NULL,
	`perc_of_active_connections` float NOT NULL,
	`type_of_connection` text NOT NULL,
	`type_conn_perc` float NOT NULL,
	`annual_consume` float NOT NULL,
	`annual_consume_lowtarif_perc` float NOT NULL,
	`smartmeter_perc` float NOT NULL,
	`type` text NOT NULL,
	CONSTRAINT `energy_data_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `network_manager` (
	`id` varchar(36) NOT NULL,
	`name` text NOT NULL,
	`created_at` timestamp NOT NULL,
	`updated_at` timestamp NOT NULL,
	CONSTRAINT `network_manager_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `energy_data` ADD CONSTRAINT `energy_data_city_id_city_id_fk` FOREIGN KEY (`city_id`) REFERENCES `city`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `energy_data` ADD CONSTRAINT `energy_data_network_manager_id_network_manager_id_fk` FOREIGN KEY (`network_manager_id`) REFERENCES `network_manager`(`id`) ON DELETE cascade ON UPDATE no action;