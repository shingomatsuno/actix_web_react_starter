use crate::model::Pool;
use crate::util;
use crate::{errors::ServiceError, model::user::UserInfo};
use crate::{
    model::user::{NewUser, User},
    schema,
};
use actix_identity::Identity;
use actix_web::web;
use actix_web::{error::ErrorBadRequest, error::ErrorInternalServerError, Error, HttpResponse};
use diesel::pg::PgConnection;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use validator::Validate;

// ユーザー登録用パラメータ
#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct SignupData {
    name: String,
    #[validate(email(message = "メールアドレスの形式"))]
    email: String,
    #[validate(length(min = 4, message = "4文字以上"))]
    password: String,
    #[validate(length(min = 4))]
    password_confirmation: String,
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
        return Err(ErrorBadRequest(errors));
    }

    // ユーザ登録
    let user = web::block(move || create_user(signup_data.into_inner(), pool))
        .await
        .map_err(ErrorInternalServerError)?;

    // ログイン
    let user_string = serde_json::to_string(&user).unwrap();
    id.remember(user_string);
    Ok(HttpResponse::Ok().json(user))
}

// ユーザ登録
fn create_user(signup_data: SignupData, pool: web::Data<Pool>) -> Result<UserInfo, ServiceError> {
    let new_user = NewUser {
        name: signup_data.name.clone(),
        email: signup_data.email.clone(),
        password: util::hash_password(&signup_data.password.clone()).expect("password hash error"),
    };
    let conn: &PgConnection = &pool.get().unwrap();
    // DBに登録
    let user = diesel::insert_into(schema::users::table)
        .values(new_user)
        .get_result::<User>(conn)
        .expect("Insert user error");
    Ok(user.into())
}
