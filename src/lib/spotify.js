import axios from "axios";

export const getToken = async () => {
  console.log(process.env.REACT_APP_SPOTIFY_CLIENT_ID);
  console.log(process.env.REACT_APP_SPOTIFY_CLIENT_SECRET);
  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    {
      grant_type: "client_credentials",
      client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
      client_secret: process.env.REACT_APP_SPOTIFY_CLIENT_SECRET,
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  console.log(response.data);
};

// class SpotifyClient {
//   // Spotify APIのアクセストークンを取得
//   // axios.post(url, data, config)
//   static async initialize() {
//     const response = await axios.post(
//       // url
//       "https://accounts.spotify.com/api/token",
//       // data
//       {
//         grant_type: "client_credentials",
//         client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
//         client_secret: process.env.REACT_APP_SPOTIFY_CLIENT_SECRET,
//       },
//       // config
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       }
//     );

//     let spotify = new SpotifyClient();
//     spotify.token = response.data.access_token;
//     return spotify;
//   }

//   test() {
//     console.log(this.token);
//   }
// }

// const spotify = await SpotifyClient.initialize();
// export default spotify;
