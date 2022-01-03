import { IconButton, Paper } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import FavoriteIcon from "@material-ui/icons/Favorite";
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import { API, graphqlOperation, Storage } from "aws-amplify";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { updateSong } from "../../graphql/mutations";
import { listSongs } from "../../graphql/queries";
import AddSong from "../AddSong";

const SongList = () => {
  const [songs, setSongs] = useState([]);
  const [songPlaying, setSongPlaying] = useState("");
  const [audioURL, setAudioURL] = useState("");
  const [showAddSong, setShowAddSong] = useState(false);

  const fetchSongs = async () => {
    try {
      const songData = await API.graphql(graphqlOperation(listSongs));
      const songList = songData.data.listSongs.items;
      setSongs(songList);
    } catch (error) {
      console.log("error on fetching songs", error);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const addLike = async (idx) => {
    try {
      const song = songs[idx];
      song.like = song.like + 1;
      delete song.createdAt;
      delete song.updatedAt;

      const songData = await API.graphql(
        graphqlOperation(updateSong, { input: song })
      );
      const songList = [...songs];
      songList[idx] = songData.data.updateSong;
      setSongs(songList);
    } catch (error) {
      console.log("error on adding Like to song", error);
    }
  };

  const toggleSong = async (idx) => {
    if (songPlaying === idx) {
      setSongPlaying("");
      return;
    }

    const songFilePath = songs[idx].filePath;
    try {
      const fileAccessURL = await Storage.get(songFilePath, { expires: 60 });
      console.log("access url", fileAccessURL);
      setSongPlaying(idx);
      setAudioURL(fileAccessURL);
      return;
    } catch (error) {
      console.log("error accessing the file from s3", error);
      setAudioURL("");
      setSongPlaying("");
    }
  };

  return (
    <div className="songList">
      {songs?.map((song, index) => (
        <Paper key={song.id} variant="outlined" elevation={2}>
          <div className="songCard">
            <IconButton aria-label="play" onClick={() => toggleSong(index)}>
              {songPlaying === index ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            <div>
              <div className="songTitle">{song.title}</div>
              <div className="songOwner">{song.owner}</div>
            </div>
            <div>
              <IconButton aria-label="like" onClick={() => addLike(index)}>
                <FavoriteIcon />
              </IconButton>
              {song.like}
            </div>
            <div className="songDescription">{song.description}</div>
          </div>
          {songPlaying === index ? (
            <div className="ourAudioPlayer">
              <ReactPlayer
                url={audioURL}
                controls
                playing
                height="50px"
                onPause={() => toggleSong(index)}
              />
            </div>
          ) : null}
        </Paper>
      ))}
      {showAddSong ? (
        <AddSong
          onUpload={() => {
            setShowAddSong(false);
            fetchSongs();
          }}
        />
      ) : (
        <IconButton onClick={() => setShowAddSong(true)}>
          <AddIcon />
        </IconButton>
      )}
    </div>
  );
};

export default SongList;
