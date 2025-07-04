--
-- Slack Web API.
-- Prepared SQL queries for 'conversations_setPurpose_success_schema' definition.
--


--
-- SELECT template for table `conversations_setPurpose_success_schema`
--
SELECT `channel`, `ok` FROM `conversations_setPurpose_success_schema` WHERE 1;

--
-- INSERT template for table `conversations_setPurpose_success_schema`
--
INSERT INTO `conversations_setPurpose_success_schema`(`channel`, `ok`) VALUES (?, ?);

--
-- UPDATE template for table `conversations_setPurpose_success_schema`
--
UPDATE `conversations_setPurpose_success_schema` SET `channel` = ?, `ok` = ? WHERE 1;

--
-- DELETE template for table `conversations_setPurpose_success_schema`
--
DELETE FROM `conversations_setPurpose_success_schema` WHERE 0;

