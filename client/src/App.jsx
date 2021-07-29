import { Switch, Route } from 'react-router-dom';
import ChoicePath from './components/Ways/ChoicePath';
import SecretPath from './components/Ways/SecretPath';
import DefaulPath from './components/Ways/DefaulPath';
function App() {
  return (
    <Switch>
      <Route exact path="/">
        <ChoicePath />
      </Route>
      <Route path="/secret">
        <SecretPath />
      </Route>
      <Route exact path="/">
        <DefaulPath />
      </Route>
    </Switch> 
  )
}

export default App;
