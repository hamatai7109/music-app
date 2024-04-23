import { useEffect, useRef, useState } from "react";
import spotify from "./lib/spotify";
import { SongList } from "./components/SongList";
import { Player } from "./components/Player";
import { SearchInput } from "./components/SearchInput";
import { Pagination } from "./components/Pagination";

const limit = 20;

export default function App() {
  // 変数定義
  const [isLoading, setIsLoading] = useState(false);
  const [popularSongs, setPopularSongs] = useState([]);
  const [isPlay, setIsPlay] = useState(false);
  const [selectedSong, setSelectedSong] = useState();
  const [keyword, setKeyword] = useState("");
  const [searchedSongs, setSearchedSongs] = useState();
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  // 楽曲のurl保持
  const audioRef = useRef(null);

  // 検索結果の有無判定
  const isSearchedResult = searchedSongs != null;

  // 初回レンダリングのみ、データを取得する。
  useEffect(() => {
    fetchPopularSongs();
  }, []);

  // 楽曲リストを取得し、配列の中身（track）をuseStateに格納
  const fetchPopularSongs = async () => {
    setIsLoading(true);
    const result = await spotify.getPopularSongs();
    const popularSongs = result.items.map((item) => {
      return item.track;
    });
    setPopularSongs(popularSongs);
    setIsLoading(false);
  };

  // 選択した楽曲を再生
  const handleSongSelected = async (song) => {
    setSelectedSong(song);
    // 再生する音楽がある場合にのみ再生されるように制限
    if (song.preview_url != null) {
      audioRef.current.src = song.preview_url;
      playSong();
    } else {
      pauseSong();
    }
  };

  // 楽曲を再生
  const playSong = () => {
    audioRef.current.play();
    setIsPlay(true);
  };

  // 楽曲を停止
  const pauseSong = () => {
    audioRef.current.pause();
    setIsPlay(false);
  };

  // 再生、停止ボタンの処理
  const toggleSong = () => {
    if (isPlay) {
      pauseSong();
    } else {
      playSong();
    }
  };

  // 検索窓での入力値をセット
  const handleInputChange = (e) => {
    setKeyword(e.target.value);
  };

  // 検索のAPIをたたく処理
  const searchSongs = async (page) => {
    setIsLoading(true);
    // offsetとは、取得するデータの開始位置。例)offset = 20であれば、20件目から取得する。
    // 1ページに取得する最大件数（limit）から、現在何ページ目なのかをoffsetと共に算出する。
    const offset = parseInt(page) ? (parseInt(page) - 1) * limit : 0;
    const result = await spotify.searchSongs(keyword, limit, offset);
    // 次のページの有無セット
    setHasNext(result.next != null);
    // 前のページの有無セット
    setHasPrev(result.previous != null);
    setSearchedSongs(result.items);
    setIsLoading(false);
  };

  // Nextボタン
  const moveToNext = async () => {
    const nextPage = page + 1;
    await searchSongs(nextPage);
    setPage(nextPage);
  };

  // Prevボタン
  const moveToPrev = async () => {
    const prevPage = page - 1;
    await searchSongs(prevPage);
    setPage(prevPage);
  };
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <main className="flex-1 p-8 mb-20">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">Music App</h1>
        </header>
        <SearchInput onInputChange={handleInputChange} onSubmit={searchSongs} />
        <section>
          <h2 className="text-2xl font-semibold mb-5">
            {isSearchedResult ? "Searched Result" : "Popular Songs"}
          </h2>
          <SongList
            isLoading={isLoading}
            songs={isSearchedResult ? searchedSongs : popularSongs}
            onSongSelected={handleSongSelected}
          />
          {isSearchedResult && (
            <Pagination
              onPrev={hasPrev ? moveToPrev : null}
              onNext={hasNext ? moveToNext : null}
            />
          )}
        </section>
      </main>
      {selectedSong != null && (
        <Player
          song={selectedSong}
          isPlay={isPlay}
          onButtonClick={toggleSong}
        />
      )}
      <audio ref={audioRef} />
    </div>
  );
}
