import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router";
export default function InProgress() {
    const [currentUser, setCurrentUser] = useState(''); //setup to load get request into this variable
    const navigate = useNavigate(); //navigation import
    
    //function to finish helping a user 
    async function finishBefore(e) {
        e.preventDefault();
        const splitStr = window.location.href.split('/');
        const id = splitStr[4];
        await fetch(`http://localhost:5000/popsession/${id}`, { //remove the user from the queue
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ sessionID: currentUser.sessionID }),
        })
        .catch(error => {
        window.alert(error);
        return;
        });
        navigate(`/manage/${id}/${splitStr[5]}`); //navigate back to the manage page
    }

    //function to navigate back to the manage page if the user leaves
    async function finishAfter(e) {
        e.preventDefault();
        const splitStr = window.location.href.split('/');
        const id = splitStr[4];
        navigate(`/manage/${id}/${splitStr[5]}`); //navigation route
    }

    useEffect(() => { //get the user currently being helped
        const splitStr = window.location.href.split('/');
        const id = splitStr[4];
        const getCurrentUser = async () => {
            return fetch(`http://localhost:5000/current/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setCurrentUser(data);
            });
        }
        getCurrentUser();
    }, [])

    if(currentUser === null){ //if the current user has left, navigate back using finishAfter
        return(
            <div style={{textAlign: "center"}}>
                <div>
                    User has left
                </div>
                <div>
                    <button onClick={finishAfter}>Onto the next</button>
                </div>
            </div>
    
        );
    }
    return( //otherwise, navigate back using finishBefore
        <div style={{textAlign: "center"}}>
            <div>
                Currently helping {currentUser.name}
            </div>
            <div>
                <button onClick={finishBefore}>Onto the next</button>
            </div>
        </div>

    );
}