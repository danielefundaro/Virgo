# Virgo - End-to-End Encrypted Password Manager

This is an open-source password manager that uses end-to-end encryption to ensure maximum security for user data. The system consists of a frontend written in Angular and a backend in Java, with support from the PostgreSQL database and the Keycloak authentication and user management provider.

## System Requirements

- Docker
- Docker Compose

## Installation

1. Clone this repository
2. Run the command docker-compose up from the main directory of the repository
3. Access the application from the browser at http://localhost:4200

## System Components

### Frontend

The frontend was developed using the Angular framework and allows users to manage their login data. Users can create new accounts, view and modify existing credentials, and generate random passwords for increased security.

The Docker image for the frontend is available on Docker Hub at docker.io/username/frontend.

### Backend

The backend was developed using the Spring Boot framework and allows for user authentication, data management, end-to-end encryption, and communication with the database.

The Docker image for the backend is available on Docker Hub at docker.io/username/backend.

### Database

The database used is PostgreSQL, which was chosen for its reliability and scalability.

The Docker image for the database is available on Docker Hub at docker.io/username/database.

### Keycloak

Keycloak is the authentication and user management provider used by the application. It was chosen for its ease of use, security, and compatibility with the backend.

The Docker image for Keycloak is available on Docker Hub at docker.io/username/keycloak.

### Configuration

The application uses the docker-compose.yml file for component configuration. To set environment variables or configure ports, modify this file.

### Contributing

We are happy to accept contributions to improve our password manager. If you'd like to contribute, please read our CONTRIBUTING.md file for more information on how to get started.

### License
This project is released under the GNU license. Please refer to the LICENSE file for more information.
