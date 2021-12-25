use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Deserialize, Serialize)]
#[sea_orm(table_name = "user")]
pub struct User {
    #[sea_orm(primary_key)]
    pub id: u32,
    pub name: String,
    pub email: String,
    pub password: String,
}
