use actix_identity::Identity;
use actix_web::{error::BlockingError, web, HttpResponse};

use crate::model::user::User;
use crate::model::Pool;
use crate::util;
use crate::{errors::ServiceError, model::user::LoggedUser};
use diesel::mysql::MysqlConnection;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Entry {
    email: String,
    password: String,
}

// ログイン
pub async fn login(
    id: Identity,
    entry: web::Json<Entry>,
    pool: web::Data<Pool>,
) -> Result<HttpResponse, ServiceError> {
    let res = web::block(move || check_loign(entry.into_inner(), pool)).await;
    match res {
        Ok(user) => {
            let user_string = serde_json::to_string(&user).unwrap();
            id.remember(user_string);
            Ok(HttpResponse::Ok().finish())
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

// ログインチェック
fn check_loign(auth_data: Entry, pool: web::Data<Pool>) -> Result<LoggedUser, ServiceError> {
    use crate::schema::users::dsl::{email, users};
    let conn: &MysqlConnection = &pool.get().unwrap();
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
