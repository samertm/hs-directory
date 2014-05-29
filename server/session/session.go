package session

// Sessions keep track of the map between session ids and bools

type Session struct {
	// sets session to true
	Set chan string
	// get bool associated with session, on Out
	Get chan string
	// clean up session
	Delete chan string
	// output for chan 'get'
	Out chan bool

	sessions map[string]bool
}

func New() *Session {
	return &Session{
		Set:      make(chan string),
		Get:      make(chan string),
		Delete:   make(chan string),
		Out:      make(chan bool),
		sessions: make(map[string]bool),
	}
}

func (s Session) Run() {
	for {
		select {
		case str := <-s.Set:
			s.sessions[str] = true
		case str := <-s.Get:
			s.Out <- s.sessions[str]
		case str := <-s.Delete:
			delete(s.sessions, str)
		}
	}
}
