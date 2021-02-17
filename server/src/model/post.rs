extern crate diesel;
use crate::schema::*;
use chrono::NaiveDateTime;
use diesel::Queryable;
use serde::{Deserialize, Serialize};

use super::user::User;

#[derive(Queryable, Associations, Identifiable, Debug, Serialize, Deserialize)]
#[belongs_to(User)]
pub struct Post {
    pub id: i32,
    pub user_id: i32,
    pub title: String,
    pub body: String,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

// ユーザー登録用
#[derive(Debug, Insertable)]
#[table_name = "posts"]
pub struct NewPost {
    pub user_id: i32,
    pub title: String,
    pub body: String,
}
