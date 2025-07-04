--
-- Slack Web API.
-- Prepared SQL queries for 'conversations_join_request' definition.
--


--
-- SELECT template for table `conversations_join_request`
--
SELECT `channel` FROM `conversations_join_request` WHERE 1;

--
-- INSERT template for table `conversations_join_request`
--
INSERT INTO `conversations_join_request`(`channel`) VALUES (?);

--
-- UPDATE template for table `conversations_join_request`
--
UPDATE `conversations_join_request` SET `channel` = ? WHERE 1;

--
-- DELETE template for table `conversations_join_request`
--
DELETE FROM `conversations_join_request` WHERE 0;

