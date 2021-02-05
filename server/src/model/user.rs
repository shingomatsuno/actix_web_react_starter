extern crate diesel;
use diesel::Queryable;
use serde::{Deserialize, Serialize};

// schemaと対になる
#[derive(Debug, Queryable)]
pub struct User {
    pub id: u64,
    pub name: String,
    pub email: String,
    pub password: String,
}

// ログインユーザ情報
#[derive(Debug, Serialize, Deserialize)]
pub struct LoggedUser {
    pub id: u64,
    pub name: String,
    pub email: String,
}

impl From<User> for LoggedUser {
    fn from(user: User) -> Self {
        LoggedUser {
            id: user.id,
            name: user.name,
            email: user.email,
        }
    }
}
