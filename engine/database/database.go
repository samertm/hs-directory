package database

import (
	"database/sql"
	_ "github.com/mattn/go-sqlite3" // so the packaged gets pulled in
	"github.com/samertm/hs-directory/engine/person"
	"log"
)

var db *sql.DB

func init() {
	database, err := sql.Open("sqlite3", "./engine/database/directory.db")
	if err != nil {
		log.Fatal(err)
	}
	db = database
	_, err = db.Exec("CREATE TABLE IF NOT EXISTS people(name, phone, website, fromloc, toloc, github, twitter, email, bio, id)")
	if err != nil {
		log.Fatal(err)
	}
}

func Add(person person.Person) {
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

func Load() []*person.Person {
	if err := db.Ping(); err != nil {
		log.Fatal(err)
	}
	store := make([]*person.Person, 0)
	rows, err := db.Query("SELECT name, phone, website, fromloc, toloc, github, twitter, email, bio, id FROM people ORDER BY name COLLATE NOCASE")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()
	for rows.Next() {
		var name, phone, website, fromloc, toloc, github,
			twitter, email, bio string
		var id int
		err = rows.Scan(&name, &phone, &website, &fromloc,
			&toloc, &github, &twitter, &email, &bio, &id)
		if err != nil {
			log.Fatal(err)
		}
		p := &person.Person{
			Name:    name,
			Phone:   phone,
			Website: website,
			FromLoc: fromloc,
			ToLoc:   toloc,
			Github:  github,
			Twitter: twitter,
			Email:   email,
			Bio:     bio,
			Id:      id,
		}
		store = append(store, p)
	}
	err = rows.Err()
	if err != nil {
		log.Fatal(err)
	}
	return store
}
