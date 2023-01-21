import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router";
export default function Manage() {
    const [queueData, getQueueData] = useState(''); //setup to load get request into this variable
    const navigate = useNavigate(); //navigation import
    
    //function to help a user
    async function help(e) {
        e.preventDefault();
        const splitStr = window.location.href.split('/');
        const id = splitStr[4];
        await fetch(`http://localhost:5000/help/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ sessionID: users[0][1].sessionID }),
        })
        .catch(error => {
        window.alert(error);
        return;
        });
        navigate(`/inprogress/${splitStr[4]}/${splitStr[5]}`); //navigate to in progress page
    }

    //function to end a session
    async function end(e){ 
        e.preventDefault();
        const splitStr = window.location.href.split('/');
        const id = splitStr[4];
        await fetch(`http://localhost:5000/endsession/${id}`, { //delete collection
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .catch(error => {
            window.alert(error);
            return;
        });
        await fetch(`http://localhost:5000/removequeue/${id}`, { //delete collection name from the list of queues
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .catch(error => {
            window.alert(error);
            return;
        });
        navigate("/"); //navigate back to homepage
    }

    useEffect(() => { //when the page loads, get a list of users
        const splitStr = window.location.href.split('/');
        const id = splitStr[4];
        const getSessionInfo = async () => {
            return fetch(`http://localhost:5000/manage/${id}`)
            .then((response) => response.json())
            .then((data) => {
                getQueueData(data);
            });
        }
        getSessionInfo();
    }, [])

    const users = Object.entries(queueData); //convert JSON object to array

    if(queueData.length === 0){ //say the queue is empty if no one is in it
        return(
            <div style={{textAlign: "center"}}>
                <div>Queue is empty</div>
                <button onClick={end}>End session</button>
            </div>
        );
    }
    else{ //if there are people in the queue, list it
        return(
            <div style={{textAlign: "center"}}>
                <h3>{queueData.length} in queue</h3>
                {users.map((user) =>(
                    <div key={user[1]._id}>{user[1].name}</div>
                ))}
                <div>
                    <button onClick={help}>Help First User</button>
                </div>
                <div>
                    <button onClick={end}>End session</button>
                </div>
            </div>
    
        );
    }
}