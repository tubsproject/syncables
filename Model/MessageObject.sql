--
-- Slack Web API.
-- Prepared SQL queries for 'Message_object' definition.
--


--
-- SELECT template for table `Message_object`
--
SELECT `attachments`, `blocks`, `text` FROM `Message_object` WHERE 1;

--
-- INSERT template for table `Message_object`
--
INSERT INTO `Message_object`(`attachments`, `blocks`, `text`) VALUES (?, ?, ?);

--
-- UPDATE template for table `Message_object`
--
UPDATE `Message_object` SET `attachments` = ?, `blocks` = ?, `text` = ? WHERE 1;

--
-- DELETE template for table `Message_object`
--
DELETE FROM `Message_object` WHERE 0;

