use actix_identity::Identity;
use actix_web::{error::BlockingError, web, HttpResponse};

use crate::model::user::User;
use crate::model::Pool;
use crate::util;
use crate::{errors::ServiceError, model::user::UserInfo};
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
    id: Identity,
    auth_data: web::Json<AuthData>,
    pool: web::Data<Pool>,
) -> Result<HttpResponse, ServiceError> {
    let res = web::block(move || check_loign(auth_data.into_inner(), pool)).await;
    match res {
        Ok(user) => {
            let user_string = serde_json::to_string(&user).unwrap();
            id.remember(user_string);
            Ok(HttpResponse::Ok().json(user))
        }
        Err(err) => match err {
            BlockingError::Error(service_error) => Err(service_error),
            BlockingError::Canceled => Err(ServiceError::InternalServerError),
        },
    }
}

// ログアウト
pub async fn logout(id: Identity) -> HttpResponse {
    id.forget();
    HttpResponse::Ok().finish()
}

// ログインユーザを取得
pub async fn logged_user(id: Identity) -> Result<HttpResponse, ServiceError> {
    if let Ok(user) = crate::logged_user(id) {
        return Ok(HttpResponse::Ok().json(user));
    }
    Err(ServiceError::Unauthorized)
}

// ログインチェック
fn check_loign(auth_data: AuthData, pool: web::Data<Pool>) -> Result<UserInfo, ServiceError> {
    use crate::schema::users::dsl::{email, users};
    let conn: &PgConnection = &pool.get().unwrap();
    let mut items = users
        .filter(email.eq(&auth_data.email))
        .load::<User>(conn)?;

    if let Some(user) = items.pop() {
        if let Ok(matching) = util::verify(&user.password, &auth_data.password) {
            if matching {
                return Ok(user.into());
            }
        }
    }
    Err(ServiceError::Unauthorized)
}
