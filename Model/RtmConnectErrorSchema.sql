--
-- Slack Web API.
-- Prepared SQL queries for 'rtm_connect_error_schema' definition.
--


--
-- SELECT template for table `rtm_connect_error_schema`
--
SELECT `callstack`, `error`, `ok` FROM `rtm_connect_error_schema` WHERE 1;

--
-- INSERT template for table `rtm_connect_error_schema`
--
INSERT INTO `rtm_connect_error_schema`(`callstack`, `error`, `ok`) VALUES (?, ?, ?);

--
-- UPDATE template for table `rtm_connect_error_schema`
--
UPDATE `rtm_connect_error_schema` SET `callstack` = ?, `error` = ?, `ok` = ? WHERE 1;

--
-- DELETE template for table `rtm_connect_error_schema`
--
DELETE FROM `rtm_connect_error_schema` WHERE 0;

