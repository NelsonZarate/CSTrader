down: 
	docker compose down --volumes
up: 
	docker compose up --build --force-recreate

it:
	docker compose run -it api bash

migrate:
	

migration:
	