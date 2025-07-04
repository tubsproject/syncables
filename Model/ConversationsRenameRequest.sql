--
-- Slack Web API.
-- Prepared SQL queries for 'conversations_rename_request' definition.
--


--
-- SELECT template for table `conversations_rename_request`
--
SELECT `channel`, `name` FROM `conversations_rename_request` WHERE 1;

--
-- INSERT template for table `conversations_rename_request`
--
INSERT INTO `conversations_rename_request`(`channel`, `name`) VALUES (?, ?);

--
-- UPDATE template for table `conversations_rename_request`
--
UPDATE `conversations_rename_request` SET `channel` = ?, `name` = ? WHERE 1;

--
-- DELETE template for table `conversations_rename_request`
--
DELETE FROM `conversations_rename_request` WHERE 0;

