package engine

import (
	"errors"
	"github.com/samertm/hs-directory/engine/database"
	"github.com/samertm/hs-directory/engine/person"
)

var personid int
var PersonStore []*person.Person

func init() {
	PersonStore = database.Load()
}

func AddPerson(name, phone, website, fromloc, toloc,
	github, twitter, email, bio string) {
	p := &person.Person{Name: name,
		Phone:   phone,
		Website: website,
		FromLoc: fromloc,
		ToLoc:   toloc,
		Github:  github,
		Twitter: twitter,
		Email:   email,
		Bio:     bio,
		Id:      personid}
	PersonStore = append(PersonStore, p)
	database.Add(*p)
	personid++
}

func FindPerson(id int) (p *person.Person, err error) {
	for _, person := range PersonStore {
		if person.Id == id {
			p = person
			return
		}
	}
	// TODO improve error message
	err = errors.New("Person not found")
	return
}

func DeletePerson(id int) (err error) {
	for i, p := range PersonStore {
		if p.Id == id {
			// delete person
			PersonStore = append(PersonStore[:i], PersonStore[i+1:]...)
			return
		}
	}
	err = errors.New("Person not found")
	return
}
