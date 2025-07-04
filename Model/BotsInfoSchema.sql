--
-- Slack Web API.
-- Prepared SQL queries for 'bots_info_schema' definition.
--


--
-- SELECT template for table `bots_info_schema`
--
SELECT `bot`, `ok` FROM `bots_info_schema` WHERE 1;

--
-- INSERT template for table `bots_info_schema`
--
INSERT INTO `bots_info_schema`(`bot`, `ok`) VALUES (?, ?);

--
-- UPDATE template for table `bots_info_schema`
--
UPDATE `bots_info_schema` SET `bot` = ?, `ok` = ? WHERE 1;

--
-- DELETE template for table `bots_info_schema`
--
DELETE FROM `bots_info_schema` WHERE 0;

