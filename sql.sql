CREATE TABLE users (
    id int(3)  AUTO_INCREMENT  PRIMARY KEY
    firstname VARCHAR(255) NOT NULL
    lastname VARCHAR(255) NOT NULL
    email VARCHAR(255) NOT NULL
    hashedpassword VARCHAR (255) NOT NULL
    department VARCHAR(20) NOT NULL
  

)

CREATE TABLE stockProduct (
    id int(3)  AUTO_INCREMENT  PRIMARY KEY
    shop_id VARCHAR(25) NOT NULL
    name VARCHAR(255) NOT NULL
    product_id  VARCHAR(255) NOT NULL
    created date DEFAULT NOW()
    updated date DEFAULT NOW()
)