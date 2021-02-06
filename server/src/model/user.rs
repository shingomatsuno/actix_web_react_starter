extern crate diesel;
use crate::schema::*;
use diesel::Queryable;
use serde::{Deserialize, Serialize};

// 検索用 schemaと対になる
#[derive(Debug, Queryable)]
pub struct User {
    pub id: i32,
    pub name: String,
    pub email: String,
    pub password: String,
}

// ユーザー登録用
#[derive(Debug, Insertable)]
#[table_name = "users"]
pub struct NewUser {
    pub name: String,
    pub email: String,
    pub password: String,
}

// ユーザ情報 (パスワードなし)
#[derive(Debug, Serialize, Deserialize)]
pub struct UserInfo {
    pub id: i32,
    pub name: String,
    pub email: String,
}

impl From<User> for UserInfo {
    fn from(user: User) -> Self {
        UserInfo {
            id: user.id,
            name: user.name,
            email: user.email,
        }
    }
}
