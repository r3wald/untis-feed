all: clean migrate test

migrate:
	@node --env-file .env node_modules/.bin/knex migrate:up
	@echo

test:
	@node --env-file .env test.js
	@echo

clean:
	@rm -vf *.sqlite3
	@echo

dump-database:
	@echo .dump | sqlite3 development.sqlite3 | grep -E 'INSERT INTO (feed|lessons)'
	@echo

production:
	@node --env-file .env.production node_modules/.bin/knex migrate:up
	@node --env-file .env.production test.js
