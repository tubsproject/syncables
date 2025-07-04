--
-- Slack Web API.
-- Prepared SQL queries for 'conversations_open_success_schema' definition.
--


--
-- SELECT template for table `conversations_open_success_schema`
--
SELECT `already_open`, `channel`, `no_op`, `ok` FROM `conversations_open_success_schema` WHERE 1;

--
-- INSERT template for table `conversations_open_success_schema`
--
INSERT INTO `conversations_open_success_schema`(`already_open`, `channel`, `no_op`, `ok`) VALUES (?, ?, ?, ?);

--
-- UPDATE template for table `conversations_open_success_schema`
--
UPDATE `conversations_open_success_schema` SET `already_open` = ?, `channel` = ?, `no_op` = ?, `ok` = ? WHERE 1;

--
-- DELETE template for table `conversations_open_success_schema`
--
DELETE FROM `conversations_open_success_schema` WHERE 0;

