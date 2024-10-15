import { useState, useEffect, useRef } from 'react';

import './skeleton.min.css';
import './main.css';

function App() {
	const [pokemonToDisplay, setPokemonToDisplay] = useState([]);
	const [offset, setOffset] = useState(0);
	const [sortSelection, setSortSelection] = useState('id');
	const [favoritePokemon, setFavoritePokemon] = useState([]);
	const [selectedType, setSelectedType] = useState(1);
	const modalElement = useRef(null);

	const totalPokemon = 1279;

	async function fetchData(url) {
		try {
			const response = await fetch(url);
			const data = await response.json();
			return data;
		}
		catch (error) {
			console.error(error);
		}
	}

	async function get10Pokemon(offset, sortSelection, typeChoice) {
		if(!typeChoice) {
			typeChoice = selectedType;
		}
		if (sortSelection === 'id' && offset < totalPokemon - 10) {
			const data = await fetchData(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=${offset}`);
			const pokemonList = [];
			for (let pokemon of data.results) {
				const id = pokemon.url.split('/')[6];
				const singlePokemonData = await getSinglePokemonData(id);
				pokemonList.push({
					id,
					name: pokemon.name,
					type: singlePokemonData.primaryType,
					image: singlePokemonData.image
				});
			}
			setPokemonToDisplay(pokemonList); //pokemonToDisplay = pokemonList;
		}
		else if (sortSelection === 'type') {
			const typeList = await fetchData(`https://pokeapi.co/api/v2/type/${typeChoice}`);
			//console.log('typeList:', typeList);

			const idexesToFetch = [];
			for (let i = offset; i <= offset + 9; i++) {
				if (i < typeList.pokemon.length - 10) {
					idexesToFetch.push(i);
				}
			}

			const pokemonList = [];
			for (let index of idexesToFetch) {
				const id = typeList.pokemon[index].pokemon.url.split('/')[6];
				const name = typeList.pokemon[index].pokemon.name;

				const singlePokemonData = await getSinglePokemonData(id);
				pokemonList.push({
					id,
					name,
					type: singlePokemonData.primaryType,
					image: singlePokemonData.image
				});
			}
			setPokemonToDisplay(pokemonList); //pokemonToDisplay = pokemonList;
		}
	}

	async function getSinglePokemonData(id) {
		const data = await fetchData(`https://pokeapi.co/api/v2/pokemon/${id}`);
		const primaryType = data.types[0].type.name;
		const image = data.sprites.other['official-artwork'].front_default;
		return { primaryType, image };
	}

	function changeOffsetAndRefresh(number, sortChoice) {
		if(!sortChoice) {
			sortChoice = sortSelection;
		}
		if (offset + number >= 0 && offset + number <= totalPokemon) {
			setOffset(offset + number); //offset += number;
			get10Pokemon(offset + number, sortChoice);
		}
	}

	function toggleFavorite(pokemon) {
		const index = favoritePokemon.findIndex(item => item.id.toString() === pokemon.id);
		if (index === -1) {
			setFavoritePokemon([...favoritePokemon, pokemon]);
		}
		else {
			setFavoritePokemon(favoritePokemon.filter(item => item.id.toString() !== pokemon.id));
		}
		//console.log('new favorites:', favoritePokemon);
	}

	function changeSort(event) {
		const selection = event.target.value;
 		setSortSelection(selection); //sortSelection = selection;
		changeOffsetAndRefresh(0, selection);
	}

	function changeSelectedType(event) {
		if(sortSelection === 'type') {
			setSelectedType(event.target.value); //selectedType = event.target.value;
			get10Pokemon(offset, sortSelection, event.target.value);
		}
	}

	useEffect(() => {
		get10Pokemon(0, 'id');
	}, []);

	return (
		<main>
			<h1 className="title">Pokémon React App</h1>
			<div className="button-row">
				<span id="sort-buttons">
					<label className="radio">
						<input type="radio" onChange={event => changeSort(event)} name="sort-pokemon" value="id" defaultChecked />
						<span className="sort-label">Sort by ID</span>
					</label>
					<label className="radio">
						<input type="radio" onChange={event => changeSort(event)} name="sort-pokemon" value="type" />
						<span className="sort-label">Sort by Type</span>
					</label>
				</span>
				<div className="select">
					<select onChange={(event) => changeSelectedType(event)}>
						<option value="1">Normal</option>
						<option value="2">Fighting</option>
						<option value="3">Flying</option>
						<option value="4">Poison</option>
						<option value="5">Ground</option>
						<option value="6">Rock</option>
						<option value="7">Bug</option>
						<option value="8">Ghost</option>
						<option value="9">Steel</option>
						<option value="10">Fire</option>
						<option value="11">Water</option>
						<option value="12">Grass</option>
						<option value="13">Electric</option>
						<option value="14">Psychic</option>
						<option value="15">Ice</option>
						<option value="16">Dragon</option>
						<option value="17">Dark</option>
						<option value="18">Fairy</option>
					</select>
				</div>
			</div>
			<button onClick={() => { modalElement?.current.showModal() }} className="button favorites-button">View Favorites</button>
			<dialog ref={modalElement}>
				<button onClick={() => { modalElement?.current.close() }} className="button">Close</button>
				<table className="table">
					<thead>
						<tr>
							<th>ID</th>
							<th>Name</th>
							<th>Primary Type</th>
							<th>Image</th>
						</tr>
					</thead>
					<tbody>
						{favoritePokemon.map(pokemon => (
							<tr key={pokemon.id}>
								<td>{pokemon.id}</td>
								<td>{pokemon.name}</td>
								<td>{pokemon.type}</td>
								<td><a href={pokemon.image}>View</a></td>
							</tr>
						))}
					</tbody>
				</table>
			</dialog>

			<table className="table">
				<thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Primary Type</th>
						<th>Image</th>
						<th>Favorite?</th>
					</tr>
				</thead>
				<tbody>
					{pokemonToDisplay.map(pokemon => (
						<tr key={pokemon.id}>
							<td>{pokemon.id}</td>
							<td>{pokemon.name}</td>
							<td>{pokemon.type}</td>
							<td><a href={pokemon.image}>View</a></td>
							<td>
								<input onChange={() => { toggleFavorite(pokemon) }} type="checkbox" className="checkbox favorite-button" checked={favoritePokemon.find(item => item.id === pokemon.id) ? true : false} />
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<div className="button-row">
				<button onClick={() => { changeOffsetAndRefresh(-10) }} className="button">Previous</button>
				<button onClick={() => { changeOffsetAndRefresh(10) }} className="button">Next</button>
			</div>

			<p>This project uses the <a href="https://pokeapi.co/">the PokéAPI (Pokémon Application Programming Interface)</a>.</p>
		</main>
	);
}

export default App;
