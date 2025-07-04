--
-- Slack Web API.
-- Prepared SQL queries for 'dnd_info_schema' definition.
--


--
-- SELECT template for table `dnd_info_schema`
--
SELECT `dnd_enabled`, `next_dnd_end_ts`, `next_dnd_start_ts`, `ok`, `snooze_enabled`, `snooze_endtime`, `snooze_remaining` FROM `dnd_info_schema` WHERE 1;

--
-- INSERT template for table `dnd_info_schema`
--
INSERT INTO `dnd_info_schema`(`dnd_enabled`, `next_dnd_end_ts`, `next_dnd_start_ts`, `ok`, `snooze_enabled`, `snooze_endtime`, `snooze_remaining`) VALUES (?, ?, ?, ?, ?, ?, ?);

--
-- UPDATE template for table `dnd_info_schema`
--
UPDATE `dnd_info_schema` SET `dnd_enabled` = ?, `next_dnd_end_ts` = ?, `next_dnd_start_ts` = ?, `ok` = ?, `snooze_enabled` = ?, `snooze_endtime` = ?, `snooze_remaining` = ? WHERE 1;

--
-- DELETE template for table `dnd_info_schema`
--
DELETE FROM `dnd_info_schema` WHERE 0;

