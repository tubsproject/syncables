--
-- Slack Web API.
-- Prepared SQL queries for 'conversations_mark_request' definition.
--


--
-- SELECT template for table `conversations_mark_request`
--
SELECT `channel`, `ts` FROM `conversations_mark_request` WHERE 1;

--
-- INSERT template for table `conversations_mark_request`
--
INSERT INTO `conversations_mark_request`(`channel`, `ts`) VALUES (?, ?);

--
-- UPDATE template for table `conversations_mark_request`
--
UPDATE `conversations_mark_request` SET `channel` = ?, `ts` = ? WHERE 1;

--
-- DELETE template for table `conversations_mark_request`
--
DELETE FROM `conversations_mark_request` WHERE 0;

