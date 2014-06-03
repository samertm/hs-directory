package person

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


