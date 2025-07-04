--
-- Slack Web API.
-- Prepared SQL queries for 'admin_conversations_unarchive_error_schema_2' definition.
--


--
-- SELECT template for table `admin_conversations_unarchive_error_schema_2`
--
SELECT `error`, `ok` FROM `admin_conversations_unarchive_error_schema_2` WHERE 1;

--
-- INSERT template for table `admin_conversations_unarchive_error_schema_2`
--
INSERT INTO `admin_conversations_unarchive_error_schema_2`(`error`, `ok`) VALUES (?, ?);

--
-- UPDATE template for table `admin_conversations_unarchive_error_schema_2`
--
UPDATE `admin_conversations_unarchive_error_schema_2` SET `error` = ?, `ok` = ? WHERE 1;

--
-- DELETE template for table `admin_conversations_unarchive_error_schema_2`
--
DELETE FROM `admin_conversations_unarchive_error_schema_2` WHERE 0;

