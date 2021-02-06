extern crate r2d2;
use diesel::pg::PgConnection;
use diesel::r2d2::ConnectionManager;

pub mod user;
pub type Pool = r2d2::Pool<ConnectionManager<PgConnection>>;
