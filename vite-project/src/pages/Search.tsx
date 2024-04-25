import { ChangeEvent, useState, useTransition } from "react";

const Search = () => {
  const [filterState, setFilterState] = useState("");
  const [filterTransition, setFilterTransition] = useState("");
  const [isPending, startTransition] = useTransition();

  const filteredItemsState = items.filter((item) =>
    item.toLowerCase().includes(filterState.toLowerCase())
  );

  const filteredItemsTransition = items.filter((item) =>
    item.toLowerCase().includes(filterTransition.toLowerCase())
  );

  const handleFilterState = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterState(e.target.value);
  };

  const handleFilterTransition = (e: ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      setFilterTransition(e.target.value);
    });
  };

  return (
    <div style={{ display: "flex" }}>
      <div>
        <input
          type="text"
          value={filterState}
          onChange={handleFilterState}
          placeholder="useState 를 사용해서 필터링합니다"
        />

        {isPending ? <p>{filteredItemsState} 를 찾고있어요! </p> : null}
        <ul>
          {filteredItemsState.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <input
          type="text"
          value={filterTransition}
          onChange={handleFilterTransition}
          placeholder="useTransition 을 사용해서 필터링합니다"
        />

        {isPending ? <p>{filteredItemsTransition} 를 찾고있어요! </p> : null}
        <ul>
          {filteredItemsTransition.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Search;

const items = [
  "Apple",
  "Apricot",
  "Acai",
  "Acerola",
  "Avocado",
  "Ackee",
  "Aubergine",
  "Asparagus",
  "Alfalfa",
  "Artichoke",
  "Blackberry",
  "Blueberry",
  "Banana",
  "Bilberry",
  "Barberry",
  "Breadfruit",
  "Boysenberry",
  "Buddha's hand",
  "Blackcurrant",
  "Bignay",
  "Cherry",
  "Cranberry",
  "Coconut",
  "Clementine",
  "Cantaloupe",
  "Currant",
  "Cherimoya",
  "Cloudberry",
  "Carambola",
  "Calamansi",
  "Date",
  "Durian",
  "Dragonfruit",
  "Damson",
  "Dewberry",
  "Elderberry",
  "Eggfruit",
  "Etrog",
  "Feijoa",
  "Fig",
  "Grape",
  "Grapefruit",
  "Guava",
  "Goji berry",
  "Gooseberry",
  "Gac",
  "Honeydew",
  "Huckleberry",
  "Hackberry",
  "Hardy kiwi",
  "Kiwi",
  "Kumquat",
  "Kiwano",
  "Kaffir Lime",
  "Lychee",
  "Lime",
  "Lemon",
  "Longan",
  "Loquat",
  "Lucuma",
  "Mango",
  "Mandarine",
  "Mulberry",
  "Melon",
  "Miracle fruit",
  "Monstera deliciosa",
  "Marionberry",
  "Mangosteen",
  "Maqui berry",
  "Macadamia",
  "Nectarine",
  "Nance",
  "Naranjilla",
  "Nutmeg",
  "Neem",
  "Olive",
  "Orange",
  "Ogeechee limes",
  "Oregon grape",
  "Papaya",
  "Peach",
  "Pear",
  "Plum",
  "Pomegranate",
  "Pineapple",
  "Pitaya",
  "Persimmon",
  "Pawpaw",
  "Passionfruit",
  "Prune",
  "Quince",
  "Quandong",
  "Raspberry",
  "Rambutan",
  "Redcurrant",
  "Salak",
  "Strawberry",
  "Sapodilla",
  "Sugar apple",
  "Sweet cherry",
  "Tangerine",
  "Tamarind",
  "Tomato",
  "Ugli fruit",
  "Uva ursi",
  "Vanilla",
  "Voavanga",
  "Watermelon",
  "Wax jambu",
  "White sapote",
  "Xigua",
  "Ximenia",
  "Yuzu",
  "Yellow plum",
  "Youngberry",
  "Zucchini",
  "Ziziphus mauritiana",
  "Zhe fruit",
  "Zalacca",
  "Zereshk",
];
