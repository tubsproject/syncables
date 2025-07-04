--
-- Slack Web API.
-- Prepared SQL queries for 'conversations_unarchive_request' definition.
--


--
-- SELECT template for table `conversations_unarchive_request`
--
SELECT `channel` FROM `conversations_unarchive_request` WHERE 1;

--
-- INSERT template for table `conversations_unarchive_request`
--
INSERT INTO `conversations_unarchive_request`(`channel`) VALUES (?);

--
-- UPDATE template for table `conversations_unarchive_request`
--
UPDATE `conversations_unarchive_request` SET `channel` = ? WHERE 1;

--
-- DELETE template for table `conversations_unarchive_request`
--
DELETE FROM `conversations_unarchive_request` WHERE 0;

