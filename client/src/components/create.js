import React, { useState, useEffect } from "react"; //imports to load form data and navigate to other pages
import { useNavigate } from "react-router";
 
export default function Create() {
  const [queues, setQueues] = useState(''); //setup to load get request into this variable
  const [form, setForm] = useState({ //setup to load get request into this variable
    name: "",
    sessionID: generateSessionID(),
  });
  const navigate = useNavigate(); //navigation import

  function generateSessionID() { //function to generate a random 6-character session ID
    var result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( var i = 0; i < 6; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
 
 //function to update the form as the user types in values
 function updateForm(value) {
   return setForm((prev) => {
     return { ...prev, ...value };
   });
 }
 
 //function to handle submission
 async function onSubmit(e) {
   e.preventDefault();
   const newSession = { ...form };

   let exists = false;
  //check if the session name already exists
   for(let i = 0; i < queues.length; i++){
      if(queues[i].name === form.name){
        exists = true;
      }
   }

   if(exists){ //if it exists, prompt the user to try again
    alert("A session by this name already exists. Try again");
   }

   else{ //if it doesn't exist, make a post request to add a new session
    await fetch("http://localhost:5000/create", { //create a collection in MongoDB by the name of the session
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify(newSession),
   })
   .catch(error => {
     window.alert(error);
     return;
   });

   await fetch("http://localhost:5000/addqueue", { //add the session name to the list of queues
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify({ name: form.name }),
   })
   .catch(error => {
     window.alert(error);
     return;
   });
   setForm({ name: "" });
   navigate(`/manage/${form.name}/${form.sessionID}`); //navigate to the page to manage the session
   }
 }

 useEffect(() => { //when the page loads, retrieve the list of queues to avoid session duplication
  const getQueues = async () => {
      return fetch(`http://localhost:5000/queues`)
      .then((response) => response.json())
      .then((data) => {
          setQueues(data);
      });
  }
  getQueues();
}, [])
 //return a form to start a session with the user-specified session name
 return (
   <div style={{textAlign: "center"}}>
     <h3>Create New Session</h3>
     <form onSubmit={onSubmit}>
       <div className="form-group">
         <label htmlFor="name">Name</label>
         <input
           type="text"
           className="form-control"
           id="name"
           value={form.name}
           onChange={(e) => updateForm({ name: e.target.value })}
         />
       </div>
       <div className="form-group">
         <input
           type="submit"
           value="Start session"
           className="btn btn-primary"
         />
       </div>
     </form>
   </div>
 );
}
