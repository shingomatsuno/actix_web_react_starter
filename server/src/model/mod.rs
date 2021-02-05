extern crate r2d2;
use diesel::mysql::MysqlConnection;
use diesel::r2d2::ConnectionManager;

pub mod user;
pub type Pool = r2d2::Pool<ConnectionManager<MysqlConnection>>;
