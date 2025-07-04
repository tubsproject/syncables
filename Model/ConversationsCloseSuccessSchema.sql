--
-- Slack Web API.
-- Prepared SQL queries for 'conversations_close_success_schema' definition.
--


--
-- SELECT template for table `conversations_close_success_schema`
--
SELECT `already_closed`, `no_op`, `ok` FROM `conversations_close_success_schema` WHERE 1;

--
-- INSERT template for table `conversations_close_success_schema`
--
INSERT INTO `conversations_close_success_schema`(`already_closed`, `no_op`, `ok`) VALUES (?, ?, ?);

--
-- UPDATE template for table `conversations_close_success_schema`
--
UPDATE `conversations_close_success_schema` SET `already_closed` = ?, `no_op` = ?, `ok` = ? WHERE 1;

--
-- DELETE template for table `conversations_close_success_schema`
--
DELETE FROM `conversations_close_success_schema` WHERE 0;

