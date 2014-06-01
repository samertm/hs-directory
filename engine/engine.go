package engine

import (
	"errors"
)

type Person struct {
	Name    string `json:"name"`
	Phone   string `json:"phone"`
	Website string `json:"website"`
	FromLoc string `json:"fromloc"`
	ToLoc   string `json:"toloc"`
	Github  string `json:"github"`
	Twitter string `json:"twitter"`
	Email   string `json:"email"`
	Bio     string `json:"bio"`
	// globally unique id
	Id int `json:"id"`
}

var personid int

var PersonStore = make([]*Person, 0)

func AddPerson(name, phone, website, fromloc, toloc, github, twitter, email, bio string) {
	p := &Person{Name: name,
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
	personid++
}

func FindPerson(id int) (p *Person, err error) {
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
