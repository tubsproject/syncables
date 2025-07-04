--
-- Slack Web API.
-- Prepared SQL queries for 'conversations_create_request' definition.
--


--
-- SELECT template for table `conversations_create_request`
--
SELECT `name`, `is_private` FROM `conversations_create_request` WHERE 1;

--
-- INSERT template for table `conversations_create_request`
--
INSERT INTO `conversations_create_request`(`name`, `is_private`) VALUES (?, ?);

--
-- UPDATE template for table `conversations_create_request`
--
UPDATE `conversations_create_request` SET `name` = ?, `is_private` = ? WHERE 1;

--
-- DELETE template for table `conversations_create_request`
--
DELETE FROM `conversations_create_request` WHERE 0;

