#[macro_use]
extern crate diesel;
extern crate log;

use actix_cors::Cors;
use actix_http::cookie::SameSite;
use actix_identity::{CookieIdentityPolicy, Identity, IdentityService};
use actix_web::http::header;
use actix_web::{middleware, web, App, HttpResponse, HttpServer};
use diesel::pg::PgConnection;
use diesel::r2d2::{self, ConnectionManager};
use errors::ServiceError;
use model::user::UserInfo;
use rand::Rng;
use time::Duration;

// プロジェクトで使うモジュールを宣言
mod api;
mod errors;
mod model;
mod schema;
mod util;

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    let private_key = rand::thread_rng().gen::<[u8; 32]>();
    // .envを使えるようにする
    dotenv::dotenv().ok();

    // ログファイルの設定を読み込み
    log4rs::init_file("log4rs.yml", Default::default()).unwrap();

    // DBのコネクションプールを生成
    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    // create db connection pool
    let manager = ConnectionManager::<PgConnection>::new(database_url);
    let pool: model::Pool = r2d2::Pool::builder()
        .build(manager)
        .expect("Failed to create pool.");

    // 許可するorigin
    let allowd_origin: String =
        std::env::var("ALLOWED_ORIGIN").unwrap_or_else(|_| "http://localhost:3000".to_string());

    let domain: String = std::env::var("DOMAIN").unwrap_or_else(|_| "localhost".to_string());

    let cookie_name: String = std::env::var("COOKIE_NAME").unwrap_or_else(|_| "AUTH".to_string());
    let max_age: i64 = std::env::var("COOKIE_MAX_AGE")
        .unwrap_or_else(|_| 60.to_string())
        .parse()
        .unwrap();

    HttpServer::new(move || {
        // `move` to take the ownership of `private_key`
        App::new()
            .data(pool.clone())
            .wrap(middleware::Logger::default())
            .wrap(
                Cors::default()
                    .allowed_origin(allowd_origin.as_str())
                    .allowed_methods(vec!["GET", "POST", "DELETE", "PUT", "PATCH"])
                    .allowed_headers(vec![header::AUTHORIZATION, header::ACCEPT])
                    .allowed_header(header::CONTENT_TYPE)
                    .max_age(864000)
                    .supports_credentials(),
            )
            .wrap(IdentityService::new(
                CookieIdentityPolicy::new(&private_key)
                    .name(&cookie_name)
                    .path("/")
                    .domain(domain.as_str())
                    .max_age_time(Duration::days(max_age))
                    .same_site(SameSite::Lax) // `Lax` by default, but to be explicit. POST isn't allowed for cross-site, though.
                    .secure(false),
            ))
            .service(
                web::scope("/api")
                    .service(web::resource("/users").route(web::post().to(api::users::regist)))
                    .service(
                        web::resource("/auth")
                            .route(web::get().to(api::auth::logged_user))
                            .route(web::post().to(api::auth::login))
                            .route(web::delete().to(api::auth::logout)),
                    )
                    .route("/", web::get().to(|| HttpResponse::Ok().body("api"))),
            )
            .route("/", web::get().to(|| HttpResponse::Ok().body("/")))
    })
    .bind("127.0.0.1:5000")?
    .run()
    .await
}

// ログインユーザを返す
pub fn logged_user(id: Identity) -> Result<UserInfo, ServiceError> {
    let user_string = id.identity();
    match user_string {
        Some(user_string) => {
            let user = serde_json::from_str::<UserInfo>(&user_string).unwrap();
            Ok(user)
        }
        None => Err(ServiceError::Unauthorized),
    }
}
