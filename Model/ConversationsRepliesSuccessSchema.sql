--
-- Slack Web API.
-- Prepared SQL queries for 'conversations_replies_success_schema' definition.
--


--
-- SELECT template for table `conversations_replies_success_schema`
--
SELECT `has_more`, `messages`, `ok` FROM `conversations_replies_success_schema` WHERE 1;

--
-- INSERT template for table `conversations_replies_success_schema`
--
INSERT INTO `conversations_replies_success_schema`(`has_more`, `messages`, `ok`) VALUES (?, ?, ?);

--
-- UPDATE template for table `conversations_replies_success_schema`
--
UPDATE `conversations_replies_success_schema` SET `has_more` = ?, `messages` = ?, `ok` = ? WHERE 1;

--
-- DELETE template for table `conversations_replies_success_schema`
--
DELETE FROM `conversations_replies_success_schema` WHERE 0;

