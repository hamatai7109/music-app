import axios from "axios";

class SpotifyClient {
  // Spotify APIのアクセストークンを取得
  // axios.post(url, data, config)
  static async initialize() {
    const response = await axios.post(
      // url
      "https://accounts.spotify.com/api/token",
      // data
      {
        grant_type: "client_credentials",
        client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
        client_secret: process.env.REACT_APP_SPOTIFY_CLIENT_SECRET,
      },
      // config
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    let spotify = new SpotifyClient();
    spotify.token = response.data.access_token;
    return spotify;
  }

  // 人気のプレイリストを取得。URLはドキュメント参照。
  // Authorization ヘッダーの値に、"Bearer" とトークンの間にスペースを追加する必要があります。
  async getPopularSongs() {
    const response = await axios.get(
      "https://api.spotify.com/v1/playlists/37i9dQZF1DX9vYRBO9gjDe/tracks",
      {
        headers: { Authorization: "Bearer " + this.token },
      }
    );
    return response.data;
  }

  // 検索機能
  async searchSongs(keyword, limit, offset) {
    const response = await axios.get("https://api.spotify.com/v1/search", {
      headers: { Authorization: "Bearer " + this.token },
      params: { q: keyword, type: "track", limit, offset },
    });
    return response.data.tracks;
  }
}

const spotify = await SpotifyClient.initialize();
export default spotify;
