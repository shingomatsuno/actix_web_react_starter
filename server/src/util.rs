use actix_web::error;
use argon2::{self, Config};
use std::{borrow::Cow, collections::HashMap};
use validator::{ValidationError, ValidationErrors};

lazy_static::lazy_static! {
    pub static ref SECRET_KEY: String = std::env::var("SECRET_KEY").unwrap_or_else(|_| "0123".repeat(8));
}

const SALT: &'static [u8] = b"supersecuresalt";

// WARNING THIS IS ONLY FOR DEMO PLEASE DO MORE RESEARCH FOR PRODUCTION USE
pub fn hash_password(password: &str) -> Result<String, error::Error> {
    let config = Config {
        secret: SECRET_KEY.as_bytes(),
        ..Default::default()
    };
    argon2::hash_encoded(password.as_bytes(), &SALT, &config).map_err(|err| {
        dbg!(err);
        error::ErrorInternalServerError("hash_password")
    })
}

pub fn verify(hash: &str, password: &str) -> Result<bool, error::Error> {
    argon2::verify_encoded_ext(hash, password.as_bytes(), SECRET_KEY.as_bytes(), &[]).map_err(
        |err| {
            dbg!(err);
            error::ErrorInternalServerError("verify")
        },
    )
}

pub fn make_error(code: &'static str, message: &'static str) -> ValidationError {
    ValidationError {
        code: Cow::from(code),
        message: Some(Cow::from(message)),
        params: HashMap::new(),
    }
}
