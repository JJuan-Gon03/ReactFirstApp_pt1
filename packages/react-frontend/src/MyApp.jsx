// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
    const [characters, setCharacters] = useState([]);

function removeOneCharacter(index) {
  const userToDelete = characters[index];

  fetch(`http://localhost:8000/users/${userToDelete._id}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (res.status === 204) {
        const updated = characters.filter((user, i) => i !== index);
        setCharacters(updated);
      } else if (res.status === 404) {
        console.log("User not found on backend.");
      } else {
        console.log(`Unexpected status code: ${res.status}`);
      }
    })
    .catch((error) => {
      console.log("Error deleting user:", error);
    });
}

    function fetchUsers() {
        const promise = fetch("http://localhost:8000/users");
        return promise;
    }

    useEffect(() => {
        fetchUsers()
            .then((res) => res.json())
            .then((json) => setCharacters(json["users_list"]))
            .catch((error) => { console.log(error); });
    }, [] );

    function postUser(person) {
        const promise = fetch("http://localhost:8000/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(person),
        });

        return promise;
    }

function updateList(person) { 
    postUser(person)
    .then((res) => {
        if (res.status === 201) {
            return res.json();
        } else {
            console.log(`HTTP status: ${res.status}`);
            return null;
        }
    })
    .then((createdUser) => {
        setCharacters(prev => [...prev, createdUser]);
    })
    .catch((error) => {
        console.log("Error adding user:", error);
    });
}

    return (
        <div className="container">
        <Table 
            characterData = {characters}
            removeCharacter = {removeOneCharacter}
        />
        <Form handleSubmit = {updateList} />
        </div>
    );
}

export default MyApp;