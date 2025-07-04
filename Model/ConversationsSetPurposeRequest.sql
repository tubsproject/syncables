--
-- Slack Web API.
-- Prepared SQL queries for 'conversations_setPurpose_request' definition.
--


--
-- SELECT template for table `conversations_setPurpose_request`
--
SELECT `channel`, `purpose` FROM `conversations_setPurpose_request` WHERE 1;

--
-- INSERT template for table `conversations_setPurpose_request`
--
INSERT INTO `conversations_setPurpose_request`(`channel`, `purpose`) VALUES (?, ?);

--
-- UPDATE template for table `conversations_setPurpose_request`
--
UPDATE `conversations_setPurpose_request` SET `channel` = ?, `purpose` = ? WHERE 1;

--
-- DELETE template for table `conversations_setPurpose_request`
--
DELETE FROM `conversations_setPurpose_request` WHERE 0;

