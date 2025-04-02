# PlantAI

## Description
This application consists of three main parts:
1. **Frontend**: User interface.
2. **Management service**: Managed with Spring Boot.
3. **Prediction service**: Managed with FastAPI.

## Prerequisites
Before you begin, make sure you have the following installed:
- [Node.js](https://nodejs.org/) (for the frontend)
- [PostgreSQL](https://www.postgresql.org/download/) (for the database)
- [Java JDK](https://www.oracle.com/java/technologies/javase-downloads.html) (for the management service)
- [Python](https://python.org/downloads/) and [pip](https://pip.pypa.io/en/stable/installation/) (for the prediction service)

## Installation
### Frontend
#### Launching application on machine
1. Navigate to the frontend directory:
    ```bash
    cd PlantAI/frontend/app
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Launch the application:
    ```bash
    ng serve --open 
    ```

#### Launching application using docker
1. Navigate to the frontend directory:
    ```bash
    cd PlantAI/frontend/app
    ```
2. Build docker image:
    ```bash
    sudo docker build -t frontend .
    ```
3. Run container:
    ```bash
    sudo docker run -p 4200:80 frontend
    ```

### Management Service (Spring Boot)

1. Ensure Java 17 is installed. To install OpenJDK 17 on Ubuntu:
    ```bash
    sudo apt update
    sudo apt install openjdk-17-jdk
    ```
2. Set the `JAVA_HOME` environment variable to point to the Java 17 installation:
    ```bash
    export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
    export PATH=$JAVA_HOME/bin:$PATH
    ```
3. Define the file `application.properties` in `ProjectManagementService\src\main\resources` (Create the database manually in PostgreSQL, the tables will be created by Hibernate) 
Don't forget to set your password in `spring.datasource.password`
    ```
        # PostgreSQL Configuration
        spring.application.name=Management-Service

        spring.datasource.url=jdbc:postgresql://127.0.0.1:5432/plantai
        spring.datasource.username=postgres
        spring.datasource.password=your_password
        application.security.jwt.secret-key=your_jwt_key
        application.security.jwt.expiration=your_jwt_expiration
        application.security.jwt.refresh-token.expiration=your_jwt_expiration_key
        spring.datasource.driver-class-name=org.postgresql.Driver
        spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

        spring.jpa.hibernate.ddl-auto=create
        spring.jpa.show-sql=false

        spring.cloud.discovery.enabled=false
        eureka.instance.prefer-ip-address=true
        eureka.client.service-url.defaultZone=http://localhost:8761/eureka

        # File upload settings
        spring.servlet.multipart.enabled=true
        spring.servlet.multipart.max-file-size=500MB
        spring.servlet.multipart.max-request-size=50MB
    ```
4. Reload the shell configuration file:
    ```bash
    source ~/.bashrc
    ```
5. Compile and run the service:
    ```bash
    ./mvnw spring-boot:run
    ```
   or, if Maven is installed globally:
    ```bash
    mvn spring-boot:run
    ```

### Prediction Service (FastAPI)

#### Launching application on machine

1. Navigate to the prediction service directory:
    ```bash
    cd PlantAI/ModelService
    ```
2. Create and activate a virtual environment:
    ```bash
    python -m venv env
    source env/bin/activate  # On Windows, use `env\Scripts\activate`
    ```
3. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4. Launch the service:
    ```bash
    uvicorn app:app --reload
    ```

#### Launching application using docker

1. Navigate to the prediction service directory:
    ```bash
    cd PlantAI/ModelService
    ```
2. Build and run docker image:
    ```bash
    sudo docker-compose up
    ```

## Usage
Once all services are running, you can access the frontend application at the following address:

[http://localhost:4200](http://localhost:4200)

The management service will be accessible at:

[http://localhost:8080](http://localhost:8080)

The prediction service will be accessible at:

[http://localhost:8000](http://localhost:8000)

## Usage
The models won't be integrated inside this repository. They will have to be added manually.