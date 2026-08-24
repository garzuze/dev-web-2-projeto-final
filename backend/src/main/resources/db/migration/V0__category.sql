-- Categoria de equipamento
-- Flyway, o Hibernate roda em ddl-auto=validate e so confere se bate.
CREATE TABLE category (
    id      bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name    varchar(60) NOT NULL,
    active  boolean     NOT NULL DEFAULT true,
    CONSTRAINT uk_category_name UNIQUE (name)
);
