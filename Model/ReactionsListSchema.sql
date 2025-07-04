--
-- Slack Web API.
-- Prepared SQL queries for 'reactions_list_schema' definition.
--


--
-- SELECT template for table `reactions_list_schema`
--
SELECT `items`, `ok`, `paging`, `response_metadata` FROM `reactions_list_schema` WHERE 1;

--
-- INSERT template for table `reactions_list_schema`
--
INSERT INTO `reactions_list_schema`(`items`, `ok`, `paging`, `response_metadata`) VALUES (?, ?, ?, ?);

--
-- UPDATE template for table `reactions_list_schema`
--
UPDATE `reactions_list_schema` SET `items` = ?, `ok` = ?, `paging` = ?, `response_metadata` = ? WHERE 1;

--
-- DELETE template for table `reactions_list_schema`
--
DELETE FROM `reactions_list_schema` WHERE 0;

