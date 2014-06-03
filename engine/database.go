package engine

import (
	"database/sql"
	_ "github.com/mattn/go-sqlite3" // so the packaged gets pulled in
	"log"
)

var db *sql.DB

func init() {
	db, err := sql.Open("sqlite3", "./engine/directory.db")
	if err != nil {
		log.Fatal(err)
	}
	_, err = db.Exec("CREATE TABLE IF NOT EXISTS people(name, phone, website, fromloc, toloc, github, twitter, email, bio, id)")
	if err != nil {
		log.Fatal(err)
	}
}

func DbAdd(person Person) {
	if err := db.Ping(); err != nil {
		log.Fatal(err)
	}
	_, err := db.Exec("INSERT INTO people(name, phone, website, fromloc, toloc, github, twitter, email, bio, id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		person.Name,
		person.Phone,
		person.Website,
		person.FromLoc,
		person.ToLoc,
		person.Github,
		person.Twitter,
		person.Email,
		person.Bio,
		person.Id)
	if err != nil {
		log.Fatal(err)
	}
}
