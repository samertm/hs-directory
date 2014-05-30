package server

import (
	"encoding/json"
	"net/http"
	"net/url"

	"errors"
	"fmt"
	"github.com/samertm/hs-directory/secret"
	"github.com/samertm/hs-directory/server/session"
	"github.com/samertm/hs-directory/engine"
	"io"
	"log"
)

// warning: modifies req by calling req.ParseForm()
func parseForm(req *http.Request, values ...string) (form url.Values, err error) {
	req.ParseForm()
	form = req.PostForm
	err = checkForm(form, values...)
	return
}

func checkForm(data url.Values, values ...string) error {
	for _, s := range values {
		if len(data[s]) == 0 {
			return errors.New(s + " not passed")
		}
	}
	return nil
}

var Session = session.New()

var homeHtml = `<!DOCTYPE html>
<html>
  <head>
    <title>HACKER SCHOOL DIR</title>
  <head>
  <body>
    <div id="content">
    </div>
    <script src="http://code.jquery.com/jquery-1.11.0.min.js"></script>
    <script src="http://code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
    <script src="http://fb.me/react-0.10.0.js"></script>
    <script src="http://fb.me/JSXTransformer-0.10.0.js"></script>
    <script src="/static/js/aux.js"></script>
    <script src="/static/js/hs-directory.js"></script>
    <script type="text/jsx" src="/static/js/frontend.js"></script>
  </body>
</html>`

func handleHome(w http.ResponseWriter, req *http.Request) {
	io.WriteString(w, homeHtml)
}

// not distributed with git
var SECRETPASSWORD = secret.Password

func handleLogin(w http.ResponseWriter, req *http.Request) {
	if req.Method == "POST" {
		form, err := parseForm(req, "session", "password")
		if err != nil {
			// TODO log error
			fmt.Println("handleLogin", err)
			return
		}
		if form["password"][0] == SECRETPASSWORD {
			Session.Set <- form["session"][0]
			io.WriteString(w, `{"auth":true}`)
		} else {
			io.WriteString(w, `{"auth":false}`)
		}
	}
}

func handleLogout(w http.ResponseWriter, req *http.Request) {
	if req.Method == "POST" {
		form, err := parseForm(req, "session")
		if err != nil {
			// TODO log error
			fmt.Println("handleLogout", err)
			return
		}
		Session.Delete <- form["session"][0]
	}
}

func handleAuthed(w http.ResponseWriter, req *http.Request) {
	if req.Method == "POST" {
		form, err := parseForm(req, "session")
		if err != nil {
			// TODO log error
			fmt.Println("handleLogout", err)
			return
		}
		Session.Get <- form["session"][0]
		authed := <-Session.Out
		if authed {
			io.WriteString(w, `{"auth":true}`)
		} else {
			io.WriteString(w, `{"auth":false}`)
		}
	}
}

func handlePersonAdd(w http.ResponseWriter, req *http.Request) {
	if req.Method == "POST" {
		form, err := parseForm(req,
			"session",
			"person[name]",
			"person[phone]",
			"person[website]",
			"person[fromloc]",
			"person[toloc]",
			"person[github]",
			"person[twitter]",
			"person[email]",
			"person[bio]")
		if err != nil {
			// TODO log error
			fmt.Println("handlePersonAdd", err)
			return
		}
		Session.Get <- form["session"][0]
		authed := <-Session.Out
		if authed {
			engine.AddPerson(
				form["person[name]"][0],
				form["person[phone]"][0],
				form["person[website]"][0],
				form["person[fromloc]"][0],
				form["person[toloc]"][0],
				form["person[github]"][0],
				form["person[twitter]"][0],
				form["person[email]"][0],
				form["person[bio]"][0])
		}
	}
}

func handlePeople(w http.ResponseWriter, req *http.Request) {
	if req.Method == "POST" {
		form, err := parseForm(req, "session")
		if err != nil {
			// TODO log error
			fmt.Println("handlePeople", err)
			return
		}
		Session.Get <- form["session"][0]
		authed := <-Session.Out
		if authed {
			data, err := json.Marshal(engine.PersonStore)
			if err != nil {
				fmt.Println(err)
				return
			}
			w.Header().Set("Content-Type", "application/json")
			io.WriteString(w, string(data))
		}
	}
}
			
func ListenAndServe(addr string) {
	port := ":9444"
	fmt.Print("Listening on " + addr + port + "\n")
	http.HandleFunc("/", handleHome)
	http.HandleFunc("/authed", handleAuthed)
	http.HandleFunc("/login", handleLogin)
	http.HandleFunc("/logout", handleLogout)
	http.HandleFunc("/person/add", handlePersonAdd)
	http.HandleFunc("/people", handlePeople)
	http.Handle("/static/",
		http.StripPrefix("/static/",
			http.FileServer(http.Dir("./static/"))))
	go Session.Run()
	err := http.ListenAndServe(addr+port, nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
