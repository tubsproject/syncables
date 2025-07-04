--
-- Slack Web API.
-- Prepared SQL queries for 'stars_list_schema' definition.
--


--
-- SELECT template for table `stars_list_schema`
--
SELECT `items`, `ok`, `paging` FROM `stars_list_schema` WHERE 1;

--
-- INSERT template for table `stars_list_schema`
--
INSERT INTO `stars_list_schema`(`items`, `ok`, `paging`) VALUES (?, ?, ?);

--
-- UPDATE template for table `stars_list_schema`
--
UPDATE `stars_list_schema` SET `items` = ?, `ok` = ?, `paging` = ? WHERE 1;

--
-- DELETE template for table `stars_list_schema`
--
DELETE FROM `stars_list_schema` WHERE 0;

