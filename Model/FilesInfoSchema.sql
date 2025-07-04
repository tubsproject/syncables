--
-- Slack Web API.
-- Prepared SQL queries for 'files_info_schema' definition.
--


--
-- SELECT template for table `files_info_schema`
--
SELECT `comments`, `editor`, `file`, `ok`, `paging`, `response_metadata` FROM `files_info_schema` WHERE 1;

--
-- INSERT template for table `files_info_schema`
--
INSERT INTO `files_info_schema`(`comments`, `editor`, `file`, `ok`, `paging`, `response_metadata`) VALUES (?, ?, ?, ?, ?, ?);

--
-- UPDATE template for table `files_info_schema`
--
UPDATE `files_info_schema` SET `comments` = ?, `editor` = ?, `file` = ?, `ok` = ?, `paging` = ?, `response_metadata` = ? WHERE 1;

--
-- DELETE template for table `files_info_schema`
--
DELETE FROM `files_info_schema` WHERE 0;

