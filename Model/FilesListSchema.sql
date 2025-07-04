--
-- Slack Web API.
-- Prepared SQL queries for 'files_list_schema' definition.
--


--
-- SELECT template for table `files_list_schema`
--
SELECT `files`, `ok`, `paging` FROM `files_list_schema` WHERE 1;

--
-- INSERT template for table `files_list_schema`
--
INSERT INTO `files_list_schema`(`files`, `ok`, `paging`) VALUES (?, ?, ?);

--
-- UPDATE template for table `files_list_schema`
--
UPDATE `files_list_schema` SET `files` = ?, `ok` = ?, `paging` = ? WHERE 1;

--
-- DELETE template for table `files_list_schema`
--
DELETE FROM `files_list_schema` WHERE 0;

