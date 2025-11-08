down: 
	docker compose down -v --remove-orphans
up: 
	docker compose up --build --force-recreate --remove-orphans

it:
	docker compose run -it api bash

migrate:
	

migration:
	