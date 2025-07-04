--
-- Slack Web API.
-- Prepared SQL queries for 'chat_postEphemeral_success_schema' definition.
--


--
-- SELECT template for table `chat_postEphemeral_success_schema`
--
SELECT `message_ts`, `ok` FROM `chat_postEphemeral_success_schema` WHERE 1;

--
-- INSERT template for table `chat_postEphemeral_success_schema`
--
INSERT INTO `chat_postEphemeral_success_schema`(`message_ts`, `ok`) VALUES (?, ?);

--
-- UPDATE template for table `chat_postEphemeral_success_schema`
--
UPDATE `chat_postEphemeral_success_schema` SET `message_ts` = ?, `ok` = ? WHERE 1;

--
-- DELETE template for table `chat_postEphemeral_success_schema`
--
DELETE FROM `chat_postEphemeral_success_schema` WHERE 0;

