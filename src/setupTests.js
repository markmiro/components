import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import jsdom from "jsdom";

configure({ adapter: new Adapter() });

const doc = jsdom.jsdom(
  "<!doctype html><html><body><div id='react-app'></div></body></html>"
);
global.document = doc;
global.window = doc.defaultView;
global.console.log = () => {};
