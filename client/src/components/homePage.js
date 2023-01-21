import React from "react";
import { useNavigate } from "react-router-dom";
export default function HomePage() {
    let navigate = useNavigate(); //functions that navigate to the pages to create or join a session
    const createChange = () => {
      navigate("create");
    }
    const joinChange = () => {
      navigate("join");
    }
      return ( //displays a welcome message with buttons to create or join a session
        <div style={{textAlign: "center"}}>
          <div>
             Welcome to TAQDeck!
          </div>
          <div>
            <button onClick={createChange}>
              Create Session
            </button>
          </div>
          <div>
            <button onClick={joinChange}>
              Join Session
            </button>
          </div>
        </div>
      );
    }
    