import React, { Component } from 'react';
import { fetchDataFromServer , deleteDataFromServer, updatePostOnServer} from './helpers';
import { error } from 'util';
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

class App extends Component {
  state = {
    data: null,
    error: null,
    editable: false,
    itemToUpdate: null
  }

  componentDidMount() {
    fetchDataFromServer()
      .then(data => this.setState({data}))
      .catch(error => toastr.error('Error occured while loading data from server'))
  }

  handleDelete(request) {
    const {data} = this.state
    const newData = data[request.type].filter(item => item.id !== request.id);
    deleteDataFromServer(request)
      .then(() => {
        toastr.success(`${request.type} ${request.id} successfully deleted`)
        this.setState({data: {...this.state.data, [request.type]: newData}}
      )})
      .catch(error => toastr.error(`${request.type} ${request.id} was not deleted`))
  }


  handleUpdate(request) {
    const {editable, data} = this.state;
    if(editable) {
      updatePostOnServer(request)
        .then(() => {
          toastr.success(`Post ${request.id} successfully updated`);
          this.setState((prevState) => ({
            editable: !prevState.editable
        }))})
    } else {
      this.setState((prevState) => ({
        editable: !prevState.editable,
        itemToUpdate: request.id
      }))
    }
  }

  renderAll() {
    const {data, editable, itemToUpdate} = this.state;
    let item;
    let result = [];
    for(let key in data) {
      item = data[key].map((item, idx) => (
        <tr key={idx}>
          <td contentEditable={editable && (item.id === itemToUpdate)} dangerouslySetInnerHTML={{__html:(item.title || item.username) }} />
          <td><button onClick={() => this.handleDelete({id:item.id, type: key})}>Delete</button></td>
          <td>{key === 'posts'?<button onClick={() => this.handleUpdate({id: item.id, data: item})}>{editable && (item.id === itemToUpdate)? 'Update': 'Edit'}</button>: null}</td>
        </tr>))
      result.push(item);
    }

    return result;
  }

  render() {
    if(!this.state.data) return <div>Loading...</div>;

    return (
      <div className="App">
      <h3> Front End Test @ Jibble </h3>
        <table className="table table-tripped">
          <thead>
            <tr>
              <th>Title/Username</th>
              <th>Delete</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {this.renderAll()}
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
