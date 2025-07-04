--
-- Slack Web API.
-- Prepared SQL queries for 'users_list_schema' definition.
--


--
-- SELECT template for table `users_list_schema`
--
SELECT `cache_ts`, `members`, `ok`, `response_metadata` FROM `users_list_schema` WHERE 1;

--
-- INSERT template for table `users_list_schema`
--
INSERT INTO `users_list_schema`(`cache_ts`, `members`, `ok`, `response_metadata`) VALUES (?, ?, ?, ?);

--
-- UPDATE template for table `users_list_schema`
--
UPDATE `users_list_schema` SET `cache_ts` = ?, `members` = ?, `ok` = ?, `response_metadata` = ? WHERE 1;

--
-- DELETE template for table `users_list_schema`
--
DELETE FROM `users_list_schema` WHERE 0;

