--
-- Slack Web API.
-- Prepared SQL queries for 'team_info_schema' definition.
--


--
-- SELECT template for table `team_info_schema`
--
SELECT `ok`, `team` FROM `team_info_schema` WHERE 1;

--
-- INSERT template for table `team_info_schema`
--
INSERT INTO `team_info_schema`(`ok`, `team`) VALUES (?, ?);

--
-- UPDATE template for table `team_info_schema`
--
UPDATE `team_info_schema` SET `ok` = ?, `team` = ? WHERE 1;

--
-- DELETE template for table `team_info_schema`
--
DELETE FROM `team_info_schema` WHERE 0;

