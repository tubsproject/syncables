--
-- Slack Web API.
-- Prepared SQL queries for 'migration_exchange_success_schema' definition.
--


--
-- SELECT template for table `migration_exchange_success_schema`
--
SELECT `enterprise_id`, `invalid_user_ids`, `ok`, `team_id`, `user_id_map` FROM `migration_exchange_success_schema` WHERE 1;

--
-- INSERT template for table `migration_exchange_success_schema`
--
INSERT INTO `migration_exchange_success_schema`(`enterprise_id`, `invalid_user_ids`, `ok`, `team_id`, `user_id_map`) VALUES (?, ?, ?, ?, ?);

--
-- UPDATE template for table `migration_exchange_success_schema`
--
UPDATE `migration_exchange_success_schema` SET `enterprise_id` = ?, `invalid_user_ids` = ?, `ok` = ?, `team_id` = ?, `user_id_map` = ? WHERE 1;

--
-- DELETE template for table `migration_exchange_success_schema`
--
DELETE FROM `migration_exchange_success_schema` WHERE 0;

