package engine

type Person struct {
	Name    string `json:"name"`
	Phone   string `json:"phone"`
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

func AddPerson(name, phone, fromloc, toloc, github, twitter, email, bio string) {
	p := &Person{Name: name,
		Phone:   phone,
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
