-- =========================================================
-- 1) Création des tables et des index
-- =========================================================
BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS `data_card_layouts` (
  `id` TEXT PRIMARY KEY NOT NULL,
  `user_id` TEXT NOT NULL,
  `cards` TEXT NOT NULL,
  `created_at` INTEGER NOT NULL,
  `updated_at` INTEGER NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `data_cards` (
  `id` TEXT PRIMARY KEY NOT NULL,
  `identifier` TEXT NOT NULL,
  `config` TEXT NOT NULL,
  `user_id` TEXT,
  `created_at` INTEGER NOT NULL,
  `updated_at` INTEGER NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS `user_id_idx`
  ON `data_cards` (`user_id`);

COMMIT;

-- =========================================================
-- 2) Insertion des cartes "built_in" par défaut pour chaque user
--    + Insertion des cartes "custom-average" (peu importe is_main_average)
-- =========================================================

BEGIN TRANSACTION;

-- ---------------------------------------------------------
-- A) Création des 5 cartes par défaut
-- ---------------------------------------------------------
WITH all_users AS (
  SELECT u.id AS user_id
  FROM users u
)
INSERT INTO data_cards (id, identifier, config, user_id, created_at, updated_at)
SELECT
  'dc_' || lower(hex(randomblob(6))) AS id,
  t.identifier,
  t.config,
  a.user_id,
  CAST(strftime('%s','now') AS INTEGER) AS created_at,
  CAST(strftime('%s','now') AS INTEGER) AS updated_at
FROM all_users a
JOIN (
    SELECT 'best-grade'    AS identifier,
           '{"title":"Best Grade","description":{"formatter":"bestGrade","params":{}},"mainData":{"calculator":"bestGrade","params":{}},"icon":"StarIcon"}' AS config
    UNION ALL
    SELECT 'best-subject',
           '{"title":"Best Subject","description":{"formatter":"bestSubject","params":{}},"mainData":{"calculator":"bestSubject","params":{}},"icon":"TrophyIcon"}'
    UNION ALL
    SELECT 'global-average',
           '{"title":"Global Average","description":{"formatter":"globalAverage","params":{}},"mainData":{"calculator":"globalAverage","params":{}},"icon":"CalculatorIcon"}'
    UNION ALL
    SELECT 'worst-grade',
           '{"title":"Worst Grade","description":{"formatter":"worstGrade","params":{}},"mainData":{"calculator":"worstGrade","params":{}},"icon":"XCircleIcon"}'
    UNION ALL
    SELECT 'worst-subject',
           '{"title":"Worst Subject","description":{"formatter":"worstSubject","params":{}},"mainData":{"calculator":"worstSubject","params":{}},"icon":"ExclamationTriangleIcon"}'
) t;

-- ---------------------------------------------------------
-- B) Création des cartes "custom-average" pour toutes les custom_averages
--    qu'elles aient is_main_average = 1 ou non
-- ---------------------------------------------------------
WITH all_users_averages AS (
  SELECT 
    ca.id           AS custom_avg_id,
    ca.name         AS custom_avg_name,
    ca.user_id      AS user_id
  FROM custom_averages ca
)
INSERT INTO data_cards (id, identifier, config, user_id, created_at, updated_at)
SELECT
  'dc_' || lower(hex(randomblob(6))) AS id,
  'custom-average-' || custom_avg_id AS identifier,
  '{"title":"' || replace(custom_avg_name, '"','\\"') || '",'
   || '"description":{"formatter":"customAverage","params":{"customAverageId":"' || custom_avg_id || '"}},'
   || '"mainData":{"calculator":"customAverage","params":{"customAverageId":"' || custom_avg_id || '"}},'
   || '"icon":"ChartBarIcon"}' AS config,
  a.user_id,
  CAST(strftime('%s','now') AS INTEGER) AS created_at,
  CAST(strftime('%s','now') AS INTEGER) AS updated_at
FROM all_users_averages a;

COMMIT;

-- =========================================================
-- 3) Création du layout par défaut pour chaque user
--    en n’incluant QUE les custom averages où is_main_average = 1
-- =========================================================

BEGIN TRANSACTION;

-- On va exclure du layout les cartes custom-average-* 
-- dont is_main_average = 0. On fait un LEFT JOIN sur custom_averages
-- et on garde :
--   - toutes les cartes "built_in" (non custom)  => ca.id IS NULL
--   - ou bien is_main_average = 1
WITH user_cards AS (
  SELECT
    dc.user_id,
    dc.identifier,
    dc.id AS card_id,
    ca.is_main_average
  FROM data_cards dc
  LEFT JOIN custom_averages ca
    ON dc.identifier = 'custom-average-' || ca.id
  WHERE ca.id IS NULL 
        -- => c'est une carte "built_in" ou autre, pas une custom-average
        OR ca.is_main_average = 1
),
ordered_cards AS (
  -- On définit un ordre d’affichage:
  -- global-average=0, best-subject=1, best-grade=2, worst-subject=3, worst-grade=4,
  -- et toutes les custom-average-* (is_main_average=1 seulement) prennent position 5+
  SELECT
    uc.user_id,
    uc.card_id,
    CASE 
      WHEN uc.identifier = 'global-average' THEN 0
      WHEN uc.identifier = 'best-subject'    THEN 1
      WHEN uc.identifier = 'best-grade'      THEN 2
      WHEN uc.identifier = 'worst-subject'   THEN 3
      WHEN uc.identifier = 'worst-grade'     THEN 4
      ELSE 5
    END AS base_pos,
    uc.identifier
  FROM user_cards uc
),
ordered_cards_with_position AS (
  -- Tri par (base_pos, identifier), 
  -- puis ROW_NUMBER() pour obtenir la position qui commence à 0
  SELECT
    user_id,
    card_id,
    ROW_NUMBER() OVER (
      PARTITION BY user_id
      ORDER BY base_pos, identifier
    ) - 1 AS final_pos
  FROM ordered_cards
),
json_cards AS (
  -- Agrégation en tableau JSON
  SELECT
    user_id,
    '[' || group_concat('{"cardId":"' || card_id || '","position":' || final_pos || '}', ',')
    || ']' AS cards_json
  FROM ordered_cards_with_position
  GROUP BY user_id
)
INSERT INTO data_card_layouts (id, user_id, cards, created_at, updated_at)
SELECT
  'dcl_' || lower(hex(randomblob(6))) AS id,
  jc.user_id,
  jc.cards_json AS cards,
  CAST(strftime('%s','now') AS INTEGER) AS created_at,
  CAST(strftime('%s','now') AS INTEGER) AS updated_at
FROM json_cards jc;

COMMIT;
