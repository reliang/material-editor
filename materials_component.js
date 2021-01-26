const {
    colors,
    CssBaseline,
    ThemeProvider,
    Typography,
    Container,
    makeStyles,
    createMuiTheme,
    Box,
    Button,
    Grid,
    Paper,
    SvgIcon,
    Link,
    List,
    ListItem,
    ListItemText,
} = MaterialUI;

const host = "localhost";
const port = 3000;

function ButtonGroup(props) {
    let className = 'btn delete';
    if (props.canDelete) {
        className += ' active'
    }
    return (
        <div className="btn-group">
            <button className="btn add" onClick={(event)=>props.addHandler()}>Add</button>
            <button className={className}  onClick={(event)=>props.removeHandler()}>Delete</button>
        </div>
    );
}

/*
function ListItem(props) {
    return (
        <li onClick={this.props.onClick(item.id)}  className="list-item"><p>{props.name}</p></li>
    );
}
*/

function ListGroup(props) {
    const items = props.materials;
    //console.log(items);
    if (!items || items.length === 0 || !Array.isArray(items)) return (
        <div className="list">
            <p className="no-materials-text">No Materials Yet</p>
        </div>
    );
    return (
        <div className="list">
            <List component="nav" style={{paddingTop:0, }}>
                {items.map((item) => {
                    let className = "list-item";
                    if (props.selectedId === item.id) {
                        className += " selected";
                        //console.log("selected: " + index);
                    }
                    //console.log(index);
                    return (
                        <ListItem 
                            button
                            className={className}
                            selectedId={props.selectedId === item.id}
                            onClick={() => props.listClickHandler(item.id)}
                            key={item.id} 
                        >
                            <ListItemText primary={item.name} secondary={item.volume + " m3"}/>
                        </ListItem>
                    );
                })
                }
            </List>
        </div>
    );
}

function InputGroup(props) {

    return (
        <div className="form-container">
            <form className="form">
                <label>
                    <p>Name:</p>
                    <input type="text" name="name" />
                </label>
                <br/>
                <br/>
                <label>
                    <p>Volume:</p>
                    <input type="text" name="volume" />
                </label>
                <br/>
                <br/>
                <label>
                    <p>Cost:</p>
                    <input type="text" name="cost" />
                </label>
            </form>
        </div>
    );
}

function MaterialsBody(props) {
    var items = props.materials;
    var selected = items.find(item => item.id === props.selectedId);
    var name = "";
    var color = "orange";
    var volume = 0;
    var cost = 0;
    var date = 0;
    if (selected) {
        name = selected.name;
        volume = selected.volume;
        cost = selected.cost;
    }
    
    return (
        <div className="grid-container">
            <Grid container spacing={3} alignItems="stretch" className="grid">
                <Grid item xs={12} sm={4}>
                    <ListGroup 
                    materials={props.materials}  
                    listClickHandler={props.listClickHandler}
                    selectedId={props.selectedId} />
                </Grid>
                <Grid item xs={12} sm={8}>
                    
                    <div className="form-container">
                        <form className="form">
                            <label>
                                <p>Name</p>
                                <input type="text" name="name" value={name} onChange={(event)=>props.updateHandler(props.selectedId, event.target.value, color, volume, cost, date)}/>
                            </label>
                            <br/>
                            <br/>
                            <label>
                                <p>Volume (m<sup>3</sup>)</p>
                                <input type="text" pattern="[0-9]*" name="volume" value={volume}/>
                            </label>
                            <br/>
                            <br/>
                            <label>
                                <p>Cost (USD per m<sup>3</sup>)</p>
                                <input type="text" pattern="[0-9]*" name="cost" value={cost}/>
                            </label>
                        </form>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedId: -1,
            data: null,
            materials: [],
            isLoading: false,
            error: null,
        };

        this.listClickHandler = this.listClickHandler.bind(this);
        this.addHandler = this.addHandler.bind(this);
        this.removeHandler = this.removeHandler.bind(this);
        this.updateHandler = this.updateHandler.bind(this);
    }

    fetchList() {
        this.setState({isLoading: true});
        fetch('http://' + host + ':' + port + '/get?')
          .then(response => {
              if (response.ok) {
                  return response.json();
              } else {
                  throw new Error('Something went wrong...')
              }
          })
          .then(data => this.setState({ materials: data, isLoading: false }))
          .catch(error => this.setState({error, isLoading: false}));
    }

    componentDidMount() {
        this.fetchList();
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }
    

    listClickHandler(id) {
        this.setState({selectedId: id });
    }

    addHandler() {
        const {materials} = this.state;
        this.setState({isLoading: true})
        fetch('http://' + host + ':' + port + '/set?')
          .then(response => {
              if (response.ok) {
                  return response.json();
              } else {
                  throw new Error('Something went wrong...')
              }
          })
          .then(data => this.setState({materials: materials.concat(data), isLoading: false }))
          .catch(error => this.setState({error, isLoading: false}));
    }

    removeHandler() {
        const {selectedId, materials} = this.state;
        this.setState({isLoading: true})
        fetch('http://' + host + ':' + port + '/remove?id=' + selectedId)
          .then(response => {
              if (response.ok) {
                  return response.json();
              } else {
                  throw new Error('Something went wrong...')
              }
          })
          .then(data => this.setState({ materials: materials.filter(item=>item.id !== selectedId), selectedId: -1, isLoading: false}))
          .catch(error => this.setState({error, isLoading: false}));
    }

    updateHandler(id, name, color, volume, cost, date) {
        const {materials} = this.state;
        var queryName = name.replace(/ /g, '+');
        fetch('http://' + host + ':' + port + '/set?id=' + id + "&name=" + queryName + "&color=" + color + "&volume=" + volume + "&cost=" + cost + "&date=" + date)
          .then(response => {
              if (response.ok) {
                  return response.json();
              } else {
                  throw new Error('Something went wrong...')
              }
          })
          .then(data => {
              const newMaterials = materials;
              for (var i = 0; i < materials.length; i++) {
                  if (materials[i].id === id) {
                      newMaterials[i] = data;
                  }
              }
              this.setState({materials: newMaterials});
              //console.log(newMaterials);
          })
          .catch(error => this.setState({error}));
    }
    
    render() {
        const {selectedId, materials, isLoading, error} = this.state;
        if (error) {
            return <p>{error.message}</p>;
        }
        if (isLoading) {
            return <p>Loading...</p>;
        }
        if (selectedId === -1 && materials.length > 0) {
            this.setState({selectedId: materials[0].id})
        }

        //console.log(this.state.selectedId);
        //console.log(this.state.materials);
        return (
            <Container maxWidth="md">
            <div style={{ marginTop: 24, }}>
                <h1>
                Materials
                </h1>
                <ButtonGroup 
                canDelete={(materials.length > 0)} 
                addHandler={this.addHandler} 
                removeHandler={this.removeHandler}
                />
                <MaterialsBody 
                selectedId={selectedId} 
                listClickHandler={this.listClickHandler}
                updateHandler={this.updateHandler}
                materials={materials} 
                />
            </div>
            </Container>
        );
    }
    
}

ReactDOM.render(
    <App />,
    document.querySelector('#materials_comp_container'),
);