use crate::model::user::UserInfo;
use crate::model::Pool;
use crate::util;
use crate::{diesel::debug_query, logged_user};
use crate::{
    model::user::{NewUser, User},
    schema,
};
use actix_http::Request;
use actix_identity::Identity;
use actix_web::web;
use std::{borrow::Cow, collections::HashMap};

use actix_web::{error, Error, HttpResponse};
use diesel::pg::Pg;
use diesel::pg::PgConnection;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use validator::{Validate, ValidationError, ValidationErrors};
// ユーザー登録用パラメータ
#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct SignupData {
    #[validate(length(min = 1, max = 100, message = "1~100文字"))]
    name: String,
    #[validate(email(message = "メールアドレスの形式"))]
    email: String,
    #[validate(length(min = 4, message = "4文字以上"))]
    password: String,
    password_confirmation: String,
}

// ユーザー更新用パラメータ
#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct UpdateData {
    #[validate(length(min = 1, max = 100, message = "1~100文字"))]
    name: String,
    #[validate(email(message = "メールアドレスの形式"))]
    email: String,
}

// ユーザ登録
pub async fn regist(
    signup_data: web::Json<SignupData>,
    id: Identity,
    pool: web::Data<Pool>,
) -> Result<HttpResponse, Error> {
    // バリデーション
    if let Err(e) = signup_data.validate() {
        let errors = serde_json::json!(&e);
        return Err(error::ErrorBadRequest(errors));
    }

    let mut errors = ValidationErrors::new();
    // パスワードと確認用パスワード
    if !&signup_data.password.eq(&signup_data.password_confirmation) {
        let error = util::make_error("password_confirmation", "確認用パスワード不一致");
        errors.add("password_confirmation", error);
    }
    let conn: &PgConnection = &pool.get().unwrap();
    // メールアドレスの一意チェック
    if !email_unique(&signup_data.email, conn) {
        let error = util::make_error("email", "email is already exists");
        errors.add("email", error);
    }

    // エラーがある場合400を返す
    if !errors.is_empty() {
        let errors = serde_json::json!(&errors);
        return Err(error::ErrorBadRequest(errors));
    }

    // ユーザ登録
    let user =
        create_user(signup_data.into_inner(), conn).map_err(error::ErrorInternalServerError)?;
    // ログイン
    let user_string = serde_json::to_string(&user).unwrap();
    id.remember(user_string);
    Ok(HttpResponse::Ok().json(user))
}

// ユーザ更新
pub async fn update(
    id: Identity,
    update_data: web::Json<UpdateData>,
    pool: web::Data<Pool>,
) -> Result<HttpResponse, Error> {
    if let Err(err) = update_data.validate() {
        let errors = serde_json::json!(&err);
        return Err(error::ErrorBadRequest(errors));
    }

    let conn: &PgConnection = &pool.get().unwrap();
    let user = crate::logged_user(&id).map_err(error::ErrorUnauthorized)?;

    let mut errors = ValidationErrors::new();
    // メールアドレスチェック
    if !check_update_email(&user.id, &update_data.email, conn) {
        let error = util::make_error("email", "email is already exists");
        errors.add("email", error);
    }

    // エラーがある場合400を返す
    if !errors.is_empty() {
        let errors = serde_json::json!(&errors);
        return Err(error::ErrorBadRequest(errors));
    }

    let user =
        update_user(&user.id, &update_data, conn).map_err(error::ErrorInternalServerError)?;

    // users.find(user.id).execute(conn);
    Ok(HttpResponse::Ok().json(user))
}

// ユーザ登録
fn create_user(signup_data: SignupData, conn: &PgConnection) -> Result<UserInfo, Error> {
    let new_user = NewUser {
        name: signup_data.name.clone(),
        // emailは小文字で登録
        email: signup_data.email.clone().to_ascii_lowercase(),
        password: util::hash_password(&signup_data.password.clone()).expect("password hash error"),
    };
    // DBに登録
    let user = diesel::insert_into(schema::users::table)
        .values(new_user)
        .get_result::<User>(conn)
        .expect("Insert user error");
    Ok(user.into())
}

// ユーザ更新
fn update_user(
    user_id: &i32,
    update_data: &UpdateData,
    conn: &PgConnection,
) -> Result<UserInfo, Error> {
    use crate::schema::users::dsl::*;

    let updated_row = diesel::update(users.find(user_id))
        .set((name.eq(&update_data.name), email.eq(&update_data.email)))
        .get_result::<User>(conn)
        .expect("Update user error");

    Ok(updated_row.into())
}

// メールアドレスの一意チェック
fn email_unique(_email: &str, conn: &PgConnection) -> bool {
    use crate::diesel::dsl::{exists, select};
    use crate::schema::users::dsl::{email, users};
    let query = select(exists(users.filter(email.eq(_email.to_ascii_lowercase()))));
    // sqlを確認
    // dbg!(debug_query::<Pg, _>(&query));
    // 存在しなければTRUE
    !query.get_result::<bool>(conn).expect("email_unique")
}

// 自分意外にメールアドレスを使っている場合はfalse
fn check_update_email(_id: &i32, _email: &str, conn: &PgConnection) -> bool {
    use crate::diesel::dsl::{exists, select};
    use crate::schema::users::dsl::{email, id, users};

    let query = select(exists(
        users
            .filter(id.ne(_id))
            .filter(email.eq(_email.to_ascii_lowercase())),
    ));
    !query.get_result::<bool>(conn).expect("check_update_email")
}
