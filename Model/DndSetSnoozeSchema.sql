--
-- Slack Web API.
-- Prepared SQL queries for 'dnd_setSnooze_schema' definition.
--


--
-- SELECT template for table `dnd_setSnooze_schema`
--
SELECT `ok`, `snooze_enabled`, `snooze_endtime`, `snooze_remaining` FROM `dnd_setSnooze_schema` WHERE 1;

--
-- INSERT template for table `dnd_setSnooze_schema`
--
INSERT INTO `dnd_setSnooze_schema`(`ok`, `snooze_enabled`, `snooze_endtime`, `snooze_remaining`) VALUES (?, ?, ?, ?);

--
-- UPDATE template for table `dnd_setSnooze_schema`
--
UPDATE `dnd_setSnooze_schema` SET `ok` = ?, `snooze_enabled` = ?, `snooze_endtime` = ?, `snooze_remaining` = ? WHERE 1;

--
-- DELETE template for table `dnd_setSnooze_schema`
--
DELETE FROM `dnd_setSnooze_schema` WHERE 0;

