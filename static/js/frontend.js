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
                <input type="text" placeholder="name (required)" ref="name" /><br />
                <input type="text" placeholder="phone" ref="phone" /><br />
                <input type="text" placeholder="website" ref="website" /><br />
                <input type="text" placeholder="fromloc" ref="fromloc" /><br />
                <input type="text" placeholder="toloc" ref="toloc" /><br />
                <input type="text" placeholder="github" ref="github" /><br />
                <input type="text" placeholder="twitter" ref="twitter" /><br />
                <input type="text" placeholder="email" ref="email" /><br />
                <textarea placeholder="bio" ref="bio" /><br />
                <button onClick={this.onSubmit}>add person</button>
                <button onClick={this.onCancel}>cancel</button>
                </form>
        );
    }
});
var Person = React.createClass({
    getInitialState: function() {
        return {showedit: false};
    },
    onEdit: function() {
        this.setState({showedit: false});
        var name = this.refs.name.getDOMNode().value.trim();
        var phone = this.refs.phone.getDOMNode().value.trim();
        var website = this.refs.website.getDOMNode().value.trim();
        var fromloc = this.refs.fromloc.getDOMNode().value.trim();
        var toloc = this.refs.toloc.getDOMNode().value.trim();
        var github = this.refs.github.getDOMNode().value.trim();
        var twitter = this.refs.twitter.getDOMNode().value.trim();
        var email = this.refs.email.getDOMNode().value.trim();
        var bio = this.refs.bio.getDOMNode().value.trim();
        this.props.onEditPerson({
            id: this.props.id,
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
    onEditButton: function() {
        this.setState({showedit: true});
        return false;
    },
    onCancelEdit: function() {
        this.setState({showedit: false});
        return false;
    },
    render: function() {
        var person = <div>
            <h3>{this.props.name}</h3>
            <p>phone={this.props.phone}</p>
            <p>website=<a href={this.props.website}>{this.props.website}</a></p>
            <p>fromloc={this.props.fromloc}</p>
            <p>toloc={this.props.toloc}</p>
            <p>github=<a href={"https://github.com/"+this.props.github}>{this.props.github}</a></p>
            <p>twitter=<a href={"https://twitter.com/"+this.props.twitter}>{this.props.twitter}</a></p>
            <p>email={this.props.email}</p>
            <p>bio={this.props.bio}</p>
            <button onClick={this.onEditButton}>edit</button>
            </div>;
        var editform = <form>
            <input type="text" placeholder="name (required)" ref="name" defaultValue={this.props.name} /><br />
            <input type="text" placeholder="phone" ref="phone" defaultValue={this.props.phone} /><br />
            <input type="text" placeholder="website" ref="website" defaultValue={this.props.website} /><br />
            <input type="text" placeholder="fromloc" ref="fromloc" defaultValue={this.props.fromloc} /><br />
            <input type="text" placeholder="toloc" ref="toloc" defaultValue={this.props.toloc} /><br />
            <input type="text" placeholder="github" ref="github" defaultValue={this.props.github} /><br />
            <input type="text" placeholder="twitter" ref="twitter" defaultValue={this.props.twitter} /><br />
            <input type="text" placeholder="email" ref="email" defaultValue={this.props.email} /><br />
            <textarea placeholder="bio" ref="bio" defaultValue={this.props.bio} /><br />
            <button onClick={this.onEdit}>edit person</button>
            <button onClick={this.onCancelEdit}>cancel</button>
            </form>;
        if (this.state.showedit == true) {
            return editform;
        } else {
            return person;
        }
    }
});
var PersonList = React.createClass({
    handleEditPerson: function(person) {
        $.ajax({
            url: "person/edit",
            dataType: 'json',
            type: 'POST',
            data: {session: getSession(), person: person},
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render: function() {
        var that = this;
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
            id={person.id}
            onEditPerson={that.handleEditPerson}
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
