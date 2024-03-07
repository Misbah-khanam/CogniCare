import logo from './logo.svg';
import './App.css';
import Allroutes from './Allroutes';
import {BrowserRouter} from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Allroutes/>
      </BrowserRouter>
    </div>
  );
}

export default App;
