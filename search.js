/* =========================================================
   INDIA VILLAGES
   SEARCH.JS
========================================================= */

/* =========================================================
   ELEMENTS
========================================================= */

const form =
  document.getElementById(
    "searchForm"
  );

const input =
  document.getElementById(
    "searchInput"
  );

const button =
  document.getElementById(
    "searchButton"
  );

const results =
  document.getElementById(
    "results"
  );

const status =
  document.getElementById(
    "statusArea"
  );

const empty =
  document.getElementById(
    "emptyState"
  );


/* =========================================================
   DATA
========================================================= */

let villages = [];


/* =========================================================
   STATE / UNION TERRITORY NAMES
========================================================= */

const stateNames = {

  1: "Andaman and Nicobar Islands",
  2: "Andhra Pradesh",
  3: "Arunachal Pradesh",
  4: "Assam",
  5: "Bihar",
  6: "Chhattisgarh",
  7: "Delhi",
  8: "Goa",
  9: "Gujarat",
  10: "Haryana",
  11: "Himachal Pradesh",
  12: "Jammu and Kashmir",
  13: "Jharkhand",
  14: "Karnataka",
  15: "Kerala",
  16: "Ladakh",
  17: "Lakshadweep",
  18: "Madhya Pradesh",
  19: "Maharashtra",
  20: "Manipur",
  21: "Meghalaya",
  22: "Mizoram",
  23: "Nagaland",
  24: "Odisha",
  25: "Puducherry",
  26: "Punjab",
  27: "Rajasthan",
  28: "Sikkim",
  29: "Tamil Nadu",
  30: "Telangana",
  31: "Dadra and Nagar Haveli and Daman and Diu",
  32: "Tripura",
  33: "Uttar Pradesh",
  34: "Uttarakhand",
  35: "West Bengal"

};

/* =========================================================
   LOAD JSON
========================================================= */

async function loadVillages() {

  try {

    const response =
      await fetch(
        "india.json"
      );

    villages =
      await response.json();

    console.log(
      `Loaded ${villages.length} villages.`
    );

  }

  catch(error){

    console.error(error);

    status.textContent =
      "Unable to load village database.";

  }

}


/* =========================================================
   FOLDER NAME
========================================================= */

function folderName(

  village,

  pincode

){

  return (

    village
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^\w]/g,"")

    + pincode

  );

}


/* =========================================================
   DESCRIPTION
========================================================= */

function description(

  village,

  pincode,

  mandal,

  district,

  state

){

  return `${village} village is located in ${mandal} Mandal, ${district} District, ${state}, India. Digital village portal for ${village} (${pincode}), ${state}, India. Access government services, education, emergency contacts, marketplace, employment opportunities and community resources in one place.`;

}


/* =========================================================
   SCORE
========================================================= */

function score(

  village,

  query

){

  const name =
    village.n.toLowerCase();

  const pin =
    village.p;

  if(

    name===query

  ){

    return 1000;

  }

  if(

    name.startsWith(query)

  ){

    return 800;

  }

  if(

    name.includes(query)

  ){

    return 600;

  }

  if(

    pin.startsWith(query)

  ){

    return 400;

  }

  if(

    pin.includes(query)

  ){

    return 200;

  }

  return 0;

}


/* =========================================================
   SEARCH
========================================================= */

function searchVillages(

  text

){

  const query =

    text

      .trim()

      .toLowerCase();

  if(

    query.length<3

  ){

    status.innerHTML=

      "Please enter at least <strong>3 characters</strong>.";

    results.hidden=true;

    empty.hidden=true;

    return;

  }


  results.hidden=true;

  empty.hidden=true;


  requestAnimationFrame(()=>{

    const found =

      villages

        .map(v=>({

          ...v,

          score:

            score(

              v,

              query

            )

        }))

        .filter(

          v=>v.score>0

        )

        .sort(

          (a,b)=>

            b.score-a.score ||

            a.n.localeCompare(b.n)

        )

        .slice(

          0,

          50

        );


    renderResults(

      found,

      query

    );

  });

}


/* =========================================================
   HIGHLIGHT
========================================================= */

function highlight(

  text,

  query

){

  if(!query){

    return text;

  }


  const escaped =

    query.replace(

      /[.*+?^${}()|[\]\\]/g,

      "\\$&"

    );


  return text.replace(

    new RegExp(

      `(${escaped})`,

      "ig"

    ),

    "<mark>$1</mark>"

  );

}


/* =========================================================
   RESULT CARD
========================================================= */

function createResult(

  village,

  query

){

  const folder =

    folderName(

      village.n,

      village.p

    );


  const state =

    stateNames[village.s] ||

    "India";


  return `

    <article

      class="resultItem fadeIn"

      tabindex="0"

      role="link"

      data-url="/${folder}/"

    >

      <h2
        class="resultTitle"
      >

        ${highlight(

          village.n,

          query

        )}

      </h2>


      <div
        class="resultMeta"
      >

        ${village.m} Mandal •

        ${village.d} District •

        ${state} •

        Pincode

        ${village.p}

      </div>


      <p
        class="resultDescription"
      >

        ${description(

          village.n,

          village.p,

          village.m,

          village.d,

          state

        )}

      </p>


    </article>

  `;

}


/* =========================================================
   RENDER
========================================================= */

function renderResults(

  found,

  query

){


  if(

    found.length===0

  ){

    results.hidden=true;

    empty.hidden=false;

    status.textContent=

      "No matching villages found.";

    return;

  }


  empty.hidden=true;

  results.hidden=false;

  status.innerHTML=

    `Showing <strong>${found.length}</strong> matching villages`;


  results.innerHTML=

    `

    <div
      class="resultCount"
    >

      Search Results

    </div>


    ${

      found

        .map(

          item=>

            createResult(

              item,

              query

            )

        )

        .join("")

    }

    `;

}


/* =========================================================
   OPEN RESULT
========================================================= */

results.addEventListener(

  "click",

  event=>{

    const card=

      event.target.closest(

        ".resultItem"

      );


    if(!card){

      return;

    }


    window.location.href=

      card.dataset.url;

  }

);


/* =========================================================
   KEYBOARD
========================================================= */

results.addEventListener(

  "keydown",

  event=>{

    if(

      event.key!=="Enter"

    ){

      return;

    }


    const card=

      event.target.closest(

        ".resultItem"

      );


    if(!card){

      return;

    }


    window.location.href=

      card.dataset.url;

  }

);


/* =========================================================
   SEARCH
========================================================= */

form.addEventListener(

  "submit",

  event=>{

    event.preventDefault();

    searchVillages(

      input.value

    );

  }

);


/* =========================================================
   ENTER KEY
========================================================= */

input.addEventListener(

  "keydown",

  event=>{

    if(

      event.key==="Enter"

    ){

      event.preventDefault();

      searchVillages(

        input.value

      );

    }

  }

);


/* =========================================================
   SEARCH BUTTON
========================================================= */

button.addEventListener(

  "click",

  event=>{

    event.preventDefault();

    searchVillages(

      input.value

    );

  }

);


/* =========================================================
   WINDOW SEARCH (?q=)
========================================================= */

window.addEventListener(

  "load",

  ()=>{

    const params =

      new URLSearchParams(

        window.location.search

      );


    const q =

      params.get(

        "q"

      );


    if(

      q

    ){

      input.value = q;

      searchVillages(

        q

      );

    }

  }

);


/* =========================================================
   INITIALIZE
========================================================= */

async function init(){


  results.hidden = true;

  empty.hidden = true;

  button.disabled = true;

  input.disabled = true;

  status.innerHTML =

    "Loading village database...";


  await loadVillages();


  button.disabled = false;

  input.disabled = false;


  status.innerHTML =

    `Search from more than <strong>${villages.length.toLocaleString()}</strong> villages across India.`;


  input.focus();

}


init();


/* =========================================================
   CONSOLE
========================================================= */

console.log(

  "%cINDIA VILLAGES",

  `
    color:#0f8a5f;
    font-size:18px;
    font-weight:bold;
  `

);


console.log(

  "Powered by VIDHWAAN"

);