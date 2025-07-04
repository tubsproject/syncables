--
-- Slack Web API.
-- Prepared SQL queries for 'dnd_endDnd_error_schema' definition.
--


--
-- SELECT template for table `dnd_endDnd_error_schema`
--
SELECT `callstack`, `error`, `ok` FROM `dnd_endDnd_error_schema` WHERE 1;

--
-- INSERT template for table `dnd_endDnd_error_schema`
--
INSERT INTO `dnd_endDnd_error_schema`(`callstack`, `error`, `ok`) VALUES (?, ?, ?);

--
-- UPDATE template for table `dnd_endDnd_error_schema`
--
UPDATE `dnd_endDnd_error_schema` SET `callstack` = ?, `error` = ?, `ok` = ? WHERE 1;

--
-- DELETE template for table `dnd_endDnd_error_schema`
--
DELETE FROM `dnd_endDnd_error_schema` WHERE 0;

