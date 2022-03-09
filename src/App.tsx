import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Center,
    CircularProgress,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Select
} from "@chakra-ui/react";
import {Autocomplete, Option} from 'chakra-ui-simple-autocomplete';
import './App.css';
import {MdAdd, MdDelete} from "react-icons/all";

const rPhoneNumber = /[^0-9+ ]/g;
const rPlus = / +/g;
const rName = /[^a-zA-Z]/g;

function App() {
    const [firstName, setFirstName] = useState("");
    const [nicknames, setNicknames] = useState(["", "", ""]);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [peopleSearch, setPeopleSearch] = useState("");
    const [selectedPeople, setSelectedPeople] = useState<number[]>([]);
    const [movie, setMovie] = useState<number>();
    const [starship, setStarship] = useState<number>();

    const [people, setPeople] = useState<{ id: number, name: string }[]>();
    const [starships, setStarships] = useState<{ name: string, id: number, films: number[] }[]>();
    const [movies, setMovies] = useState<{ name: string, id: number }[]>();

    useEffect(() => {
        let fetchCharacters = async () => {
            try {
                let response = await fetch("https://swapi.dev/api/people/")
                let data: any = await response.json()
                setPeople(
                    data.results.map((person: any) => {
                        return {
                            name: person.name,
                            id: parseInt(person.url.replace("https://swapi.dev/api/people/", "").slice(0, -1))
                        };
                    })
                );
            } catch (e) {
                console.log("error: " + JSON.stringify(e))
            }
        }
        fetchCharacters();
    }, [0]);

    useEffect(() => {
        let fetchMovie = async () => {
            try {
                let response = await fetch("https://swapi.dev/api/films/")
                let data: any = await response.json()
                setMovies(
                    data.results.map((movie: any) => {
                        return {
                            name: movie.title,
                            id: parseInt(movie.url.replace("https://swapi.dev/api/films/", "").slice(0, -1))
                        };
                    })
                );
                setMovie(0);
            } catch (e) {
                console.log("error: " + JSON.stringify(e))
            }
        };
        fetchMovie();
    }, [0]);

    useEffect(() => {
        let fetchStarships = async () => {
            try {
                let response = await fetch("https://swapi.dev/api/starships/")
                let data: any = await response.json()
                setStarships(
                    data.results.map((starship: any) => {
                        return {
                            name: starship.name,
                            id: parseInt(starship.url.replace("https://swapi.dev/api/starships/", "").slice(0, -1)),
                            films: starship.films.map((name: any) =>
                                parseInt(name.replace("https://swapi.dev/api/films/", "").slice(0, -1))
                            ),
                        };
                    })
                );
            } catch (e) {
                console.log("error: " + JSON.stringify(e))
            }
        };
        fetchStarships();
    }, [0]);

    return (
        <Box margin={16} padding={4} backgroundColor="#F7F7F7">
            <Flex w="full" direction="row">
                <Box>
                    <Heading>Personal Questions</Heading>

                    <Box h={8}/>
                    <FormControl>
                        <FormLabel>First Name</FormLabel>
                        <Input value={firstName} onChange={(e) => {
                            let s = e.target.value;
                            if (s !== "") {
                                s = s.replaceAll(rName, "");
                                s = s.toLowerCase();
                                s = s[0].toUpperCase() + s.slice(1);
                            }
                            setFirstName(s);
                        }}/>
                    </FormControl>

                    {
                        nicknames.map((name, i) => {
                            return <FormControl key={i}>
                                <Box h={8}/>
                                <FormLabel>Nickname {i + 1}</FormLabel>
                                <Flex direction="row">
                                    <Input value={name} onChange={e => {
                                        let newNames = [...nicknames]
                                        newNames[i] = e.target.value;
                                        setNicknames(newNames);
                                    }}/>
                                    <Box w={8}/>
                                    <Button colorScheme="blue" onClick={() => {
                                        setNicknames([...nicknames.slice(0, i), ...nicknames.slice(i + 1)]);
                                    }}>
                                        <MdDelete size={30}/>
                                    </Button>
                                </Flex>
                            </FormControl>
                        })
                    }

                    <Box h={8}/>
                    <Button colorScheme="blue" onClick={() => {
                        setNicknames([...nicknames, ""]);
                    }}>
                        <MdAdd/>
                        Add a nickname
                    </Button>

                    <Box h={8}/>
                    <FormControl>
                        <FormLabel>Phone Number</FormLabel>
                        <Input value={phoneNumber} onChange={(e) => {
                            let s = e.target.value;
                            s = s.replaceAll(rPhoneNumber, "");
                            s = s.replaceAll(rPlus, " ");
                            setPhoneNumber(s);
                        }}/>
                    </FormControl>

                </Box>
                <Box w={20}/>
                <Box>
                    <Heading>Star Wars Questions</Heading>

                    {
                        people ?
                            <FormControl>
                                <Box h={8}/>
                                <FormLabel>What are your favourite Star Wars characters?</FormLabel>
                                <Autocomplete
                                    allowCreation={false}
                                    options={people.map(person => {
                                        return {value: '' + person.id, label: person.name}
                                    })}
                                    result={selectedPeople.map(person => {
                                        return {value: '' + people[person].id, label: people[person].name}
                                    })}
                                    setResult={(selectedPeople) => setSelectedPeople(selectedPeople.map(person => {
                                        return people.map(person => person.id).indexOf(parseInt(person.value))
                                    }))}
                                />
                            </FormControl>
                            : <><Box h={20}/><Center><CircularProgress isIndeterminate/></Center></>
                    }

                    {
                        movies ?
                            <FormControl>
                                <Box h={8}/>
                                <FormLabel>What is your favourite Star Wars movie?</FormLabel>
                                <Select>
                                    {movies.map((movie, index) =>
                                        <option key={index} value={'' + index} onClick={() => {
                                            setMovie(index);
                                            setStarship(undefined);
                                        }}>{movie.name} </option>
                                    )}
                                </Select>
                            </FormControl>
                            : <><Box h={20}/><Center><CircularProgress isIndeterminate/></Center></>
                    }

                    {
                        starships && movies && movie !== undefined ?
                            <FormControl>
                                <Box h={8}/>
                                <FormLabel>What is your favourite starship that appeared
                                    in your favourite Star Wars movie?</FormLabel>
                                <Select>
                                    {starships.filter(starship => starship.films.includes(movies[movie].id)).map((starship, index) =>
                                        <option key={index} value={'' + index} onClick={() => {
                                            setStarship(index)
                                        }}>{starship.name} </option>
                                    )}
                                </Select>
                            </FormControl>
                            : null
                    }

                </Box>
                <Box w={20}/>
            </Flex>
            <Box h={8}/>
            <Flex direction="row" justifyContent="center">
                <Button colorScheme="blue"
                        disabled={
                            firstName.trim() === "" || nicknames.some(n => n.trim() === "")
                            || !phoneNumber.match(/^(\+41|0|0041)( *[0-9] *){9}$/g) || movie === undefined
                        }
                        onClick={() => {
                            const result = {
                                "personal_questions": {
                                    "first_name": firstName.trim(),
                                    "nick_names": nicknames.map(it => it.trim()),
                                    "phone_number": phoneNumber.replaceAll(" ", "")
                                },
                                "star_wars_questions": {
                                    "favourite_character_ids": people?.filter((x, i) => selectedPeople.includes(i)).map(it => it.id),
                                    "favourite_movie_id": movie && movies ? movies[movie].id : undefined,
                                    "favourite_starship_id": starship && starships ? starships[starship].id : undefined
                                }
                            };
                            console.log("Submit " + JSON.stringify(result));
                            const xhr = new XMLHttpRequest();
                            xhr.open("POST", 'the-non-existent-endpoint', true);
                            xhr.setRequestHeader('Content-Type', 'application/json');
                            xhr.send(JSON.stringify(result));
                        }}>Submit</Button>
            </Flex>
        </Box>
    );
}

export default App;
