--
-- Slack Web API.
-- Prepared SQL queries for 'API_method__users_getPresence' definition.
--


--
-- SELECT template for table `API_method__users_getPresence`
--
SELECT `auto_away`, `connection_count`, `last_activity`, `manual_away`, `ok`, `online`, `presence` FROM `API_method__users_getPresence` WHERE 1;

--
-- INSERT template for table `API_method__users_getPresence`
--
INSERT INTO `API_method__users_getPresence`(`auto_away`, `connection_count`, `last_activity`, `manual_away`, `ok`, `online`, `presence`) VALUES (?, ?, ?, ?, ?, ?, ?);

--
-- UPDATE template for table `API_method__users_getPresence`
--
UPDATE `API_method__users_getPresence` SET `auto_away` = ?, `connection_count` = ?, `last_activity` = ?, `manual_away` = ?, `ok` = ?, `online` = ?, `presence` = ? WHERE 1;

--
-- DELETE template for table `API_method__users_getPresence`
--
DELETE FROM `API_method__users_getPresence` WHERE 0;

