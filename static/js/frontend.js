/** @jsx React.DOM */
var PersonAddForm = React.createClass({
    onSubmit: function() {
        var name = this.refs.name.getDOMNode().value.trim();
        var phone = this.refs.phone.getDOMNode().value.trim();
        var website = this.refs.website.getDOMNode().value.trim();
        var fromloc = this.refs.fromloc.getDOMNode().value.trim();
        var toloc = this.refs.toloc.getDOMNode().value.trim();
        var github = this.refs.github.getDOMNode().value.trim();
        var twitter = this.refs.twitter.getDOMNode().value.trim();
        var email = this.refs.email.getDOMNode().value.trim();
        var bio = this.refs.bio.getDOMNode().value.trim();
        this.props.handleAddPerson({
            name: name,
            phone: phone,
            website: website,
            fromloc: fromloc,
            toloc: toloc,
            github: github,
            twitter: twitter,
            email: email,
            bio: bio
        });
        return false;
    },
    onCancel: function() {
        this.props.handleAddPersonCancel();
        return false;
    },
    render: function() {
        return (
                <form>
                <input type="text" placeholder="name (required)" ref="name" />
                <input type="text" placeholder="phone" ref="phone" />
                <input type="text" placeholder="website" ref="website" />
                <input type="text" placeholder="fromloc" ref="fromloc" />
                <input type="text" placeholder="toloc" ref="toloc" />
                <input type="text" placeholder="github" ref="github" />
                <input type="text" placeholder="twitter" ref="twitter" />
                <input type="text" placeholder="email" ref="email" />
                <input type="text" placeholder="bio" ref="bio" />
                <button onClick={this.onSubmit}>add person</button>
                <button onClick={this.onCancel}>cancel</button>
                </form>
        );
    }
});
var Person = React.createClass({
    render: function() {
        var person = <div>
            <h3>{this.props.name}</h3>
            <p>phone={this.props.phone}</p>
            <p>website={this.props.website}</p>
            <p>fromloc={this.props.fromloc}</p>
            <p>toloc={this.props.toloc}</p>
            <p>github={this.props.github}</p>
            <p>twitter={this.props.twitter}</p>
            <p>email={this.props.email}</p>
            <p>bio={this.props.bio}</p>
            </div>;
        return person;
    }
});
var PersonList = React.createClass({
    render: function() {
        var personNodes = this.props.data.map(function (person) {
            return <Person
            name={person.name}
            phone={person.phone}
            website={person.website}
            fromloc={person.fromloc}
            toloc={person.toloc}
            github={person.github}
            twitter={person.twitter}
            email={person.email}
            bio={person.bio}
                />;
        });
        return (
                <div className="personList">
                {personNodes}
            </div>
        );
    }
});    
var Content = React.createClass({
    getInitialState: function() {
        return {showAddPerson: false, people: []};
    },
    onAddPerson: function() {
        this.setState({showAddPerson: true});
    },
    loadPeopleFromServer: function() {
        $.ajax({
            url: "people",
            dataType: 'json',
            type: 'POST',
            data: {session: getSession()},
            success: function(people) {
                if (people !== null) {
                    this.setState({people: people});
                } else {
                    this.setState({people: []});
                }
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentWillMount: function() {
        this.loadPeopleFromServer();
        setInterval(this.loadPeopleFromServer, this.props.pollInterval);
    },
    handleAddPerson: function(person) {
        this.setState({showAddPerson: false});
        $.ajax({
            url: "person/add",
            dataType: 'json',
            type: 'POST',
            data: {session: getSession(), person: person},
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleAddPersonCancel: function() {
        this.setState({showAddPerson: false});
    },
    render: function() {
        var logoutButton = <button onClick={this.props.handleLogout}>logout</button>;
        var addPersonButton = <button onClick={this.onAddPerson}>add person</button>;
        return (
                <div>
                {logoutButton}
            {this.state.showAddPerson ?
             <PersonAddForm handleAddPerson={this.handleAddPerson}
             handleAddPersonCancel={this.handleAddPersonCancel} /> :
             addPersonButton}
                <PersonList data={this.state.people} />
                </div>
        );
    }
});
var Gatekeeper = React.createClass({
    getInitialState: function() {
        return {loggedin: false};
    },
    componentWillMount: function() {
        $.ajax({
            url: "authed",
            async: false,
            dataType: 'json',
            type: 'POST',
            data: {session: getSession()},
            success: function(auth) {
                if (auth !== null && auth.auth === true) {
                    this.setState({loggedin: true});
                } else {
                    this.setState({loggedin: false});
                }
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    onLogin: function() {
        this.handleLogin(this.refs.password.getDOMNode().value);
        return false;
    },
    handleLogin: function(pass) {
        $.ajax({
            url: "login",
            dataType: 'json',
            type: 'POST',
            data: {session: getSession(), password: pass},
            success: function(auth) {
                if (auth !== null && auth.auth === true) {
                    this.setState({loggedin: true});
                } else {
                    this.setState({loggedin: false});
                }
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleLogout: function() {
        this.setState({loggedin: false});
        $.ajax({
            url: "logout",
            dataType: 'json',
            type: 'POST',
            data: {session: getSession()},
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render: function() {
        var login = <div>
            <h2>welcome to the hacker school directory</h2>
            <p>for the first summer batch of 2014</p>
            <p>check the mailing list for the password</p>
            <form>
            <p>password: <input type="password" ref="password" /></p>
            <button onClick={this.onLogin}>login</button>
            </form>
            </div>;
        if (this.state.loggedin) {
            return <Content handleLogout={this.handleLogout} pollInterval={2000} />
        } else {
            return login;
        }
    }
});
React.renderComponent(
        <Gatekeeper />,
    document.getElementById("content")
);
