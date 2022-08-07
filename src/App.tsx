import React, { useEffect, useState } from "react";
import "./App.css";

import PokemonColection from "./components/PokemonCollection";
import { Pokemon } from "./interface";

interface Pokemons {
  name: string;
  url: string;
}


export interface Detail {
  id: number;
  isOpened: boolean;
}

const App: React.FC = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [nextUrl, setNextUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [viewDetail, setDetail] = useState<Detail>({
    id: 0,
    isOpened: false,
  });
  useEffect(() => {
    const getPokemon = async () => {
      const res = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=10&offset=10"
      );
      const data = await res.json();
      setNextUrl(data.next);
        data.results.forEach(async (pokemon: Pokemons) => {
        const poke = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
        );
        const pokeData = await poke.json()
        setPokemons((p) => [...p, pokeData]);
        setLoading(false);
      });
    };
    getPokemon();
  }, []);

  const nextPage = async () => {
    setLoading(true);
    let res = await fetch(nextUrl);
    const data = await res.json()
    setNextUrl(data.next);
    data.results.forEach(async (pokemon: Pokemons) => {
      const poke = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
      );
      const pokeData = await poke.json()
      setPokemons((p) => [...p, pokeData]);
      setLoading(false);
    });
  };

  return (
    <div className="App">
      <div className="container">
        <header className="pokemon-header"> Pokemon</header>
        <PokemonColection
          pokemons={pokemons}
          viewDetail={viewDetail}
          setDetail={setDetail}
        />
        {!viewDetail.isOpened && (
          <div className="btn">
            <button onClick={nextPage}>
              {loading ? "Loading..." : "Load more"}{" "}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;