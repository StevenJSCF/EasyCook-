import React, { useState } from "react";
import Modal from "./Modal"; // Adjust the import path as necessary

type Recipe = {
  recipe_name: string;
  ingredients: string[];
  extra_ingredients: string[];
  instructions: string[];
  country_of_origin: string; // Add this field
};

type GeneratedRecipesProps = {
  recipe: string | null;
};

interface CountryAbbreviations {
  [key: string]: string;
}

const countryAbbreviations: CountryAbbreviations = {
  Andorra: "AD",
  "United Arab Emirates": "AE",
  Afghanistan: "AF",
  "Antigua and Barbuda": "AG",
  Anguilla: "AI",
  Albania: "AL",
  Armenia: "AM",
  "Netherlands Antilles": "AN",
  Angola: "AO",
  Antarctica: "AQ",
  Argentina: "AR",
  "American Samoa": "AS",
  Austria: "AT",
  Australia: "AU",
  Aruba: "AW",
  "Åland Islands": "AX",
  Azerbaijan: "AZ",
  "Bosnia and Herzegovina": "BA",
  Barbados: "BB",
  Bangladesh: "BD",
  Belgium: "BE",
  "Burkina Faso": "BF",
  Bulgaria: "BG",
  Bahrain: "BH",
  Burundi: "BI",
  Benin: "BJ",
  "Saint Barthélemy": "BL",
  Bermuda: "BM",
  "Brunei Darussalam": "BN",
  Bolivia: "BO",
  "Bonaire, Sint Eustatius and Saba": "BQ",
  Brazil: "BR",
  Bahamas: "BS",
  Bhutan: "BT",
  "Bouvet Island": "BV",
  Botswana: "BW",
  Belarus: "BY",
  Belize: "BZ",
  Canada: "CA",
  "Cocos (Keeling) Islands": "CC",
  "Congo, The Democratic Republic Of The": "CD",
  "Central African Republic": "CF",
  Congo: "CG",
  Switzerland: "CH",
  "Côte D'Ivoire": "CI",
  "Cook Islands": "CK",
  Chile: "CL",
  Cameroon: "CM",
  China: "CN",
  Colombia: "CO",
  "Costa Rica": "CR",
  Cuba: "CU",
  "Cape Verde": "CV",
  Curaçao: "CW",
  "Christmas Island": "CX",
  Cyprus: "CY",
  "Czech Republic": "CZ",
  Germany: "DE",
  Djibouti: "DJ",
  Denmark: "DK",
  Dominica: "DM",
  "Dominican Republic": "DO",
  Algeria: "DZ",
  Ecuador: "EC",
  Estonia: "EE",
  Egypt: "EG",
  "Western Sahara": "EH",
  Eritrea: "ER",
  Spain: "ES",
  Ethiopia: "ET",
  Finland: "FI",
  Fiji: "FJ",
  "Falkland Islands (Malvinas)": "FK",
  "Micronesia, Federated States Of": "FM",
  "Faroe Islands": "FO",
  France: "FR",
  Gabon: "GA",
  "United Kingdom": "GB",
  Grenada: "GD",
  Georgia: "GE",
  "French Guiana": "GF",
  Guernsey: "GG",
  Ghana: "GH",
  Gibraltar: "GI",
  Greenland: "GL",
  Gambia: "GM",
  Guinea: "GN",
  Guadeloupe: "GP",
  "Equatorial Guinea": "GQ",
  Greece: "GR",
  "South Georgia and the South Sandwich Islands": "GS",
  Guatemala: "GT",
  Guam: "GU",
  "Guinea-Bissau": "GW",
  Guyana: "GY",
  "Hong Kong": "HK",
  "Heard and McDonald Islands": "HM",
  Honduras: "HN",
  Croatia: "HR",
  Haiti: "HT",
  Hungary: "HU",
  Indonesia: "ID",
  Ireland: "IE",
  Israel: "IL",
  "Isle of Man": "IM",
  India: "IN",
  "British Indian Ocean Territory": "IO",
  Iraq: "IQ",
  "Iran, Islamic Republic Of": "IR",
  Iceland: "IS",
  Italy: "IT",
  Jersey: "JE",
  Jamaica: "JM",
  Jordan: "JO",
  Japan: "JP",
  Kenya: "KE",
  Kyrgyzstan: "KG",
  Cambodia: "KH",
  Kiribati: "KI",
  Comoros: "KM",
  "Saint Kitts And Nevis": "KN",
  "Korea, Democratic People's Republic Of": "KP",
  "Korea, Republic of": "KR",
  Kuwait: "KW",
  "Cayman Islands": "KY",
  Kazakhstan: "KZ",
  "Lao People's Democratic Republic": "LA",
  Lebanon: "LB",
  "Saint Lucia": "LC",
  Liechtenstein: "LI",
  "Sri Lanka": "LK",
  Liberia: "LR",
  Lesotho: "LS",
  Lithuania: "LT",
  Luxembourg: "LU",
  Latvia: "LV",
  Libya: "LY",
  Morocco: "MA",
  Monaco: "MC",
  "Moldova, Republic of": "MD",
  Montenegro: "ME",
  "Saint Martin": "MF",
  Madagascar: "MG",
  "Marshall Islands": "MH",
  "Macedonia, the Former Yugoslav Republic Of": "MK",
  Mali: "ML",
  Myanmar: "MM",
  Mongolia: "MN",
  Macao: "MO",
  "Northern Mariana Islands": "MP",
  Martinique: "MQ",
  Mauritania: "MR",
  Montserrat: "MS",
  Malta: "MT",
  Mauritius: "MU",
  Maldives: "MV",
  Malawi: "MW",
  Mexico: "MX",
  Malaysia: "MY",
  Mozambique: "MZ",
  Namibia: "NA",
  "New Caledonia": "NC",
  Niger: "NE",
  "Norfolk Island": "NF",
  Nigeria: "NG",
  Nicaragua: "NI",
  Netherlands: "NL",
  Norway: "NO",
  Nepal: "NP",
  Nauru: "NR",
  Niue: "NU",
  "New Zealand": "NZ",
  Oman: "OM",
  Panama: "PA",
  Peru: "PE",
  "French Polynesia": "PF",
  "Papua New Guinea": "PG",
  Philippines: "PH",
  Pakistan: "PK",
  Poland: "PL",
  "Saint Pierre And Miquelon": "PM",
  Pitcairn: "PN",
  "Puerto Rico": "PR",
  "Palestine, State of": "PS",
  Portugal: "PT",
  Palau: "PW",
  Paraguay: "PY",
  Qatar: "QA",
  Réunion: "RE",
  Romania: "RO",
  Serbia: "RS",
  Russia: "RU",
  Rwanda: "RW",
  "Saudi Arabia": "SA",
  "Solomon Islands": "SB",
  Seychelles: "SC",
  Sudan: "SD",
  Sweden: "SE",
  Singapore: "SG",
  "Saint Helena": "SH",
  Slovenia: "SI",
  "Svalbard And Jan Mayen": "SJ",
  Slovakia: "SK",
  "Sierra Leone": "SL",
  "San Marino": "SM",
  Senegal: "SN",
  Somalia: "SO",
  Suriname: "SR",
  "South Sudan": "SS",
  "Sao Tome and Principe": "ST",
  "El Salvador": "SV",
  "Sint Maarten": "SX",
  "Syrian Arab Republic": "SY",
  Swaziland: "SZ",
  "Turks and Caicos Islands": "TC",
  Chad: "TD",
  "French Southern Territories": "TF",
  Togo: "TG",
  Thailand: "TH",
  Tajikistan: "TJ",
  Tokelau: "TK",
  "Timor-Leste": "TL",
  Turkmenistan: "TM",
  Tunisia: "TN",
  Tonga: "TO",
  Turkey: "TR",
  "Trinidad and Tobago": "TT",
  Tuvalu: "TV",
  "Taiwan, Republic Of China": "TW",
  "Tanzania, United Republic of": "TZ",
  Ukraine: "UA",
  Uganda: "UG",
  "United States Minor Outlying Islands": "UM",
  "United States": "US",
  "United States of America": "US",

  Uruguay: "UY",
  Uzbekistan: "UZ",
  "Holy See (Vatican City State)": "VA",
  "Saint Vincent And The Grenadines": "VC",
  Venezuela: "VE",
  "Virgin Islands, British": "VG",
  "Virgin Islands, U.S.": "VI",
  Vietnam: "VN",
  Vanuatu: "VU",
  "Wallis and Futuna": "WF",
  Samoa: "WS",
  Yemen: "YE",
  Mayotte: "YT",
  "South Africa": "ZA",
  Zambia: "ZM",
  Zimbabwe: "ZW",
};

function getCountryAbbreviation(country: string) {
  return countryAbbreviations[country] || "";
}

const GeneratedRecipes: React.FC<GeneratedRecipesProps> = ({ recipe }) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  if (!recipe) {
    return <p>No recipes generated</p>;
  }

  let parsedRecipes: Recipe[];

  try {
    parsedRecipes = JSON.parse(recipe);
  } catch (error) {
    return <p>There was an error generating the recipes.</p>;
  }

  const openModal = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const closeModal = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className="w-full h-full relative">
      <div className="grid grid-cols-2 gap-4 w-full h-full p-4">
        {parsedRecipes.map((parsedRecipe, index) => (
          <div
            key={index}
            className="border-2 border-gray-300 rounded-lg cursor-pointer w-full h-full p-4 shadow-lg hover:shadow-xl transition-shadow duration-200"
            onClick={() => openModal(parsedRecipe)}
          >
            <h3 className="text-2xl font-bold text-center">
              {parsedRecipe.recipe_name}
            </h3>
            <img
              className="mx-auto mt-4 w-20 h-20"
              src={`https://flagsapi.com/${getCountryAbbreviation(
                parsedRecipe.country_of_origin
              )}/flat/64.png`}
              alt={`${parsedRecipe.country_of_origin} flag`}
            />
            <p className="text-xl font-bold text-center">
              {parsedRecipe.country_of_origin}
            </p>
          </div>
        ))}
      </div>
      {selectedRecipe && (
        <Modal isOpen={!!selectedRecipe} onClose={closeModal}>
          <h2 className="text-center mb-4 font-bold">
            {selectedRecipe.recipe_name}
          </h2>
          <div className="flex flex-col space-y-4">
            <div className="flex-1">
              <h4 className="font-bold">Ingredients:</h4>
              <ul className="list-disc pl-6">
                {selectedRecipe.ingredients.map((ingredient, idx) => (
                  <li key={idx}>{ingredient}</li>
                ))}
              </ul>
            </div>
            <div className="flex-1">
              <h4 className="font-bold">Extra Ingredients:</h4>
              <ul className="list-disc pl-6">
                {selectedRecipe.extra_ingredients.map(
                  (extraIngredient, idx) => (
                    <li key={idx}>{extraIngredient}</li>
                  )
                )}
              </ul>
            </div>
            <div className="flex-1">
              <h4 className="font-bold">Instructions:</h4>
              <ol className="list-decimal pl-6">
                {selectedRecipe.instructions.map((instruction, idx) => (
                  <li key={idx}>{instruction}</li>
                ))}
              </ol>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default GeneratedRecipes;
