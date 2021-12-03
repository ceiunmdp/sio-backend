import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1638123417880 implements MigrationInterface {
  name = 'InitialMigration1638123417880';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."parameters_code_enum" AS ENUM('users_minimum_balance_allowed', 'users_professorships_initial_available_storage', 'users_scholarships_initial_available_copies', 'orders_minimum_number_of_sheets_for_deposit', 'orders_percentage_of_deposit', 'files_max_size_allowed', 'faqs_link', 'facebook_link', 'instagram_link')`,
    );
    await queryRunner.query(
      `CREATE TABLE "parameters" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL, "name" character varying NOT NULL, "code" "public"."parameters_code_enum" NOT NULL, "value" character varying NOT NULL, CONSTRAINT "UQ_f9bdd410abefd57f573ec1bf9ec" UNIQUE ("code"), CONSTRAINT "UQ_2175a3ea1bb4faec90245b47418" UNIQUE ("name"), CONSTRAINT "PK_6b03a26baa3161f87fa87588859" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."movement_types_code_enum" AS ENUM('requested_order', 'cancelled_order', 'top_up', 'transfer')`,
    );
    await queryRunner.query(
      `CREATE TABLE "movement_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL, "name" character varying NOT NULL, "code" "public"."movement_types_code_enum" NOT NULL, CONSTRAINT "UQ_7be8851b64a76821b0f176e75f0" UNIQUE ("code"), CONSTRAINT "UQ_46a9c51e59998776a956ca02602" UNIQUE ("name"), CONSTRAINT "PK_157378727fd686272582297d37f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "movements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL, "amount" numeric(8,2) NOT NULL, "source_user_id" uuid NOT NULL, "target_user_id" uuid NOT NULL, "movement_type_id" uuid NOT NULL, CONSTRAINT "PK_5a8e3da15ab8f2ce353e7f58f67" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."functionalities_code_enum" AS ENUM('menu', 'principal', 'orders', 'movements', 'operations', 'home', 'active_orders', 'historical_orders', 'new_order', 'my_orders', 'movements_list', 'my_movements', 'users', 'campuses', 'careers', 'relations', 'courses', 'files', 'items', 'bindings', 'parameters', 'top_up', 'transfer_money')`,
    );
    await queryRunner.query(
      `CREATE TABLE "functionalities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL, "name" character varying NOT NULL, "code" "public"."functionalities_code_enum" NOT NULL, "supraFunctionalityId" uuid, CONSTRAINT "UQ_2f47e15cac195747ef3192640a8" UNIQUE ("code"), CONSTRAINT "UQ_5cbdcf11160ba4aeb63972372d7" UNIQUE ("name"), CONSTRAINT "PK_d560600abe41569673b94f107d2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."roles_code_enum" AS ENUM('Admin', 'CampusUser', 'Professorship', 'Scholarship', 'Student')`,
    );
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL, "name" character varying NOT NULL, "code" "public"."roles_code_enum" NOT NULL, CONSTRAINT "UQ_f6d54f95c31b73fb1bdd8e91d0c" UNIQUE ("code"), CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_type_enum" AS ENUM('Admin', 'CampusUser', 'Professorship', 'Scholarship', 'Student')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL, "uid" character varying(36), "full_name" character varying, "email" character varying NOT NULL, "disabled" boolean NOT NULL DEFAULT false, "dark_theme" boolean NOT NULL DEFAULT false, "type" "public"."users_type_enum" NOT NULL, "available_storage" bigint, "storage_used" bigint, "balance" numeric(8,2), "dni" character varying, "available_copies" integer, "remaining_copies" integer, "campus_id" uuid, "course_id" uuid, CONSTRAINT "UQ_5fe9cfa518b76c96518a206b350" UNIQUE ("dni"), CONSTRAINT "REL_5156575a338031523af209fa4c" UNIQUE ("campus_id"), CONSTRAINT "REL_af2518518efa1699a1a24903de" UNIQUE ("course_id"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IX_users_disabled" ON "users" ("disabled") `);
    await queryRunner.query(`CREATE INDEX "IX_users_email" ON "users" ("email") `);
    await queryRunner.query(`CREATE INDEX "IX_users_full_name" ON "users" ("full_name") `);
    await queryRunner.query(`CREATE INDEX "IX_users_uid" ON "users" ("uid") `);
    await queryRunner.query(`CREATE INDEX "IDX_94e2000b5f7ee1f9c491f0f8a8" ON "users" ("type") `);
    await queryRunner.query(
      `CREATE TABLE "campus" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_86696218558df8baf68dc71f0f2" UNIQUE ("name"), CONSTRAINT "PK_150aa1747b3517c47f9bd98ea6d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "courses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_6ba1a54849ae17832337a39d5e5" UNIQUE ("name"), CONSTRAINT "PK_3f70a487cc718ad8eda4e6d58c9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "relations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_f8d13fbb01d7809d7344d564001" UNIQUE ("name"), CONSTRAINT "PK_964096eb20c2a6dd4e4bb17546f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "careers_courses_relations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL, "career_id" uuid NOT NULL, "course_id" uuid NOT NULL, "relation_id" uuid NOT NULL, CONSTRAINT "PK_075a5e5abe89b7c5e6a34a25631" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "careers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_8bdde4a313c6092c9a499d034c0" UNIQUE ("name"), CONSTRAINT "PK_febfc45dc83d58090d3122fde3d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_states_code_enum" AS ENUM('requested', 'in_process', 'ready', 'cancelled', 'undelivered', 'delivered')`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_states" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL, "name" character varying NOT NULL, "code" "public"."order_states_code_enum" NOT NULL, CONSTRAINT "UQ_a740328e0eb243ecc7611ee1494" UNIQUE ("code"), CONSTRAINT "UQ_c949c89c74ae6933b955f0640e4" UNIQUE ("name"), CONSTRAINT "PK_9e86d699d5df7cb8a62ba50ef25" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "orders_to_order_states" ("timestamp" TIMESTAMP NOT NULL, "order_id" uuid NOT NULL, "order_state_id" uuid NOT NULL, CONSTRAINT "PK_20b97847954f4dc1808ca298845" PRIMARY KEY ("order_id", "order_state_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL, "id_number" SERIAL NOT NULL, "subtotal" numeric(8,2) NOT NULL, "discount" numeric(8,2) NOT NULL, "total" numeric(8,2) NOT NULL, "student_id" uuid NOT NULL, "campus_id" uuid NOT NULL, "state_id" uuid NOT NULL, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "public"."binding_group_states_code_enum" AS ENUM('to_ring', 'ringed')`);
    await queryRunner.query(
      `CREATE TABLE "binding_group_states" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL, "name" character varying NOT NULL, "code" "public"."binding_group_states_code_enum" NOT NULL, CONSTRAINT "UQ_34c447f11482c2568137126d6f1" UNIQUE ("code"), CONSTRAINT "UQ_3c9c3b45f8ca31562d0635a710c" UNIQUE ("name"), CONSTRAINT "PK_f4c14f7847311e2404fd454f4e9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "binding_groups" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL, "name" character varying NOT NULL, "price" numeric(8,2) NOT NULL, "binding_group_state_id" uuid NOT NULL, CONSTRAINT "PK_285dfa5f675091c5e08b628898e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "configurations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL, "colour" boolean NOT NULL DEFAULT false, "double_sided" boolean NOT NULL DEFAULT true, "range" character varying NOT NULL, "number_of_sheets" integer NOT NULL, "slides_per_sheet" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_ef9fc29709cc5fc66610fc6a664" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "public"."file_states_code_enum" AS ENUM('to_print', 'printing', 'printed')`);
    await queryRunner.query(
      `CREATE TABLE "file_states" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL, "name" character varying NOT NULL, "code" "public"."file_states_code_enum" NOT NULL, CONSTRAINT "UQ_8bff68ec7fa474e21d4e531d0c2" UNIQUE ("code"), CONSTRAINT "UQ_0dfd1f1e2304ff760a4f7270ef1" UNIQUE ("name"), CONSTRAINT "PK_343af1c9646b28be0da7200a4f9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL, "position" integer, "total" numeric(8,2) NOT NULL, "order_id" uuid NOT NULL, "file_id" uuid NOT NULL, "file_state_id" uuid NOT NULL, "configuration_id" uuid NOT NULL, "binding_group_id" uuid, CONSTRAINT "PK_6cc0a459c368847e7e6e0dc0b94" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."files_type_enum" AS ENUM('system_staff', 'system_professorship', 'temporary')`,
    );
    await queryRunner.query(
      `CREATE TABLE "files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL, "name" character varying NOT NULL, "mimetype" character varying NOT NULL, "number_of_sheets" integer NOT NULL, "size" integer NOT NULL, "path" character varying NOT NULL, "type" "public"."files_type_enum" NOT NULL, "physically_erased" boolean NOT NULL DEFAULT false, "owner_id" uuid, CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IX_files_type" ON "files" ("type") `);
    await queryRunner.query(`CREATE INDEX "IX_files_delete_date" ON "files" ("deleted_at") `);
    await queryRunner.query(`CREATE TYPE "public"."items_code_enum" AS ENUM('simple_sided', 'double_sided', 'colour')`);
    await queryRunner.query(`CREATE TYPE "public"."items_type_enum" AS ENUM('Item', 'Binding')`);
    await queryRunner.query(
      `CREATE TABLE "items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL, "name" character varying NOT NULL, "code" "public"."items_code_enum", "price" numeric(8,2) NOT NULL, "type" "public"."items_type_enum" NOT NULL, "sheets_limit" integer, CONSTRAINT "UQ_1b0a705ce0dc5430c020a0ec31f" UNIQUE ("code"), CONSTRAINT "UQ_213736582899b3599acaade2cd1" UNIQUE ("name"), CONSTRAINT "PK_ba5885359424c15ca6b9e79bcf6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_08b27979745f1f9d89f3bc21df" ON "items" ("type") `);
    await queryRunner.query(
      `CREATE TYPE "public"."notification_types_code_enum" AS ENUM('top_up', 'incoming_transfer', 'promotion_to_scholarship', 'degradation_to_student', 'available_copies_restored', 'order_in_process', 'order_ready', 'order_cancelled', 'order_undelivered', 'order_delivered')`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL, "name" character varying NOT NULL, "code" "public"."notification_types_code_enum" NOT NULL, "title_template" character varying NOT NULL, "body_template" character varying NOT NULL, "image_url_template" character varying NOT NULL, "data_template" character varying NOT NULL, CONSTRAINT "UQ_6ecc5d3cab22a8557fcc2aa3150" UNIQUE ("code"), CONSTRAINT "UQ_1d7eaa0dcf0fbfd0a8e6bdbc9c9" UNIQUE ("name"), CONSTRAINT "PK_aa965e094494e2c4c5942cfb42d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL, "message_id" character varying NOT NULL, "title" character varying NOT NULL, "body" character varying, "image_url" character varying, "data" character varying, "read" boolean NOT NULL DEFAULT false, "user_id" uuid NOT NULL, "notification_type_id" uuid NOT NULL, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IX_notifications_read" ON "notifications" ("read") `);
    await queryRunner.query(
      `CREATE TABLE "registration_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL, "token" character varying NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "REL_b33e0cca81747f296322a72066" UNIQUE ("user_id"), CONSTRAINT "PK_f99849be0c4520e14d10c53557c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "functionalities_roles" ("functionality_id" uuid NOT NULL, "role_id" uuid NOT NULL, CONSTRAINT "PK_5ff9306491709c23a7f9e5da2fa" PRIMARY KEY ("functionality_id", "role_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_85fe744ab2dcf89d042ce82588" ON "functionalities_roles" ("functionality_id") `,
    );
    await queryRunner.query(`CREATE INDEX "IDX_54a0a268894b61e66e0c2364bd" ON "functionalities_roles" ("role_id") `);
    await queryRunner.query(
      `CREATE TABLE "users_roles" ("user_id" uuid NOT NULL, "role_id" uuid NOT NULL, CONSTRAINT "PK_c525e9373d63035b9919e578a9c" PRIMARY KEY ("user_id", "role_id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_e4435209df12bc1f001e536017" ON "users_roles" ("user_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_1cf664021f00b9cc1ff95e17de" ON "users_roles" ("role_id") `);
    await queryRunner.query(
      `CREATE TABLE "courses_files" ("file_id" uuid NOT NULL, "course_id" uuid NOT NULL, CONSTRAINT "PK_c8dea6536c89180284b18bdc800" PRIMARY KEY ("file_id", "course_id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_0b0c8df7e15afd55971008c1d7" ON "courses_files" ("file_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_40f03a70a1405124731d48f0c5" ON "courses_files" ("course_id") `);
    await queryRunner.query(
      `CREATE TABLE "functionalities_closure" ("id_ancestor" uuid NOT NULL, "id_descendant" uuid NOT NULL, CONSTRAINT "PK_712dd890b3daf7a2c2c5f4497bf" PRIMARY KEY ("id_ancestor", "id_descendant"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d244346d655bfdfe4cf072c98d" ON "functionalities_closure" ("id_ancestor") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2c8119a879a285969bc4bceb4a" ON "functionalities_closure" ("id_descendant") `,
    );
    await queryRunner.query(
      `ALTER TABLE "movements" ADD CONSTRAINT "FK_8a53a5ebada5c3c55b2bbc1abc4" FOREIGN KEY ("source_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "movements" ADD CONSTRAINT "FK_c061abbdf106d85dc7e130a720b" FOREIGN KEY ("target_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "movements" ADD CONSTRAINT "FK_74d2aab6e0b34b5d0b13bee5cc9" FOREIGN KEY ("movement_type_id") REFERENCES "movement_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "functionalities" ADD CONSTRAINT "FK_904463fded13b638ce208d9062d" FOREIGN KEY ("supraFunctionalityId") REFERENCES "functionalities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_5156575a338031523af209fa4c8" FOREIGN KEY ("campus_id") REFERENCES "campus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_af2518518efa1699a1a24903de9" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "careers_courses_relations" ADD CONSTRAINT "FK_60215fb570eaa931e694ea370ff" FOREIGN KEY ("career_id") REFERENCES "careers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "careers_courses_relations" ADD CONSTRAINT "FK_f5a0c9ecad80e69f4dfdf4c7e1f" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "careers_courses_relations" ADD CONSTRAINT "FK_67261396becb9996361f36fc2c3" FOREIGN KEY ("relation_id") REFERENCES "relations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders_to_order_states" ADD CONSTRAINT "FK_6ed3f522496d3b9329bb7b7294a" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders_to_order_states" ADD CONSTRAINT "FK_daf2cbef1499f4ef5a4e96e3381" FOREIGN KEY ("order_state_id") REFERENCES "order_states"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_6c846a094b1989e1a202558803b" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_737f92547b761a65c7adea20ee5" FOREIGN KEY ("campus_id") REFERENCES "campus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_f5af72ce935e9dcdf3fc7249f55" FOREIGN KEY ("state_id") REFERENCES "order_states"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "binding_groups" ADD CONSTRAINT "FK_91985f0e14250da2088cca2d585" FOREIGN KEY ("binding_group_state_id") REFERENCES "binding_group_states"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_files" ADD CONSTRAINT "FK_76d991b4be0aafb9a20cc3a5c55" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_files" ADD CONSTRAINT "FK_2f7203731f079749136e414c719" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_files" ADD CONSTRAINT "FK_902f0f14f9d08cd61d043b16196" FOREIGN KEY ("file_state_id") REFERENCES "file_states"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_files" ADD CONSTRAINT "FK_d06c2a4ac0e98ff003a2cbdeec0" FOREIGN KEY ("configuration_id") REFERENCES "configurations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_files" ADD CONSTRAINT "FK_e26628d74fa7c43e73d545b830a" FOREIGN KEY ("binding_group_id") REFERENCES "binding_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "files" ADD CONSTRAINT "FK_4bc1db1f4f34ec9415acd88afdb" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_9a8a82462cab47c73d25f49261f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_8289cd3f1b09a1b08f0fd20847d" FOREIGN KEY ("notification_type_id") REFERENCES "notification_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "registration_tokens" ADD CONSTRAINT "FK_b33e0cca81747f296322a72066a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "functionalities_roles" ADD CONSTRAINT "FK_85fe744ab2dcf89d042ce825881" FOREIGN KEY ("functionality_id") REFERENCES "functionalities"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "functionalities_roles" ADD CONSTRAINT "FK_54a0a268894b61e66e0c2364bdc" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_roles" ADD CONSTRAINT "FK_e4435209df12bc1f001e5360174" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_roles" ADD CONSTRAINT "FK_1cf664021f00b9cc1ff95e17de4" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses_files" ADD CONSTRAINT "FK_0b0c8df7e15afd55971008c1d75" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses_files" ADD CONSTRAINT "FK_40f03a70a1405124731d48f0c56" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "functionalities_closure" ADD CONSTRAINT "FK_d244346d655bfdfe4cf072c98de" FOREIGN KEY ("id_ancestor") REFERENCES "functionalities"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "functionalities_closure" ADD CONSTRAINT "FK_2c8119a879a285969bc4bceb4ad" FOREIGN KEY ("id_descendant") REFERENCES "functionalities"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "functionalities_closure" DROP CONSTRAINT "FK_2c8119a879a285969bc4bceb4ad"`);
    await queryRunner.query(`ALTER TABLE "functionalities_closure" DROP CONSTRAINT "FK_d244346d655bfdfe4cf072c98de"`);
    await queryRunner.query(`ALTER TABLE "courses_files" DROP CONSTRAINT "FK_40f03a70a1405124731d48f0c56"`);
    await queryRunner.query(`ALTER TABLE "courses_files" DROP CONSTRAINT "FK_0b0c8df7e15afd55971008c1d75"`);
    await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "FK_1cf664021f00b9cc1ff95e17de4"`);
    await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "FK_e4435209df12bc1f001e5360174"`);
    await queryRunner.query(`ALTER TABLE "functionalities_roles" DROP CONSTRAINT "FK_54a0a268894b61e66e0c2364bdc"`);
    await queryRunner.query(`ALTER TABLE "functionalities_roles" DROP CONSTRAINT "FK_85fe744ab2dcf89d042ce825881"`);
    await queryRunner.query(`ALTER TABLE "registration_tokens" DROP CONSTRAINT "FK_b33e0cca81747f296322a72066a"`);
    await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_8289cd3f1b09a1b08f0fd20847d"`);
    await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_9a8a82462cab47c73d25f49261f"`);
    await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_4bc1db1f4f34ec9415acd88afdb"`);
    await queryRunner.query(`ALTER TABLE "order_files" DROP CONSTRAINT "FK_e26628d74fa7c43e73d545b830a"`);
    await queryRunner.query(`ALTER TABLE "order_files" DROP CONSTRAINT "FK_d06c2a4ac0e98ff003a2cbdeec0"`);
    await queryRunner.query(`ALTER TABLE "order_files" DROP CONSTRAINT "FK_902f0f14f9d08cd61d043b16196"`);
    await queryRunner.query(`ALTER TABLE "order_files" DROP CONSTRAINT "FK_2f7203731f079749136e414c719"`);
    await queryRunner.query(`ALTER TABLE "order_files" DROP CONSTRAINT "FK_76d991b4be0aafb9a20cc3a5c55"`);
    await queryRunner.query(`ALTER TABLE "binding_groups" DROP CONSTRAINT "FK_91985f0e14250da2088cca2d585"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_f5af72ce935e9dcdf3fc7249f55"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_737f92547b761a65c7adea20ee5"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_6c846a094b1989e1a202558803b"`);
    await queryRunner.query(`ALTER TABLE "orders_to_order_states" DROP CONSTRAINT "FK_daf2cbef1499f4ef5a4e96e3381"`);
    await queryRunner.query(`ALTER TABLE "orders_to_order_states" DROP CONSTRAINT "FK_6ed3f522496d3b9329bb7b7294a"`);
    await queryRunner.query(`ALTER TABLE "careers_courses_relations" DROP CONSTRAINT "FK_67261396becb9996361f36fc2c3"`);
    await queryRunner.query(`ALTER TABLE "careers_courses_relations" DROP CONSTRAINT "FK_f5a0c9ecad80e69f4dfdf4c7e1f"`);
    await queryRunner.query(`ALTER TABLE "careers_courses_relations" DROP CONSTRAINT "FK_60215fb570eaa931e694ea370ff"`);
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_af2518518efa1699a1a24903de9"`);
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_5156575a338031523af209fa4c8"`);
    await queryRunner.query(`ALTER TABLE "functionalities" DROP CONSTRAINT "FK_904463fded13b638ce208d9062d"`);
    await queryRunner.query(`ALTER TABLE "movements" DROP CONSTRAINT "FK_74d2aab6e0b34b5d0b13bee5cc9"`);
    await queryRunner.query(`ALTER TABLE "movements" DROP CONSTRAINT "FK_c061abbdf106d85dc7e130a720b"`);
    await queryRunner.query(`ALTER TABLE "movements" DROP CONSTRAINT "FK_8a53a5ebada5c3c55b2bbc1abc4"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_2c8119a879a285969bc4bceb4a"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_d244346d655bfdfe4cf072c98d"`);
    await queryRunner.query(`DROP TABLE "functionalities_closure"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_40f03a70a1405124731d48f0c5"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_0b0c8df7e15afd55971008c1d7"`);
    await queryRunner.query(`DROP TABLE "courses_files"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_1cf664021f00b9cc1ff95e17de"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e4435209df12bc1f001e536017"`);
    await queryRunner.query(`DROP TABLE "users_roles"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_54a0a268894b61e66e0c2364bd"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_85fe744ab2dcf89d042ce82588"`);
    await queryRunner.query(`DROP TABLE "functionalities_roles"`);
    await queryRunner.query(`DROP TABLE "registration_tokens"`);
    await queryRunner.query(`DROP INDEX "public"."IX_notifications_read"`);
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(`DROP TABLE "notification_types"`);
    await queryRunner.query(`DROP TYPE "public"."notification_types_code_enum"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_08b27979745f1f9d89f3bc21df"`);
    await queryRunner.query(`DROP TABLE "items"`);
    await queryRunner.query(`DROP TYPE "public"."items_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."items_code_enum"`);
    await queryRunner.query(`DROP INDEX "public"."IX_files_delete_date"`);
    await queryRunner.query(`DROP INDEX "public"."IX_files_type"`);
    await queryRunner.query(`DROP TABLE "files"`);
    await queryRunner.query(`DROP TYPE "public"."files_type_enum"`);
    await queryRunner.query(`DROP TABLE "order_files"`);
    await queryRunner.query(`DROP TABLE "file_states"`);
    await queryRunner.query(`DROP TYPE "public"."file_states_code_enum"`);
    await queryRunner.query(`DROP TABLE "configurations"`);
    await queryRunner.query(`DROP TABLE "binding_groups"`);
    await queryRunner.query(`DROP TABLE "binding_group_states"`);
    await queryRunner.query(`DROP TYPE "public"."binding_group_states_code_enum"`);
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TABLE "orders_to_order_states"`);
    await queryRunner.query(`DROP TABLE "order_states"`);
    await queryRunner.query(`DROP TYPE "public"."order_states_code_enum"`);
    await queryRunner.query(`DROP TABLE "careers"`);
    await queryRunner.query(`DROP TABLE "careers_courses_relations"`);
    await queryRunner.query(`DROP TABLE "relations"`);
    await queryRunner.query(`DROP TABLE "courses"`);
    await queryRunner.query(`DROP TABLE "campus"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_94e2000b5f7ee1f9c491f0f8a8"`);
    await queryRunner.query(`DROP INDEX "public"."IX_users_uid"`);
    await queryRunner.query(`DROP INDEX "public"."IX_users_full_name"`);
    await queryRunner.query(`DROP INDEX "public"."IX_users_email"`);
    await queryRunner.query(`DROP INDEX "public"."IX_users_disabled"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_type_enum"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TYPE "public"."roles_code_enum"`);
    await queryRunner.query(`DROP TABLE "functionalities"`);
    await queryRunner.query(`DROP TYPE "public"."functionalities_code_enum"`);
    await queryRunner.query(`DROP TABLE "movements"`);
    await queryRunner.query(`DROP TABLE "movement_types"`);
    await queryRunner.query(`DROP TYPE "public"."movement_types_code_enum"`);
    await queryRunner.query(`DROP TABLE "parameters"`);
    await queryRunner.query(`DROP TYPE "public"."parameters_code_enum"`);
  }
}
