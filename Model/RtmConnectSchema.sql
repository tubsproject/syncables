--
-- Slack Web API.
-- Prepared SQL queries for 'rtm_connect_schema' definition.
--


--
-- SELECT template for table `rtm_connect_schema`
--
SELECT `ok`, `self`, `team`, `url` FROM `rtm_connect_schema` WHERE 1;

--
-- INSERT template for table `rtm_connect_schema`
--
INSERT INTO `rtm_connect_schema`(`ok`, `self`, `team`, `url`) VALUES (?, ?, ?, ?);

--
-- UPDATE template for table `rtm_connect_schema`
--
UPDATE `rtm_connect_schema` SET `ok` = ?, `self` = ?, `team` = ?, `url` = ? WHERE 1;

--
-- DELETE template for table `rtm_connect_schema`
--
DELETE FROM `rtm_connect_schema` WHERE 0;

