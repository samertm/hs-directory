/** @jsx React.DOM */
var PersonAddForm = React.createClass({
    onSubmit: function() {
        var name = this.refs.name.getDOMNode().value.trim();
        var phone = this.refs.phone.getDOMNode().value.trim();
        var fromloc = this.refs.fromloc.getDOMNode().value.trim();
        var toloc = this.refs.toloc.getDOMNode().value.trim();
        var github = this.refs.github.getDOMNode().value.trim();
        var twitter = this.refs.twitter.getDOMNode().value.trim();
        var email = this.refs.email.getDOMNode().value.trim();
        var bio = this.refs.bio.getDOMNode().value.trim();
        this.props.handleAddPerson({
            name: name,
            phone: phone,
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
var Content = React.createClass({
    getInitialState: function() {
        return {showAddPerson: false};
    },
    onAddPerson: function() {
        this.setState({showAddPerson: true});
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
                <p>YAY :D</p> {logoutButton}
            {this.state.showAddPerson ?
             <PersonAddForm handleAddPerson={this.handleAddPerson}
             handleAddPersonCancel={this.handleAddPersonCancel} /> :
             addPersonButton}
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
            return <Content handleLogout={this.handleLogout} />
        } else {
            return login;
        }
    }
});
React.renderComponent(
        <Gatekeeper pollInterval={2000} />,
    document.getElementById("content")
);
