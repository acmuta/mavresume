-- Dynamic resume builder migration
-- Created: 2026-03-26

BEGIN;

-- NOTE ABOUT RLS:
-- This migration performs UPDATE statements. Run it as a privileged role
-- (e.g., Supabase SQL Editor/postgres/service_role). If executed as anon/
-- authenticated with RLS enabled, updates can fail due to policy restrictions.

-- 1) Add dynamic payload columns
ALTER TABLE resume_data ADD COLUMN IF NOT EXISTS section_data JSONB;
ALTER TABLE resume_data ADD COLUMN IF NOT EXISTS schema_version INT;

-- 2) One-time backfill from legacy fixed columns
--    - Merges into existing section_data instead of replacing it.
--    - Supports environments where leadership_activities may not exist yet.
DO $$
DECLARE
  has_leadership_activities boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'resume_data'
      AND column_name = 'leadership_activities'
  ) INTO has_leadership_activities;

  IF has_leadership_activities THEN
    EXECUTE $sql$
      UPDATE resume_data
      SET
        section_data = COALESCE(section_data, '{}'::jsonb) || jsonb_build_object(
          'personal-info', COALESCE(
            section_data->'personal-info',
            personal_info,
            '{"name":"","email":"","customContacts":[]}'::jsonb
          ),
          'education', COALESCE(
            section_data->'education',
            education,
            '[]'::jsonb
          ),
          'technical-skills', COALESCE(
            section_data->'technical-skills',
            skills,
            '{"languagesList":[],"technologiesList":[],"frameworksList":[],"toolsList":[],"platformsList":[],"customLanguages":[],"customTechnologies":[],"customFrameworks":[],"customTools":[],"customPlatforms":[]}'::jsonb
          ),
          'projects', COALESCE(
            section_data->'projects',
            projects,
            '[]'::jsonb
          ),
          'experience', COALESCE(
            section_data->'experience',
            experience,
            '[]'::jsonb
          ),
          'leadership-activities', COALESCE(
            section_data->'leadership-activities',
            leadership_activities,
            '[]'::jsonb
          )
        ),
        schema_version = 2
      WHERE section_data IS NULL OR schema_version IS DISTINCT FROM 2;
    $sql$;
  ELSE
    EXECUTE $sql$
      UPDATE resume_data
      SET
        section_data = COALESCE(section_data, '{}'::jsonb) || jsonb_build_object(
          'personal-info', COALESCE(
            section_data->'personal-info',
            personal_info,
            '{"name":"","email":"","customContacts":[]}'::jsonb
          ),
          'education', COALESCE(
            section_data->'education',
            education,
            '[]'::jsonb
          ),
          'technical-skills', COALESCE(
            section_data->'technical-skills',
            skills,
            '{"languagesList":[],"technologiesList":[],"frameworksList":[],"toolsList":[],"platformsList":[],"customLanguages":[],"customTechnologies":[],"customFrameworks":[],"customTools":[],"customPlatforms":[]}'::jsonb
          ),
          'projects', COALESCE(
            section_data->'projects',
            projects,
            '[]'::jsonb
          ),
          'experience', COALESCE(
            section_data->'experience',
            experience,
            '[]'::jsonb
          ),
          'leadership-activities', COALESCE(
            section_data->'leadership-activities',
            '[]'::jsonb
          )
        ),
        schema_version = 2
      WHERE section_data IS NULL OR schema_version IS DISTINCT FROM 2;
    $sql$;
  END IF;
END $$;

-- 3) Defaults and constraints
ALTER TABLE resume_data ALTER COLUMN section_data SET DEFAULT '{}'::jsonb;
UPDATE resume_data SET section_data = '{}'::jsonb WHERE section_data IS NULL;
ALTER TABLE resume_data ALTER COLUMN section_data SET NOT NULL;

ALTER TABLE resume_data ALTER COLUMN schema_version SET DEFAULT 2;
UPDATE resume_data SET schema_version = 2 WHERE schema_version IS NULL;
ALTER TABLE resume_data ALTER COLUMN schema_version SET NOT NULL;

-- 4) Indexes for reads and filtering
CREATE INDEX IF NOT EXISTS idx_resume_data_schema_version
  ON resume_data(schema_version);

CREATE INDEX IF NOT EXISTS idx_resume_data_section_data_gin
  ON resume_data USING GIN (section_data);

COMMIT;

-- -----------------------------------------------------------------------------
-- ROLLBACK PLAYBOOK (run manually only if rollout fails)
-- -----------------------------------------------------------------------------
-- This rollback is split in two stages:
--   Stage A: restore legacy columns from section_data (safe, non-destructive)
--   Stage B: remove dynamic indexes/columns (destructive)
--
-- Stage A keeps section_data/schema_version available so you can validate before
-- dropping anything. Stage B fully reverts this migration.

-- Stage A: restore legacy fixed columns from dynamic payload
-- BEGIN;
--
-- DO $$
-- DECLARE
--   has_leadership_activities boolean;
-- BEGIN
--   SELECT EXISTS (
--     SELECT 1
--     FROM information_schema.columns
--     WHERE table_schema = 'public'
--       AND table_name = 'resume_data'
--       AND column_name = 'leadership_activities'
--   ) INTO has_leadership_activities;
--
--   IF has_leadership_activities THEN
--     EXECUTE $sql$
--       UPDATE resume_data
--       SET
--         personal_info = COALESCE(
--           section_data->'personal-info',
--           personal_info,
--           '{"name":"","email":"","customContacts":[]}'::jsonb
--         ),
--         education = COALESCE(
--           section_data->'education',
--           education,
--           '[]'::jsonb
--         ),
--         skills = COALESCE(
--           section_data->'technical-skills',
--           skills,
--           '{"languagesList":[],"technologiesList":[],"frameworksList":[],"toolsList":[],"platformsList":[],"customLanguages":[],"customTechnologies":[],"customFrameworks":[],"customTools":[],"customPlatforms":[]}'::jsonb
--         ),
--         projects = COALESCE(
--           section_data->'projects',
--           projects,
--           '[]'::jsonb
--         ),
--         experience = COALESCE(
--           section_data->'experience',
--           experience,
--           '[]'::jsonb
--         ),
--         leadership_activities = COALESCE(
--           section_data->'leadership-activities',
--           leadership_activities,
--           '[]'::jsonb
--         );
--     $sql$;
--   ELSE
--     EXECUTE $sql$
--       UPDATE resume_data
--       SET
--         personal_info = COALESCE(
--           section_data->'personal-info',
--           personal_info,
--           '{"name":"","email":"","customContacts":[]}'::jsonb
--         ),
--         education = COALESCE(
--           section_data->'education',
--           education,
--           '[]'::jsonb
--         ),
--         skills = COALESCE(
--           section_data->'technical-skills',
--           skills,
--           '{"languagesList":[],"technologiesList":[],"frameworksList":[],"toolsList":[],"platformsList":[],"customLanguages":[],"customTechnologies":[],"customFrameworks":[],"customTools":[],"customPlatforms":[]}'::jsonb
--         ),
--         projects = COALESCE(
--           section_data->'projects',
--           projects,
--           '[]'::jsonb
--         ),
--         experience = COALESCE(
--           section_data->'experience',
--           experience,
--           '[]'::jsonb
--         );
--     $sql$;
--   END IF;
-- END $$;
--
-- COMMIT;

-- Stage B: full schema rollback for this migration
-- BEGIN;
--
-- DROP INDEX IF EXISTS idx_resume_data_section_data_gin;
-- DROP INDEX IF EXISTS idx_resume_data_schema_version;
--
-- ALTER TABLE resume_data
--   ALTER COLUMN section_data DROP NOT NULL,
--   ALTER COLUMN section_data DROP DEFAULT,
--   ALTER COLUMN schema_version DROP NOT NULL,
--   ALTER COLUMN schema_version DROP DEFAULT;
--
-- ALTER TABLE resume_data
--   DROP COLUMN IF EXISTS section_data,
--   DROP COLUMN IF EXISTS schema_version;
--
-- COMMIT;

-- Optional post-cutover cleanup (run in separate migration after validation):
-- ALTER TABLE resume_data
--   DROP COLUMN IF EXISTS personal_info,
--   DROP COLUMN IF EXISTS education,
--   DROP COLUMN IF EXISTS projects,
--   DROP COLUMN IF EXISTS experience,
--   DROP COLUMN IF EXISTS leadership_activities,
--   DROP COLUMN IF EXISTS skills;
