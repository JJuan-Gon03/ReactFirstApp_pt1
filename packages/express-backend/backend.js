// backend.js
import express from "express";
import cors from "cors";
import userServices from "./user-services.js";

const app = express();
const port = 8000;

/*const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor"
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    }
  ]
};*/

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const findUserByName = (name) => {
  /*return users["users_list"].filter(
    (user) => user["name"] === name
  );*/
  return userServices.findUserByName(name);
};

const findUserByJob = (job) =>{
/*return users["users_list"].filter(
  (user) => user.job === job
  );*/
  return userServices.findUserByJob(job);
};

const findUsersByNameAndJob = (name, job) =>{
  /*return users["users_list"].filter(
    (user) => user.name === name && user.job === job
  );*/
  return userServices.findUsersByNameAndJob(name, job);
};

const findUserById = (id) =>{
  //users["users_list"].find((user) => user["id"] === id);
  return userServices.findUserById(id);
}

const addUser = (user) => {
  /*users["users_list"].push(user);
  return user;*/
  return userServices.addUser(user);
};

const delUser = (id) =>
  userServices.deleteUser(id).then((doc) => Boolean(doc));


app.get("/users", (req, res) => {
  const { name, job } = req.query;
  //let result = users["users_list"];

  /*if (name && job) {
    result = findUsersByNameAndJob(name, job);
    result = { users_list: result }; 
    res.send(result);
  } else if (name) {
    result = findUserByName(name); 
    result = { users_list: result }; 
    res.send(result);
  } else if (job) {
    result = findUserByJob(job);
    result = { users_list: result }; 
    res.send(result);
  } else {
    result = userServices.getUsers(undefined, undefined)
    res.send(result);
  }*/

  if (name && job) {
    return userServices.findUsersByNameAndJob(name, job)
      .then(users => res.send({ users_list: users }))
      .catch(err => {
        console.error(err);
        res.status(500).send({ error: "Internal Server Error" });
      });

  }

  if (name) {
    return userServices.findUserByName(name)
      .then(users => res.send({ users_list: users }))
      .catch(err => {
        console.error(err);
        res.status(500).send({ error: "Internal Server Error" });
      });
  }

  if (job) {
    return userServices.findUserByJob(job)
      .then(users => res.send({ users_list: users }))
      .catch(err => {
        console.error(err);
        res.status(500).send({ error: "Internal Server Error" });
      });
  }

  return userServices.getUsers(undefined, undefined)
    .then(users => res.send({ users_list: users }))
    .catch(err => {
      console.error(err);
      res.status(500).send({ error: "Internal Server Error" });
    });
});

app.get("/users/:id", (req, res) => {
  /*const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
  */
  userServices.findUserById(req.params.id)
    .then(user => {
      if (!user) return res.status(404).send("Resource not found.");
      res.send(user);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send({ error: "Internal Server Error" });
    });
});

app.post("/users", (req, res) => {
  /*const userToAdd = req.body;
  let genID = (Math.floor(Math.random()*(999999 - 100000 + 1)) + 100000).toString();
  const newUser = {
    ...userToAdd,
    id: genID,
  };

  users["users_list"].push(newUser);

  res.status(201).send(newUser);
  */
  userServices.addUser(req.body)
    .then(created => res.status(201).send(created))
    .catch(err => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ error: err.message });
      }
      console.error(err);
      res.status(500).send({ error: "Internal Server Error" });
    });
});

app.delete("/users/:id", (req, res) => {
  /*const id = req.params.id;
  const deleted = delUser(id);

  res
    .status(deleted ? 204 : 404)
    .send(deleted ? { message: `User ${id} deleted.` } : { error: "User not found." });
    */
  userServices.deleteUser(req.params.id)
  .then(deletedDoc => {
    if (!deletedDoc) return res.status(404).send({ error: "User not found." });
    res.status(204).end();
  })
  .catch(err => {
    console.error(err);
    res.status(500).send({ error: "Internal Server Error" });
  });
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});