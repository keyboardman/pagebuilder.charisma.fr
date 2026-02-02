
import NodeWrapper from "../ManagerNode/NodeWrapper";
import { APP_MODE, useAppContext } from "../services/providers/AppContext";
import Builder from "./builder/Builder";

function App() {

  const { mode, nodes } = useAppContext();

  console.log('App: nodes', nodes);

  return mode === APP_MODE.VIEW ? <NodeWrapper /> : <Builder />

}

App.displayname = App;

export default App;
