use actix_identity::Identity;
use actix_web::error;
use actix_web::{web, HttpResponse};

use crate::log;
use crate::model::user::User;
use crate::model::user::UserInfo;
use crate::model::Pool;
use crate::util;
use diesel::pg::PgConnection;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
// ログインチェック用パラメータ
#[derive(Debug, Serialize, Deserialize)]
pub struct AuthData {
    email: String,
    password: String,
}

// ログイン
pub async fn login(
    auth_data: web::Json<AuthData>,
    id: Identity,
    pool: web::Data<Pool>,
) -> Result<HttpResponse, error::Error> {
    match check_loign(auth_data.into_inner(), pool) {
        Ok(user) => {
            let user_string = serde_json::to_string(&user).unwrap();
            id.remember(user_string);
            Ok(HttpResponse::Ok().json(user))
        }
        Err(error) => Err(error),
    }
}

// ログアウト
pub async fn logout(id: Identity) -> HttpResponse {
    id.forget();
    HttpResponse::Ok().finish()
}

// ログインユーザを取得
pub async fn logged_user(id: Identity) -> Result<HttpResponse, error::Error> {
    if let Ok(user) = crate::logged_user(&id) {
        return Ok(HttpResponse::Ok().json(user));
    }
    Err(error::ErrorUnauthorized("Unauthorized"))
}

// ログインチェック
fn check_loign(auth_data: AuthData, pool: web::Data<Pool>) -> Result<UserInfo, error::Error> {
    use crate::schema::users::dsl::{email, users};
    let conn: &PgConnection = &pool.get().unwrap();
    let mut items = users
        .filter(email.eq(&auth_data.email.to_ascii_lowercase()))
        .load::<User>(conn)
        .map_err(error::ErrorInternalServerError)?;

    if let Some(user) = items.pop() {
        if let Ok(matching) = util::verify(&user.password, &auth_data.password) {
            if matching {
                return Ok(user.into());
            }
        }
    }
    Err(error::ErrorBadRequest(
        "メールアドレスかパスワードが違います",
    ))
}
