down: 
	docker compose down -v --remove-orphans
up: 
	docker compose up --build api frontend database adminer

it:
	docker compose run -it api bash

current:
	docker exec -it cstrader-api-1 poetry run alembic -c backend/alembic.ini current

migrate:
	docker exec -it cstrader-api-1 poetry run alembic -c backend/alembic.ini revision --autogenerate -m "${m}"

migrations:
	docker exec -it cstrader-api-1 poetry run alembic -c backend/alembic.ini upgrade head

create_admin:
	docker compose up --build initialize_admin -d