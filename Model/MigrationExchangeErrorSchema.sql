--
-- Slack Web API.
-- Prepared SQL queries for 'migration_exchange_error_schema' definition.
--


--
-- SELECT template for table `migration_exchange_error_schema`
--
SELECT `callstack`, `error`, `ok` FROM `migration_exchange_error_schema` WHERE 1;

--
-- INSERT template for table `migration_exchange_error_schema`
--
INSERT INTO `migration_exchange_error_schema`(`callstack`, `error`, `ok`) VALUES (?, ?, ?);

--
-- UPDATE template for table `migration_exchange_error_schema`
--
UPDATE `migration_exchange_error_schema` SET `callstack` = ?, `error` = ?, `ok` = ? WHERE 1;

--
-- DELETE template for table `migration_exchange_error_schema`
--
DELETE FROM `migration_exchange_error_schema` WHERE 0;

