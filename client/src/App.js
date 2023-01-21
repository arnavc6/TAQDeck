import React from "react"; //react imports including router to go to other pages
import { Route, Routes } from "react-router-dom";
 
//imports for all the other pages
import HomePage from "./components/homePage";
import Create from "./components/create";
import Manage from "./components/manage";
import InProgress from "./components/inprogress";
import Join from "./components/join";
import View from "./components/view";
 
const App = () => { //router for the other pages, displays homepage by default
 return (
   <div>
     <Routes>
       <Route exact path="/" element={<HomePage />} />
       <Route path="/create" element={<Create />} />
       <Route path="/join" element={<Join />} />
       <Route path="/manage/:name/:sessionID" element={<Manage />} />
       <Route path="/inprogress/:name/:sessionID" element={<InProgress />} />
       <Route path="/view/:sessionName/:sessionID" element={<View />} />
     </Routes>
   </div>
 );
};
 
export default App;
