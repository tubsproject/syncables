--
-- Slack Web API.
-- Prepared SQL queries for 'calls_participants_remove_request' definition.
--


--
-- SELECT template for table `calls_participants_remove_request`
--
SELECT `id`, `users` FROM `calls_participants_remove_request` WHERE 1;

--
-- INSERT template for table `calls_participants_remove_request`
--
INSERT INTO `calls_participants_remove_request`(`id`, `users`) VALUES (?, ?);

--
-- UPDATE template for table `calls_participants_remove_request`
--
UPDATE `calls_participants_remove_request` SET `id` = ?, `users` = ? WHERE 1;

--
-- DELETE template for table `calls_participants_remove_request`
--
DELETE FROM `calls_participants_remove_request` WHERE 0;

