-- postgresql
create table Account (
    id serial primary key,
    username varchar(255) not null UNIQUE,
    first_name varchar(255) not null,
    last_name varchar(255) not null,
    email varchar(255) not null UNIQUE,
    phone_number varchar(255) not null,
    password varchar(255) not null,
    created_at timestamp default now()

);



