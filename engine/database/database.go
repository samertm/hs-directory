package database

import (
	"database/sql"
	_ "github.com/mattn/go-sqlite3" // so the packaged gets pulled in
	"log"
)

var db *sql.DB

func init() {
	db, err := sql.Open("sqlite3", "./engine/database/directory.db")
	if err != nil {
		log.Fatal(err)
	}
	_, err := db.Exec("CREATE TABLE IF NOT EXISTS people(name, phone, website, fromloc, toloc, github, twitter, email, bio, id)")
	if err != nil {
		log.Fatal(err)
	}
}
