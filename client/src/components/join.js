import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
 
export default function Join() {
  const [queues, setQueues] = useState(''); //setup to load get request into this variable
  const [form, setForm] = useState({ //setup to load get request into this variable
    sessionName: "",
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
   //check if the session name exists
   for(let i = 0; i < queues.length; i++){
      if(queues[i].name === form.sessionName){
        exists = true;
      }
   }

   if(exists){ //if it exists, add the user to the specified session
    await fetch("http://localhost:5000/join", { //add the user and session ID to the session
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
    setForm({ sessionName: "", name: "" });
    navigate(`/view/${form.sessionName}/${form.sessionID}`); //navigate to the page to view the session
   }
   else{ //if it doesn't exist, prompt the user to try again
    alert("No such session name exists. Try again");
   }
 }

 useEffect(() => { //when the page loads, retrieve the list of queues to avoid joining a session that doesn't exist
  const getQueues = async () => {
      return fetch(`http://localhost:5000/queues`)
      .then((response) => response.json())
      .then((data) => {
          setQueues(data);
      });
  }
  getQueues();
}, [])
 
 //return a form to join the specified user-specified session 
 return (
   <div style={{textAlign: "center"}}>
     <h3>Join Session</h3>
     <form onSubmit={onSubmit}>
       <div className="form-group">
         <label htmlFor="name">Session Name</label>
         <input
           type="text"
           className="form-control"
           id="name"
           value={form.sessionName}
           onChange={(e) => updateForm({ sessionName: e.target.value })}
         />
       </div>
       <div className="form-group">
         <label htmlFor="name">Your Name</label>
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
           value="Join session"
           className="btn btn-primary"
         />
       </div>
     </form>
   </div>
 );
}
