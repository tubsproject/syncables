--
-- Slack Web API.
-- Prepared SQL queries for 'conversations_open_request' definition.
--


--
-- SELECT template for table `conversations_open_request`
--
SELECT `channel`, `users`, `return_im` FROM `conversations_open_request` WHERE 1;

--
-- INSERT template for table `conversations_open_request`
--
INSERT INTO `conversations_open_request`(`channel`, `users`, `return_im`) VALUES (?, ?, ?);

--
-- UPDATE template for table `conversations_open_request`
--
UPDATE `conversations_open_request` SET `channel` = ?, `users` = ?, `return_im` = ? WHERE 1;

--
-- DELETE template for table `conversations_open_request`
--
DELETE FROM `conversations_open_request` WHERE 0;

