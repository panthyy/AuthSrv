-- postgresql
create table Account (
    id serial primary key,
    username varchar(255) not null UNIQUE,
    firstname varchar(255) not null,
    lastname varchar(255) not null,
    email varchar(255) not null UNIQUE,
    password varchar(255) not null,
    created_at timestamp default now()

);
