import React from "react";
import "./Servers.css";
import AddIcon from "@material-ui/icons/Add";
import ExploreIcon from "@material-ui/icons/Explore";
import Popup from "reactjs-popup";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import Switch from "@material-ui/core/Switch";
import { Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import grey from "@material-ui/core/colors/grey";

// const currencies = [
//   {
//     value: "Music",
//     label: "Music",
//   },
//   {
//     value: "Gaming",
//     label: "Gaming",
//   },
//   {
//     value: "Education",
//     label: "Education",
//   },
//   {
//     value: "Science & Tech",
//     label: "Science & Tech",
//   },
//   {
//     value: "Entertainment",
//     label: "Entertainment",
//   },
// ];
const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
  orange: {
    color: theme.palette.getContrastText(grey[800]),
    backgroundColor: grey[800],
  },
}));

function Server() {
  const classes = useStyles();
  const history = useHistory();
  const [currency, setCurrency] = useState("ERU");
  const [servers, setServers] = useState([]);
  const token = localStorage.getItem("auth-token");
  const [enteredlink, setEnteredlink] = useState("");
  const [newservername, setNewservername] = useState("");
  const [setprivacy, setsetprivacy] = React.useState({
    public: false,
    private: true,
  });
  const [serverDesc, setServerDesc] = useState("");
  const [serverName, setserverName] = useState("");

  useEffect(() => {
    (async () => {
      const serverData = await axios.get("/api/group", {
        headers: { "x-auth-token": token },
      });

      console.log(serverData.data);
      setServers(serverData.data);
    })();
  }, []);

  // const handleChange = (event) => {
  //   setCurrency(event.target.value);
  // };

  const handleChange = (event) => {
    setsetprivacy({ ...setprivacy, [event.target.name]: event.target.checked });
  };

  const joinserver = async (e) => {
    e.preventDefault();
    try {
      if (!token) {
        alert("Please login first");
      } else {
        const temp = await axios.post(
          "/api/group/groupinvite/" + enteredlink,
          null,
          { headers: { "x-auth-token": token } }
        );
        history.push("/channels/" + temp.data.message);
        window.location.reload();
      }
    } catch (err) {
      console.log(err.response.data.message);
      alert(err.response.data.message);
    }
  };

  const createserver = async (e) => {
    e.preventDefault();
    try {
      if (!token) {
        alert("Please login first");
      } else if (serverName == "") {
        alert("enter a server name");
      } else {
        var privacy = "private";
        if (setprivacy.private == false) {
          privacy = "public";
        }
        const temp = await axios.post(
          "/api/group/create",
          {
            g_name: serverName,
            g_desc: serverDesc,
            g_type: privacy,
          },
          { headers: { "x-auth-token": token } }
        );
      }
    } catch (err) {
      console.log(err.response.data.message);
      alert(err.response.data.message);
    }
    window.location.reload();
  };

  return (
    <div className="servers">
      <div
        className="tooltip server-icons"
        onClick={() => history.push("/channels/@me")}
      >
        <span className="tooltiptext">Home</span>
        <span>@me</span>
      </div>

      <div className="server-seperator"></div>

      {servers.map((server) => {
        return (
          <div
            key={server.g_id}
            className="tooltip server-icons "
            onClick={() => history.push("/channels/" + server.g_id)}
          >
            <span className="tooltiptext">{server.g_name}</span>
            <span></span>
            <Avatar
              className={`${classes.large} ${classes.orange}`}
              src={server.g_pp}
            >
              {server.g_name.charAt(0).toUpperCase()}
            </Avatar>
          </div>
        );
      })}

      <div className="server-seperator"></div>
      <Popup
        trigger={
          <div className="tooltip reg-icons">
            <span className="tooltiptext">Add a Server</span>
            <span>
              <AddIcon
                style={{ height: "30px", width: "30px", paddingTop: "6px" }}
              />
            </span>
          </div>
        }
        modal
        nested
      >
        {(close) => (
          <div className="join-create">
            <form className="modal">
              <div className="create-top">
                <div className="top-left">
                  <div className="create-header"> Create your Server </div>
                </div>
                <div className="top-right">
                  <IconButton onClick={close}>
                    <CloseIcon />
                  </IconButton>
                </div>
              </div>
              <p className="create-info">
                Your server is where you and your friends hang out. Make yours
                and start talking.
              </p>
              <div className="content">
                <h2>Server Name</h2>
                <input
                  placeholder="Server Name"
                  value={serverName}
                  onChange={(e) => setserverName(e.target.value)}
                  className="serv-name"
                  required
                ></input>
                <h2>Server Description</h2>
                <input
                  placeholder="Server Description"
                  value={serverDesc}
                  onChange={(e) => setServerDesc(e.target.value)}
                  className="serv-name"
                  required
                ></input>
                <div className=" content privacy__settings">
                  <h2>Public</h2>
                  <Switch
                    checked={setprivacy.private}
                    onChange={handleChange}
                    name="private"
                    inputProps={{ "aria-label": "secondary checkbox" }}
                  />
                  <h2>Private</h2>
                </div>
              </div>
              <div className="actions">
                <button
                  type="submit"
                  className="create-button"
                  onClick={createserver}
                >
                  Create
                </button>
              </div>
            </form>
            <form
              className="modal"
              style={{
                marginTop: "auto",
                marginBottom: "auto",
              }}
            >
              <div className="create-top">
                <div className="top-left">
                  <div className="create-header"> Join a Server </div>
                </div>
                <div className="top-right">
                  <IconButton onClick={close}>
                    <CloseIcon />
                  </IconButton>
                </div>
              </div>
              <p className="create-info">
                Enter an invite below to join an existing server.
              </p>
              <div className="content">
                <h2>INVITE LINK</h2>
                <input
                  placeholder="MTc3MjE3"
                  value={enteredlink}
                  onChange={(e) => setEnteredlink(e.target.value)}
                  className="serv-name"
                  style={{ background: " #CCCCCC", border: "0" }}
                  required
                ></input>
              </div>
              <div className="actions">
                <button
                  type="submit"
                  className="join-button"
                  onClick={joinserver}
                >
                  Join Server
                </button>
              </div>
            </form>
          </div>
        )}
      </Popup>
      <div
        className="tooltip reg-icons"
        onClick={() => history.push("/channels/@explore")}
      >
        <span className="tooltiptext">Explore Servers</span>
        <span>
          <ExploreIcon
            style={{ height: "30px", width: "30px", paddingTop: "6px" }}
          />
        </span>
      </div>
    </div>
  );
}

export default Server;
