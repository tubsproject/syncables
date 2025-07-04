--
-- Slack Web API.
-- Prepared SQL queries for 'bots_info_error_schema' definition.
--


--
-- SELECT template for table `bots_info_error_schema`
--
SELECT `callstack`, `error`, `ok` FROM `bots_info_error_schema` WHERE 1;

--
-- INSERT template for table `bots_info_error_schema`
--
INSERT INTO `bots_info_error_schema`(`callstack`, `error`, `ok`) VALUES (?, ?, ?);

--
-- UPDATE template for table `bots_info_error_schema`
--
UPDATE `bots_info_error_schema` SET `callstack` = ?, `error` = ?, `ok` = ? WHERE 1;

--
-- DELETE template for table `bots_info_error_schema`
--
DELETE FROM `bots_info_error_schema` WHERE 0;

