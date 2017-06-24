import React, { Component } from 'react';
import moment from 'moment';
import Defiant from 'defiant';
import logo from './shmoogle.png';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serp: false,
      value: '',
      articles: [],
      filteredArticles: [],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.goHome = this.goHome.bind(this);
  }
  getAllArticles() {
    const endpoint = fetch('https://dl.dropboxusercontent.com/s/eqhwy5rbqa367ql/data-small.json');
    // const endpoint = fetch('https://dl.dropboxusercontent.com/s/eqhwy5rbqa367ql/data-medium.json');
    // const endpoint = fetch('https://dl.dropboxusercontent.com/s/eqhwy5rbqa367ql/data-big.json');
    // const endpoint = fetch('https://dl.dropboxusercontent.com/s/eqhwy5rbqa367ql/data-bigger.json');
    endpoint
      .then(data => data.json())
      .then((data) => {
        this.setState({
          articles: data.articles,
        }, () => {
          console.log(this.state.articles)
        });
      });
  }
  getFilteredArticles() {
    const snapshot = Defiant.getSnapshot(this.state.articles);
    const search = JSON.search(snapshot, '//*[contains(TITLE, "' + this.state.value + '")]');
    console.log(search)
    this.setState({
      filteredArticles: search,
    });
  }
  handleSubmit(event) {
    this.setState({
      serp: true,
    });
    this.getFilteredArticles();
    event.preventDefault();
  }
  handleChange(event) {
    this.setState({
      value: event.target.value,
    });
  }
  goHome() {
    this.setState({
      serp: false,
      value: '',
      filteredArticles: [],
    })
  }
  componentDidMount() {
    this.getAllArticles();
  }
  render() {
    if (this.state.serp) {
      return (
        <div>
          <div className="serp-input">
            <img src={logo} alt="logo" className="logo" onClick={() => this.goHome()}/>
            <form onSubmit={this.handleSubmit}>
              <input
                type="text"
                className="search-input"
                value={this.state.value}
                onChange={this.handleChange}
              />
            </form>
          </div>
          <div className="serp-view">
            {
              this.state.filteredArticles.map((article) => {
                return (
                  <div className="article" key={article.ID}>
                    <a href={article.URL} className="name" target="_blank" rel="noopener noreferrer">{article.TITLE}</a>
                    <div>
                      <span className="publisher">{article.PUBLISHER}</span>
                      <span className="time">{moment.unix(article.TIMESTAMP/1000).format("DD MMM YYYY hh:mm a")}</span>
                    </div>
                    <div>
                      <span className="time">{article.HOSTNAME}</span>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      );
    } else {
      return (
        <div className="search-view">
          <img src={logo} alt="logo" className="logo" />
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              className="search-input"
              value={this.state.value}
              onChange={this.handleChange}
              placeholder="Search articels here..."
            />
          </form>
        </div>
      );
    }
  }
}

export default App;
