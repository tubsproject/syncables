--
-- Slack Web API.
-- Prepared SQL queries for 'conversations_members_success_schema' definition.
--


--
-- SELECT template for table `conversations_members_success_schema`
--
SELECT `members`, `ok`, `response_metadata` FROM `conversations_members_success_schema` WHERE 1;

--
-- INSERT template for table `conversations_members_success_schema`
--
INSERT INTO `conversations_members_success_schema`(`members`, `ok`, `response_metadata`) VALUES (?, ?, ?);

--
-- UPDATE template for table `conversations_members_success_schema`
--
UPDATE `conversations_members_success_schema` SET `members` = ?, `ok` = ?, `response_metadata` = ? WHERE 1;

--
-- DELETE template for table `conversations_members_success_schema`
--
DELETE FROM `conversations_members_success_schema` WHERE 0;

