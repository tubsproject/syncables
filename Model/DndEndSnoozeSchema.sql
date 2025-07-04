--
-- Slack Web API.
-- Prepared SQL queries for 'dnd_endSnooze_schema' definition.
--


--
-- SELECT template for table `dnd_endSnooze_schema`
--
SELECT `dnd_enabled`, `next_dnd_end_ts`, `next_dnd_start_ts`, `ok`, `snooze_enabled` FROM `dnd_endSnooze_schema` WHERE 1;

--
-- INSERT template for table `dnd_endSnooze_schema`
--
INSERT INTO `dnd_endSnooze_schema`(`dnd_enabled`, `next_dnd_end_ts`, `next_dnd_start_ts`, `ok`, `snooze_enabled`) VALUES (?, ?, ?, ?, ?);

--
-- UPDATE template for table `dnd_endSnooze_schema`
--
UPDATE `dnd_endSnooze_schema` SET `dnd_enabled` = ?, `next_dnd_end_ts` = ?, `next_dnd_start_ts` = ?, `ok` = ?, `snooze_enabled` = ? WHERE 1;

--
-- DELETE template for table `dnd_endSnooze_schema`
--
DELETE FROM `dnd_endSnooze_schema` WHERE 0;

