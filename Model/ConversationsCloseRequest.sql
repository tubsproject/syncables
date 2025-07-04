--
-- Slack Web API.
-- Prepared SQL queries for 'conversations_close_request' definition.
--


--
-- SELECT template for table `conversations_close_request`
--
SELECT `channel` FROM `conversations_close_request` WHERE 1;

--
-- INSERT template for table `conversations_close_request`
--
INSERT INTO `conversations_close_request`(`channel`) VALUES (?);

--
-- UPDATE template for table `conversations_close_request`
--
UPDATE `conversations_close_request` SET `channel` = ? WHERE 1;

--
-- DELETE template for table `conversations_close_request`
--
DELETE FROM `conversations_close_request` WHERE 0;

