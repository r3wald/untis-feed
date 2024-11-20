all: clean migrate test dump-database

migrate:
	@node_modules/.bin/knex migrate:up
	@echo

test:
	@NODE_ENV=development node test.js
	@echo

clean:
	@rm -vf *.sqlite3
	@echo

dump-database:
	@echo .dump | sqlite3 feed.sqlite3 | grep -E 'INSERT INTO (feed|lessons)'
	@echo
