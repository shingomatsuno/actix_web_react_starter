use crate::model::Pool;
use crate::util;
use crate::{errors::ServiceError, model::user::UserInfo};
use crate::{
    model::user::{NewUser, User},
    schema,
};
use actix_identity::Identity;
use actix_web::web;
use actix_web::{error::BlockingError, HttpResponse};
use diesel::pg::PgConnection;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};

// ユーザー登録用パラメータ
#[derive(Debug, Serialize, Deserialize)]
pub struct Entry {
    name: String,
    email: String,
    password: String,
    password_confirmation: String,
}

// ユーザ登録
pub async fn regist(
    id: Identity,
    entry_data: web::Json<Entry>,
    pool: web::Data<Pool>,
) -> Result<HttpResponse, ServiceError> {
    let res = web::block(move || create_user(entry_data.into_inner(), pool)).await;
    // ユーザー登録
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

// ユーザ登録
fn create_user(entry_data: Entry, pool: web::Data<Pool>) -> Result<UserInfo, ServiceError> {
    // TODO validation
    let new_user = NewUser {
        name: entry_data.name.clone(),
        email: entry_data.email.clone(),
        password: util::hash_password(&entry_data.password.clone()).expect("password hash error"),
    };
    let conn: &PgConnection = &pool.get().unwrap();
    let user = diesel::insert_into(schema::users::table)
        .values(new_user)
        .get_result::<User>(conn)
        .expect("Insert user error");
    Ok(user.into())
}
