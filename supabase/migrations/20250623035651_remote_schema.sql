

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."get_marketplace_initial_data"() RETURNS "json"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  courses_data json;
  filter_options json;
BEGIN
  -- Get the first page of courses
  SELECT json_agg(c) INTO courses_data
  FROM (
    SELECT id, title, price, duration, difficulty, environment, photo_url, location, s.name as school_name
    FROM courses
    LEFT JOIN schools s ON courses.school_id = s.id
    ORDER BY created_at DESC
    LIMIT 18
  ) c;

  -- Get all filter options in a single query
  SELECT json_build_object(
    'environments', (SELECT json_agg(DISTINCT TRIM(env)) FROM (SELECT unnest(environment) as env FROM courses WHERE environment IS NOT NULL) as env_sub WHERE env IS NOT NULL AND env != ''),
    'difficulties', (SELECT json_agg(DISTINCT difficulty) FROM courses WHERE difficulty IS NOT NULL),
    'course_types', (SELECT json_agg(DISTINCT course_type) FROM courses WHERE course_type IS NOT NULL),
    'min_price', (SELECT MIN(price) FROM courses),
    'max_price', (SELECT MAX(price) FROM courses),
    'min_duration', (SELECT MIN(duration) FROM courses),
    'max_duration', (SELECT MAX(duration) FROM courses),
    'total_courses', (SELECT COUNT(*) FROM courses)
  ) INTO filter_options;

  -- Combine and return the results
  RETURN json_build_object(
    'courses', courses_data,
    'filters', filter_options
  );
END;
$$;


ALTER FUNCTION "public"."get_marketplace_initial_data"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."bookmarks" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "course_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."bookmarks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."course_gear" (
    "course_id" "uuid" NOT NULL,
    "gear_id" "uuid" NOT NULL
);


ALTER TABLE "public"."course_gear" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."course_skills" (
    "course_id" "uuid" NOT NULL,
    "skill_id" "uuid" NOT NULL
);


ALTER TABLE "public"."course_skills" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."courses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "school_id" "uuid",
    "title" "text" NOT NULL,
    "description" "text",
    "price" numeric,
    "duration" integer,
    "difficulty" "text",
    "environment" "text"[],
    "prerequisites" "text",
    "skills" "text"[],
    "start_date" "date",
    "end_date" "date",
    "location" "text",
    "rating" numeric DEFAULT 0,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "latitude" numeric,
    "longitude" numeric,
    "status" "text",
    "photo_url" "text",
    "course_type" character varying(64)
);


ALTER TABLE "public"."courses" OWNER TO "postgres";


COMMENT ON COLUMN "public"."courses"."status" IS 'Active, Draft, Archived';



COMMENT ON COLUMN "public"."courses"."photo_url" IS 'Course photos';



CREATE TABLE IF NOT EXISTS "public"."email_subscriptions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "email" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."email_subscriptions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."favorites" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "item_type" "text",
    "item_id" "uuid",
    "created_at" timestamp without time zone DEFAULT "now"(),
    CONSTRAINT "favorites_item_type_check" CHECK (("item_type" = ANY (ARRAY['course'::"text", 'school'::"text", 'gear'::"text"])))
);


ALTER TABLE "public"."favorites" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."gear" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "school_id" "uuid",
    "name" "text" NOT NULL,
    "description" "text",
    "image_url" "text",
    "affiliate_link" "text",
    "price" numeric
);


ALTER TABLE "public"."gear" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."recommendations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "course_id" "uuid",
    "share_method" "text",
    "shared_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."recommendations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reviews" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "course_id" "uuid",
    "user_id" "uuid",
    "rating" integer,
    "summary" "text",
    "created_at" timestamp without time zone DEFAULT "now"(),
    CONSTRAINT "reviews_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5)))
);


ALTER TABLE "public"."reviews" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."schools" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "website" "text",
    "logo_url" "text",
    "contact_email" "text",
    "location" "text",
    "created_by" "uuid",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "contact_phone" "text",
    "address" "text",
    "facebook_url" "text",
    "twitter_url" "text",
    "instagram_url" "text"
);


ALTER TABLE "public"."schools" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."skills" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "category" "text"
);


ALTER TABLE "public"."skills" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "email" "text" NOT NULL,
    "bio" "text",
    "avatar_url" "text",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "role" "text",
    "full_name" "text",
    "phone" "text",
    "last_sign_in" timestamp without time zone,
    "status" "text" DEFAULT 'Active'::"text"
);


ALTER TABLE "public"."users" OWNER TO "postgres";


ALTER TABLE ONLY "public"."bookmarks"
    ADD CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bookmarks"
    ADD CONSTRAINT "bookmarks_user_id_course_id_key" UNIQUE ("user_id", "course_id");



ALTER TABLE ONLY "public"."course_gear"
    ADD CONSTRAINT "course_gear_pkey" PRIMARY KEY ("course_id", "gear_id");



ALTER TABLE ONLY "public"."course_skills"
    ADD CONSTRAINT "course_skills_pkey" PRIMARY KEY ("course_id", "skill_id");



ALTER TABLE ONLY "public"."courses"
    ADD CONSTRAINT "courses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."email_subscriptions"
    ADD CONSTRAINT "email_subscriptions_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."email_subscriptions"
    ADD CONSTRAINT "email_subscriptions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."favorites"
    ADD CONSTRAINT "favorites_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."gear"
    ADD CONSTRAINT "gear_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."recommendations"
    ADD CONSTRAINT "recommendations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."schools"
    ADD CONSTRAINT "schools_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."skills"
    ADD CONSTRAINT "skills_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."skills"
    ADD CONSTRAINT "skills_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bookmarks"
    ADD CONSTRAINT "bookmarks_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bookmarks"
    ADD CONSTRAINT "bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."course_gear"
    ADD CONSTRAINT "course_gear_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id");



ALTER TABLE ONLY "public"."course_gear"
    ADD CONSTRAINT "course_gear_gear_id_fkey" FOREIGN KEY ("gear_id") REFERENCES "public"."gear"("id");



ALTER TABLE ONLY "public"."course_skills"
    ADD CONSTRAINT "course_skills_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id");



ALTER TABLE ONLY "public"."course_skills"
    ADD CONSTRAINT "course_skills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id");



ALTER TABLE ONLY "public"."courses"
    ADD CONSTRAINT "courses_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id");



ALTER TABLE ONLY "public"."favorites"
    ADD CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."gear"
    ADD CONSTRAINT "gear_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id");



ALTER TABLE ONLY "public"."recommendations"
    ADD CONSTRAINT "recommendations_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id");



ALTER TABLE ONLY "public"."recommendations"
    ADD CONSTRAINT "recommendations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id");



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."schools"
    ADD CONSTRAINT "schools_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id");



CREATE POLICY "Allow inserts from all users" ON "public"."email_subscriptions" FOR INSERT WITH CHECK (true);



CREATE POLICY "Users can delete their own bookmarks" ON "public"."bookmarks" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own bookmarks" ON "public"."bookmarks" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own bookmarks" ON "public"."bookmarks" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own subscriptions" ON "public"."email_subscriptions" FOR SELECT USING (("auth"."uid"() = "auth"."uid"()));



ALTER TABLE "public"."bookmarks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."email_subscriptions" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."get_marketplace_initial_data"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_marketplace_initial_data"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_marketplace_initial_data"() TO "service_role";


















GRANT ALL ON TABLE "public"."bookmarks" TO "anon";
GRANT ALL ON TABLE "public"."bookmarks" TO "authenticated";
GRANT ALL ON TABLE "public"."bookmarks" TO "service_role";



GRANT ALL ON TABLE "public"."course_gear" TO "anon";
GRANT ALL ON TABLE "public"."course_gear" TO "authenticated";
GRANT ALL ON TABLE "public"."course_gear" TO "service_role";



GRANT ALL ON TABLE "public"."course_skills" TO "anon";
GRANT ALL ON TABLE "public"."course_skills" TO "authenticated";
GRANT ALL ON TABLE "public"."course_skills" TO "service_role";



GRANT ALL ON TABLE "public"."courses" TO "anon";
GRANT ALL ON TABLE "public"."courses" TO "authenticated";
GRANT ALL ON TABLE "public"."courses" TO "service_role";



GRANT ALL ON TABLE "public"."email_subscriptions" TO "anon";
GRANT ALL ON TABLE "public"."email_subscriptions" TO "authenticated";
GRANT ALL ON TABLE "public"."email_subscriptions" TO "service_role";



GRANT ALL ON TABLE "public"."favorites" TO "anon";
GRANT ALL ON TABLE "public"."favorites" TO "authenticated";
GRANT ALL ON TABLE "public"."favorites" TO "service_role";



GRANT ALL ON TABLE "public"."gear" TO "anon";
GRANT ALL ON TABLE "public"."gear" TO "authenticated";
GRANT ALL ON TABLE "public"."gear" TO "service_role";



GRANT ALL ON TABLE "public"."recommendations" TO "anon";
GRANT ALL ON TABLE "public"."recommendations" TO "authenticated";
GRANT ALL ON TABLE "public"."recommendations" TO "service_role";



GRANT ALL ON TABLE "public"."reviews" TO "anon";
GRANT ALL ON TABLE "public"."reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."reviews" TO "service_role";



GRANT ALL ON TABLE "public"."schools" TO "anon";
GRANT ALL ON TABLE "public"."schools" TO "authenticated";
GRANT ALL ON TABLE "public"."schools" TO "service_role";



GRANT ALL ON TABLE "public"."skills" TO "anon";
GRANT ALL ON TABLE "public"."skills" TO "authenticated";
GRANT ALL ON TABLE "public"."skills" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
