import React from 'react';
import { ReactComponent as Hamburger } from './hamburger.svg';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './App.css';


class App extends React.Component {
  state = {
    items: [
      {
        question:  "How likely is it that you would recommend this company to a friend or colleague?e",
        id:  0,
        weight:  0,
        selected:  false
      },
      {
        question:  "Overall, how satisfied or dissatisfied are you with our company?t",
        id:  1,
        weight:  1,
        selected:  false
      },
      {
        question:  "Which of the following words would you use to describe our products? Select all that apply.e",
        id:  2,
        weight:  2,
        selected:  false
      },
      {
        question:  "How well do our products meet your needs?",
        id:  3,
        weight:  3,
        selected:  false
      },
      {
        question:  "How would you rate the quality of the product?",
        id:  4,
        weight:  4,
        selected:  false
      },
      {
        question:  "How would you rate the value for money of the product?",
        id:  5,
        weight:  5,
        selected:  false
      },
      {
        question:  "How responsive have we been to your questions or concerns about our products?",
        id:  6,
        weight:  6,
        selected:  false
      },
      {
        question:  "How long have you been a customer of our company?",
        id:  7,
        weight:  7,
        selected:  false
      },
      {
        question:  "How likely are you to purchase any of our products again?",
        id:  8,
        weight:  8,
        selected:  false
      },
      {
        question:  "Do you have any other comments, questions, or concerns?",
        id:  9,
        weight:  9,
        selected:  false
      }
    ]
  };


  onDragStart = (e, id) => {
    this.i = 0;
    this.draggedItem = this.state.items[id];
    e.dataTransfer.setData("id", this.draggedItem.id);
    e.target.style.opacity = '0.3';
  };

  onDragEnd = (e, id) => {
    e.target.style.opacity = '1';
  };


  onDragOver = (e) => {
    e.preventDefault();
    e.target.closest('UL').style.border = '3px solid #21D152';
  };

  onDragOverItem = (e, id) => {
    var items;
    if (this.draggedItem.selected) {
      const draggedOverItem = this.state.items[id];
      if (this.draggedItem === draggedOverItem) {
        return;
      }

      items = this.state.items.filter(item => item !== this.draggedItem);
      items.splice(id, 0, this.draggedItem);

      this.setState({
        ...this.state,
        items
      });
    }
  };


  onDragLeave = (e) => {
    e.target.closest('UL').style.border = '3px solid #BBD1D1';
  };

  onDrop = (e) => {
    e.target.closest('UL').style.border = '3px solid #BBD1D1';
    let id = e.dataTransfer.getData('id');
    let items = this.state.items.filter((item) => {
      if (item.id == id) {
        item.selected = true;
      }
      return item;
    });

    this.i = 0;

    this.setState({
      ...this.state,
      items
    });
  };

  onClose = (e) => {
    let id = e.target.parentNode.getAttribute('data-id');
    let items = this.state.items.filter((item) => {
      if (item['id'] == id) {
        item.selected = false;
      }

      return item;
    });

    this.setState({
      ...this.state,
      items
    });
  };

  onSave = (e) => {
    var request = new XMLHttpRequest();
    request.open('POST', 'https://reqres.in/api/unknown', true);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.onload = function(){
      let message = document.getElementsByClassName('message')[0];
      message.textContent = 'Thsnk you! It is saved!';
      message.classList.toggle('alert');
      console.log(request.responseText);
      setTimeout(() => {
        message.classList.toggle('alert');
      }, 1500);
    };
    request.send(JSON.stringify(this.state.items));

  };



  render() {
    var lists = {
      list: [],
      selected: []
    };

    this.state.items.forEach((i, idx) => {
      let target = lists.list;
      let selected = i.selected;
      let weight = i.weight;
      let id = i.id;
      if(i.selected) {
        target = lists.selected;
        weight = this.i++;
      }

      target.push(
        <li
          key={idx} data-id={id} data-selected={selected} data-weight={weight} draggable="true"
          onDragStart = {(e, id) => this.onDragStart(e, idx)}
          onDragEnd = {(e) => this.onDragEnd(e)}
          onDragOver = {(e, id) => this.onDragOverItem(e, idx)}>
          <div className="drag">
            <Hamburger />
          </div>
          {i.question}
          <span className="close"
                onClick = {(e) => this.onClose(e)}>

          </span>
        </li>
      );
    });

    return (
      <div className="App">
        <Container>
          <Row>
            <Col className="left">
              <h3>Chosen items</h3>
              <ul onDragOver = {(e) => this.onDragOver(e)}
                  onDragLeave = {(e) => this.onDragLeave(e)}
                  onDrop = {(e) => this.onDrop(e)}>
                {lists.selected}
              </ul>
              <div className="align">
                <Button
                  variant="primary" size="lg" active
                  onClick = {(e) => this.onSave(e)}>
                  Save
                </Button>
              </div>
              <div className="message"></div>
            </Col>
            <Col className="right">
              <h3>List of items</h3>
              <ul>
                {lists.list}
              </ul>
            </Col>
          </Row>
        </Container>;
      </div>
    );
  }
}


export default App;
