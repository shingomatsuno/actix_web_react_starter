use crate::model::user::UserInfo;
use crate::model::Pool;
use crate::model::{post::Post, user::User};
use crate::pagination::*;
use crate::util;
use crate::{model::post::*, schema};
use actix_identity::Identity;
use actix_web::{error, web, HttpResponse};
use diesel::pg::PgConnection;
use diesel::prelude::*;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};

use validator::{Validate, ValidationError, ValidationErrors};
#[derive(Debug, Serialize, Deserialize)]
pub struct GetParam {
    page: i64,
}
#[derive(Debug, Serialize, Deserialize)]
pub struct PostData {
    title: String,
    body: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdatePostData {
    id: i32,
    title: String,
    body: String,
    updated_at: String,
}

#[derive(Deserialize)]
pub struct GetOneParam {
    id: i32,
}

#[derive(Debug, Serialize)]
pub struct Posts {
    data: Vec<Post>,
    total: i64,
}

// post一覧取得
pub async fn get(
    id: Identity,
    get_param: web::Query<GetParam>,
    pool: web::Data<Pool>,
) -> Result<HttpResponse, error::Error> {
    let user = crate::logged_user(&id).map_err(error::ErrorUnauthorized)?;

    let page = get_param.page;
    use crate::schema::posts::dsl::{posts, user_id};
    let conn: &PgConnection = &pool.get().unwrap();

    let (post_list, total) = posts
        .filter(user_id.eq(&user.id))
        .paginate(page)
        .load_and_count_pages::<Post>(conn)
        .expect("Error get posts");

    let res = Posts {
        data: post_list,
        total: total,
    };

    Ok(HttpResponse::Ok().json(res))
}

pub async fn get_one(
    identity: Identity,
    param: web::Path<GetOneParam>,
    pool: web::Data<Pool>,
) -> Result<HttpResponse, error::Error> {
    let user = crate::logged_user(&identity).map_err(error::ErrorUnauthorized)?;
    use crate::schema::posts::dsl::{id, posts, user_id};
    let conn: &PgConnection = &pool.get().unwrap();
    let post = posts
        .filter(id.eq(&param.id))
        .filter(user_id.eq(&user.id))
        .first::<Post>(conn)
        .expect("Error get post");
    Ok(HttpResponse::Ok().json(post))
}

// post登録
pub async fn create(
    id: Identity,
    post_data: web::Json<PostData>,
    pool: web::Data<Pool>,
) -> Result<HttpResponse, error::Error> {
    let user = crate::logged_user(&id).map_err(error::ErrorUnauthorized)?;

    let new_post = NewPost {
        user_id: user.id,
        title: post_data.title.clone(),
        body: post_data.body.clone(),
    };

    let conn: &PgConnection = &pool.get().unwrap();
    let post = diesel::insert_into(schema::posts::table)
        .values(new_post)
        .get_result::<Post>(conn)
        .map_err(error::ErrorInternalServerError)?;

    Ok(HttpResponse::Ok().json(post))
}

// post更新
pub async fn update(
    identify: Identity,
    update_data: web::Json<UpdatePostData>,
    pool: web::Data<Pool>,
) -> Result<HttpResponse, error::Error> {
    let user = crate::logged_user(&identify).map_err(error::ErrorUnauthorized)?;

    use crate::schema::posts::dsl::{body, id, posts, title, user_id};
    let conn: &PgConnection = &pool.get().unwrap();
    let post = diesel::update(
        posts
            .filter(id.eq(&update_data.id))
            .filter(user_id.eq(&user.id)),
    )
    .set((title.eq(&update_data.title), body.eq(&update_data.body)))
    .get_result::<Post>(conn)
    .map_err(error::ErrorInternalServerError)?;

    Ok(HttpResponse::Ok().json(post))
}

pub async fn delete() {}
