use std::io;

use actix_web::{middleware, App, HttpServer, Responder};
use log::LevelFilter::Debug;
use simplelog::{ColorChoice, TermLogger, TerminalMode};

pub mod dal;

#[actix_web::get("/")]
async fn hello_world() -> impl Responder {
    "Hello world"
}

#[actix_web::main]
async fn main() -> io::Result<()> {
    TermLogger::init(Debug, Default::default(), TerminalMode::Mixed, ColorChoice::Auto).unwrap();

    let server = HttpServer::new(|| {
        App::new()
            .wrap(middleware::Compress::default())
            .wrap(middleware::Logger::default())
            .service(hello_world)
    })
    .bind("127.0.0.1:8080")?
    .workers(1);

    server.run().await?;
    Ok(())
}
