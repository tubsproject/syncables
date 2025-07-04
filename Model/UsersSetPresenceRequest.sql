--
-- Slack Web API.
-- Prepared SQL queries for 'users_setPresence_request' definition.
--


--
-- SELECT template for table `users_setPresence_request`
--
SELECT `presence` FROM `users_setPresence_request` WHERE 1;

--
-- INSERT template for table `users_setPresence_request`
--
INSERT INTO `users_setPresence_request`(`presence`) VALUES (?);

--
-- UPDATE template for table `users_setPresence_request`
--
UPDATE `users_setPresence_request` SET `presence` = ? WHERE 1;

--
-- DELETE template for table `users_setPresence_request`
--
DELETE FROM `users_setPresence_request` WHERE 0;

