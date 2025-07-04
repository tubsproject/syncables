--
-- Slack Web API.
-- Prepared SQL queries for 'files_comments_delete_request' definition.
--


--
-- SELECT template for table `files_comments_delete_request`
--
SELECT `file`, `id` FROM `files_comments_delete_request` WHERE 1;

--
-- INSERT template for table `files_comments_delete_request`
--
INSERT INTO `files_comments_delete_request`(`file`, `id`) VALUES (?, ?);

--
-- UPDATE template for table `files_comments_delete_request`
--
UPDATE `files_comments_delete_request` SET `file` = ?, `id` = ? WHERE 1;

--
-- DELETE template for table `files_comments_delete_request`
--
DELETE FROM `files_comments_delete_request` WHERE 0;

