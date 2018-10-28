import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
const { JSDOM } = require("jsdom");

// https://github.com/airbnb/enzyme/blob/master/docs/guides/jsdom.md

configure({ adapter: new Adapter() });

const jsdom = new JSDOM("<!doctype html><html><body></body></html>");
const { window } = jsdom;

global.window = window;
global.document = window.document;
global.console.log = () => {};
