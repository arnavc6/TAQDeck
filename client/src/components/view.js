import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router";
export default function View() {
    const [user, getUser] = useState(''); //setup to load get request into this variable
    const navigate = useNavigate(); //navigation import

    //function to leave queue
    async function leaveBefore(e) {
        e.preventDefault();
        const splitStr = window.location.href.split('/');
        const sessionName = splitStr[4];
        const sessionID = splitStr[5];
        await fetch(`http://localhost:5000/leave/${sessionName}/${sessionID}`, { //remove user from session
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ sessionID: sessionID }),
        })
        .catch(error => {
        window.alert(error);
        return;
        });
        navigate("/"); //navigate back to homepage
    }

    //function to go to the homepage if the session host ends the session
    async function leaveAfter(e) {
        e.preventDefault();
        navigate("/");
    }

    useEffect(() => { //when the page loads, get a boolean value determining whether the user is ready to be helped by the session host or still in the queue
        async function getSessionInfo(){
            const splitStr = window.location.href.split('/');
            const sessionName = splitStr[4];
            const sessionID = splitStr[5];
            const session = await fetch(`http://localhost:5000/view/${sessionName}/${sessionID}`)
            .then((response) => response.json())
            .then((data) => {
                getUser(data);
            });
            return session;
        }
        getSessionInfo();
    }, [])
    if(user === null){ //if the session is over or if the user has already been helped, display a message that the user is no longer in the queue
        return(
            <div style={{textAlign: "center"}}>
                No longer in queue
                <div>
                    <button onClick={leaveAfter}>Back to homepage</button>
                </div>
            </div>
        );
    }
    if(user.helped){ //if the user is ready to be helped, notify them that they are to see the session host
        return(
            <div style={{textAlign: "center"}}>
                <h3>Your turn!</h3>
                <div>Please see the session host</div>
                <div>
                    <button onClick={leaveBefore}>Leave session</button>
                </div>
            </div>
        );
    }
    else{ //if the user is not first in the queue, notify them that they are in the queue
        return(
            <div style={{textAlign: "center"}}>
                You're in the queue!
                <div>
                    <button onClick={leaveBefore}>Leave session</button>
                </div>
            </div>
        );
    }
}