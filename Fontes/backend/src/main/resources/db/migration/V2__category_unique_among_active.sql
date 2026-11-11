-- RF017 pede nome único "entre as ativas". O UNIQUE global do V0 impedia
ALTER TABLE category DROP CONSTRAINT uk_category_name;

-- lower(name) pq a checagem de duplicado no serviço ignora maiusculas
CREATE UNIQUE INDEX uk_category_name_active ON category (lower(name)) WHERE active;
