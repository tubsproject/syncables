--
-- Slack Web API.
-- Prepared SQL queries for 'users_setPhoto_schema' definition.
--


--
-- SELECT template for table `users_setPhoto_schema`
--
SELECT `ok`, `profile` FROM `users_setPhoto_schema` WHERE 1;

--
-- INSERT template for table `users_setPhoto_schema`
--
INSERT INTO `users_setPhoto_schema`(`ok`, `profile`) VALUES (?, ?);

--
-- UPDATE template for table `users_setPhoto_schema`
--
UPDATE `users_setPhoto_schema` SET `ok` = ?, `profile` = ? WHERE 1;

--
-- DELETE template for table `users_setPhoto_schema`
--
DELETE FROM `users_setPhoto_schema` WHERE 0;

