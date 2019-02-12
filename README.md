## Awesome Co. Coding Challenge

To get started, please ensure that Docker and Docker Compose are installed.
From the root of the project directory, run:

### `docker-compose build`

The database takes a while to initialize, so it should be
initialized started first with:

### `docker-compose up db`

When this is done, te database (Neo4j) can be accessed at
[http://localhost:7474](http://localhost:7474).

Bring up the other containers with:

### `docker-compose up app`

The `app` service is dependent on the `api` service so that
also started.

The app can be accessed at 
[http://localhost:3000](http://localhost:3000).
