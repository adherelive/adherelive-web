"use strict";

import { TABLE_NAME } from "../models/conditions";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(TABLE_NAME, [
      {
        code: "A000",
        name: "Cholera due to Vibrio cholerae 01, biovar cholerae",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A001",
        name: "Cholera due to Vibrio cholerae 01, biovar eltor",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A009",
        name: "Cholera, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A0100",
        name: "Typhoid fever, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A0101",
        name: "Typhoid meningitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "1",
        name: "Unconfirmed",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A0102",
        name: "Typhoid fever with heart involvement",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A0103",
        name: "Typhoid pneumonia",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A0104",
        name: "Typhoid arthritis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A0105",
        name: "Typhoid osteomyelitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A0109",
        name: "Typhoid fever with other complications",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A011",
        name: "Paratyphoid fever A",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A012",
        name: "Paratyphoid fever B",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A013",
        name: "Paratyphoid fever C",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A014",
        name: "Paratyphoid fever, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A020",
        name: "Salmonella enteritis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A021",
        name: "Salmonella sepsis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A0220",
        name: "Localized salmonella infection, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A0221",
        name: "Salmonella meningitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A0222",
        name: "Salmonella pneumonia",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A0223",
        name: "Salmonella arthritis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A0224",
        name: "Salmonella osteomyelitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A0225",
        name: "Salmonella pyelonephritis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A0229",
        name: "Salmonella with other localized infection",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A028",
        name: "Other specified salmonella infections",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A029",
        name: "Salmonella infection, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A030",
        name: "Shigellosis due to Shigella dysenteriae",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A031",
        name: "Shigellosis due to Shigella flexneri",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A032",
        name: "Shigellosis due to Shigella boydii",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A033",
        name: "Shigellosis due to Shigella sonnei",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A038",
        name: "Other shigellosis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A039",
        name: "Shigellosis, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A040",
        name: "Enteropathogenic Escherichia coli infection",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A041",
        name: "Enterotoxigenic Escherichia coli infection",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A042",
        name: "Enteroinvasive Escherichia coli infection",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A043",
        name: "Enterohemorrhagic Escherichia coli infection",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A044",
        name: "Other intestinal Escherichia coli infections",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A045",
        name: "Campylobacter enteritis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A046",
        name: "Enteritis due to Yersinia enterocolitica",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A0471",
        name: "Enterocolitis due to Clostridium difficile, recurrent",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A0472",
        name:
          "Enterocolitis due to Clostridium difficile, not specified as recurrent",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A048",
        name: "Other specified bacterial intestinal infections",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A049",
        name: "Bacterial intestinal infection, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A050",
        name: "Foodborne staphylococcal intoxication",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A051",
        name: "Botulism food poisoning",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A052",
        name:
          "Foodborne Clostridium perfringens [Clostridium welchii] intoxication",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A053",
        name: "Foodborne Vibrio parahaemolyticus intoxication",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A054",
        name: "Foodborne Bacillus cereus intoxication",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A055",
        name: "Foodborne Vibrio vulnificus intoxication",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A058",
        name: "Other specified bacterial foodborne intoxications",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A059",
        name: "Bacterial foodborne intoxication, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A060",
        name: "Acute amebic dysentery",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A061",
        name: "Chronic intestinal amebiasis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A062",
        name: "Amebic nondysenteric colitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A063",
        name: "Ameboma of intestine",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A064",
        name: "Amebic liver abscess",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A065",
        name: "Amebic lung abscess",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A066",
        name: "Amebic brain abscess",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A067",
        name: "Cutaneous amebiasis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A0681",
        name: "Amebic cystitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A0682",
        name: "Other amebic genitourinary infections",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A0689",
        name: "Other amebic infections",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A069",
        name: "Amebiasis, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A070",
        name: "Balantidiasis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A071",
        name: "Giardiasis [lambliasis]",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A072",
        name: "Cryptosporidiosis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A073",
        name: "Isosporiasis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A074",
        name: "Cyclosporiasis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A078",
        name: "Other specified protozoal intestinal diseases",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A079",
        name: "Protozoal intestinal disease, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A080",
        name: "Rotaviral enteritis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A0811",
        name: "Acute gastroenteropathy due to Norwalk agent",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A0819",
        name: "Acute gastroenteropathy due to other small round viruses",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A082",
        name: "Adenoviral enteritis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A0831",
        name: "Calicivirus enteritis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A0832",
        name: "Astrovirus enteritis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A0839",
        name: "Other viral enteritis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A084",
        name: "Viral intestinal infection, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A088",
        name: "Other specified intestinal infections",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A09",
        name: "Infectious gastroenteritis and colitis, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A150",
        name: "Tuberculosis of lung",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A154",
        name: "Tuberculosis of intrathoracic lymph nodes",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A155",
        name: "Tuberculosis of larynx, trachea and bronchus",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A156",
        name: "Tuberculous pleurisy",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A157",
        name: "Primary respiratory tuberculosis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A158",
        name: "Other respiratory tuberculosis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A159",
        name: "Respiratory tuberculosis unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A170",
        name: "Tuberculous meningitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A171",
        name: "Meningeal tuberculoma",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A1781",
        name: "Tuberculoma of brain and spinal cord",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A1782",
        name: "Tuberculous meningoencephalitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A1783",
        name: "Tuberculous neuritis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A1789",
        name: "Other tuberculosis of nervous system",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A179",
        name: "Tuberculosis of nervous system, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A1801",
        name: "Tuberculosis of spine",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A1802",
        name: "Tuberculous arthritis of other joints",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A1803",
        name: "Tuberculosis of other bones",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A1809",
        name: "Other musculoskeletal tuberculosis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A1810",
        name: "Tuberculosis of genitourinary system, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A1811",
        name: "Tuberculosis of kidney and ureter",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A1812",
        name: "Tuberculosis of bladder",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A1813",
        name: "Tuberculosis of other urinary organs",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A1814",
        name: "Tuberculosis of prostate",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A1815",
        name: "Tuberculosis of other male genital organs",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A1816",
        name: "Tuberculosis of cervix",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A1817",
        name: "Tuberculous female pelvic inflammatory disease",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A1818",
        name: "Tuberculosis of other female genital organs",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A182",
        name: "Tuberculous peripheral lymphadenopathy",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A1831",
        name: "Tuberculous peritonitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A1832",
        name: "Tuberculous enteritis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A1839",
        name: "Retroperitoneal tuberculosis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A184",
        name: "Tuberculosis of skin and subcutaneous tissue",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A1850",
        name: "Tuberculosis of eye, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A1851",
        name: "Tuberculous episcleritis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A1852",
        name: "Tuberculous keratitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A1853",
        name: "Tuberculous chorioretinitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A1854",
        name: "Tuberculous iridocyclitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A1859",
        name: "Other tuberculosis of eye",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A186",
        name: "Tuberculosis of (inner) (middle) ear",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A187",
        name: "Tuberculosis of adrenal glands",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A1881",
        name: "Tuberculosis of thyroid gland",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A1882",
        name: "Tuberculosis of other endocrine glands",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A1883",
        name:
          "Tuberculosis of digestive tract organs, not elsewhere classified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A1884",
        name: "Tuberculosis of heart",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A1885",
        name: "Tuberculosis of spleen",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A1889",
        name: "Tuberculosis of other sites",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A190",
        name: "Acute miliary tuberculosis of a single specified site",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A191",
        name: "Acute miliary tuberculosis of multiple sites",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A192",
        name: "Acute miliary tuberculosis, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A198",
        name: "Other miliary tuberculosis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A199",
        name: "Miliary tuberculosis, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A200",
        name: "Bubonic plague",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A201",
        name: "Cellulocutaneous plague",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A202",
        name: "Pneumonic plague",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A203",
        name: "Plague meningitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A207",
        name: "Septicemic plague",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A208",
        name: "Other forms of plague",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A209",
        name: "Plague, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A210",
        name: "Ulceroglandular tularemia",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A211",
        name: "Oculoglandular tularemia",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A212",
        name: "Pulmonary tularemia",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A213",
        name: "Gastrointestinal tularemia",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A217",
        name: "Generalized tularemia",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A218",
        name: "Other forms of tularemia",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A219",
        name: "Tularemia, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A220",
        name: "Cutaneous anthrax",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A221",
        name: "Pulmonary anthrax",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A222",
        name: "Gastrointestinal anthrax",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A227",
        name: "Anthrax sepsis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A228",
        name: "Other forms of anthrax",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A229",
        name: "Anthrax, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A230",
        name: "Brucellosis due to Brucella melitensis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A231",
        name: "Brucellosis due to Brucella abortus",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A232",
        name: "Brucellosis due to Brucella suis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A233",
        name: "Brucellosis due to Brucella canis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A238",
        name: "Other brucellosis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A239",
        name: "Brucellosis, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A240",
        name: "Glanders",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A241",
        name: "Acute and fulminating melioidosis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A242",
        name: "Subacute and chronic melioidosis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A243",
        name: "Other melioidosis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A249",
        name: "Melioidosis, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A250",
        name: "Spirillosis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A251",
        name: "Streptobacillosis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A259",
        name: "Rat-bite fever, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A260",
        name: "Cutaneous erysipeloid",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A267",
        name: "Erysipelothrix sepsis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A268",
        name: "Other forms of erysipeloid",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A269",
        name: "Erysipeloid, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A270",
        name: "Leptospirosis icterohemorrhagica",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A2781",
        name: "Aseptic meningitis in leptospirosis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A2789",
        name: "Other forms of leptospirosis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A279",
        name: "Leptospirosis, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A280",
        name: "Pasteurellosis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A281",
        name: "Cat-scratch disease",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A282",
        name: "Extraintestinal yersiniosis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A288",
        name:
          "Other specified zoonotic bacterial diseases, not elsewhere classified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A289",
        name: "Zoonotic bacterial disease, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A300",
        name: "Indeterminate leprosy",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A301",
        name: "Tuberculoid leprosy",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A302",
        name: "Borderline tuberculoid leprosy",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A303",
        name: "Borderline leprosy",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A304",
        name: "Borderline lepromatous leprosy",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A305",
        name: "Lepromatous leprosy",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A308",
        name: "Other forms of leprosy",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A309",
        name: "Leprosy, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A310",
        name: "Pulmonary mycobacterial infection",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A311",
        name: "Cutaneous mycobacterial infection",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A312",
        name: "Disseminated mycobacterium avium-intracellulare complex (DMAC)",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A318",
        name: "Other mycobacterial infections",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A319",
        name: "Mycobacterial infection, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A320",
        name: "Cutaneous listeriosis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A3211",
        name: "Listerial meningitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A3212",
        name: "Listerial meningoencephalitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A327",
        name: "Listerial sepsis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A3281",
        name: "Oculoglandular listeriosis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A3282",
        name: "Listerial endocarditis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A3289",
        name: "Other forms of listeriosis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A329",
        name: "Listeriosis, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A33",
        name: "Tetanus neonatorum",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A34",
        name: "Obstetrical tetanus",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A35",
        name: "Other tetanus",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A360",
        name: "Pharyngeal diphtheria",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A361",
        name: "Nasopharyngeal diphtheria",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A362",
        name: "Laryngeal diphtheria",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A363",
        name: "Cutaneous diphtheria",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A3681",
        name: "Diphtheritic cardiomyopathy",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A3682",
        name: "Diphtheritic radiculomyelitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A3683",
        name: "Diphtheritic polyneuritis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A3684",
        name: "Diphtheritic tubulo-interstitial nephropathy",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A3685",
        name: "Diphtheritic cystitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A3686",
        name: "Diphtheritic conjunctivitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A3689",
        name: "Other diphtheritic complications",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A369",
        name: "Diphtheria, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A3700",
        name: "Whooping cough due to Bordetella pertussis without pneumonia",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A3701",
        name: "Whooping cough due to Bordetella pertussis with pneumonia",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A3710",
        name:
          "Whooping cough due to Bordetella parapertussis without pneumonia",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A3711",
        name: "Whooping cough due to Bordetella parapertussis with pneumonia",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A3780",
        name:
          "Whooping cough due to other Bordetella species without pneumonia",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A3781",
        name: "Whooping cough due to other Bordetella species with pneumonia",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A3790",
        name: "Whooping cough, unspecified species without pneumonia",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A3791",
        name: "Whooping cough, unspecified species with pneumonia",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A380",
        name: "Scarlet fever with otitis media",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A381",
        name: "Scarlet fever with myocarditis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A388",
        name: "Scarlet fever with other complications",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A389",
        name: "Scarlet fever, uncomplicated",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A390",
        name: "Meningococcal meningitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A391",
        name: "Waterhouse-Friderichsen syndrome",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A392",
        name: "Acute meningococcemia",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A393",
        name: "Chronic meningococcemia",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A394",
        name: "Meningococcemia, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A3950",
        name: "Meningococcal carditis, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A3951",
        name: "Meningococcal endocarditis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A3952",
        name: "Meningococcal myocarditis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A3953",
        name: "Meningococcal pericarditis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A3981",
        name: "Meningococcal encephalitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A3982",
        name: "Meningococcal retrobulbar neuritis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A3983",
        name: "Meningococcal arthritis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A3984",
        name: "Postmeningococcal arthritis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A3989",
        name: "Other meningococcal infections",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A399",
        name: "Meningococcal infection, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A400",
        name: "Sepsis due to streptococcus, group A",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A401",
        name: "Sepsis due to streptococcus, group B",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A403",
        name: "Sepsis due to Streptococcus pneumoniae",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A408",
        name: "Other streptococcal sepsis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A409",
        name: "Streptococcal sepsis, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A4101",
        name: "Sepsis due to Methicillin susceptible Staphylococcus aureus",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A4102",
        name: "Sepsis due to Methicillin resistant Staphylococcus aureus",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A411",
        name: "Sepsis due to other specified staphylococcus",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A412",
        name: "Sepsis due to unspecified staphylococcus",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A413",
        name: "Sepsis due to Hemophilus influenzae",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A414",
        name: "Sepsis due to anaerobes",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A4150",
        name: "Gram-negative sepsis, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A4151",
        name: "Sepsis due to Escherichia coli [E. coli]",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A4152",
        name: "Sepsis due to Pseudomonas",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A4153",
        name: "Sepsis due to Serratia",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A4159",
        name: "Other Gram-negative sepsis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A4181",
        name: "Sepsis due to Enterococcus",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A4189",
        name: "Other specified sepsis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A419",
        name: "Sepsis, unspecified organism",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A420",
        name: "Pulmonary actinomycosis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A421",
        name: "Abdominal actinomycosis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A422",
        name: "Cervicofacial actinomycosis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A427",
        name: "Actinomycotic sepsis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A4281",
        name: "Actinomycotic meningitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A4282",
        name: "Actinomycotic encephalitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A4289",
        name: "Other forms of actinomycosis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A429",
        name: "Actinomycosis, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A430",
        name: "Pulmonary nocardiosis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A431",
        name: "Cutaneous nocardiosis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A438",
        name: "Other forms of nocardiosis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A439",
        name: "Nocardiosis, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A440",
        name: "Systemic bartonellosis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A441",
        name: "Cutaneous and mucocutaneous bartonellosis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A448",
        name: "Other forms of bartonellosis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A449",
        name: "Bartonellosis, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A46",
        name: "Erysipelas",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A480",
        name: "Gas gangrene",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A481",
        name: "Legionnaires' disease",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A482",
        name: "Nonpneumonic Legionnaires' disease [Pontiac fever]",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A483",
        name: "Toxic shock syndrome",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A484",
        name: "Brazilian purpuric fever",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A4851",
        name: "Infant botulism",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A4852",
        name: "Wound botulism",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A488",
        name: "Other specified bacterial diseases",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A4901",
        name:
          "Methicillin susceptible Staphylococcus aureus infection, unspecified site",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A4902",
        name:
          "Methicillin resistant Staphylococcus aureus infection, unspecified site",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A491",
        name: "Streptococcal infection, unspecified site",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A492",
        name: "Hemophilus influenzae infection, unspecified site",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A493",
        name: "Mycoplasma infection, unspecified site",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A498",
        name: "Other bacterial infections of unspecified site",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A499",
        name: "Bacterial infection, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5001",
        name: "Early congenital syphilitic oculopathy",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5002",
        name: "Early congenital syphilitic osteochondropathy",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5003",
        name: "Early congenital syphilitic pharyngitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5004",
        name: "Early congenital syphilitic pneumonia",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5005",
        name: "Early congenital syphilitic rhinitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5006",
        name: "Early cutaneous congenital syphilis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5007",
        name: "Early mucocutaneous congenital syphilis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5008",
        name: "Early visceral congenital syphilis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5009",
        name: "Other early congenital syphilis, symptomatic",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A501",
        name: "Early congenital syphilis, latent",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A502",
        name: "Early congenital syphilis, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5030",
        name: "Late congenital syphilitic oculopathy, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5031",
        name: "Late congenital syphilitic interstitial keratitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5032",
        name: "Late congenital syphilitic chorioretinitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5039",
        name: "Other late congenital syphilitic oculopathy",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5040",
        name: "Late congenital neurosyphilis, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5041",
        name: "Late congenital syphilitic meningitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5042",
        name: "Late congenital syphilitic encephalitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5043",
        name: "Late congenital syphilitic polyneuropathy",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5044",
        name: "Late congenital syphilitic optic nerve atrophy",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5045",
        name: "Juvenile general paresis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5049",
        name: "Other late congenital neurosyphilis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5051",
        name: "Clutton's joints",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5052",
        name: "Hutchinson's teeth",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5053",
        name: "Hutchinson's triad",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5054",
        name: "Late congenital cardiovascular syphilis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5055",
        name: "Late congenital syphilitic arthropathy",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5056",
        name: "Late congenital syphilitic osteochondropathy",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5057",
        name: "Syphilitic saddle nose",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5059",
        name: "Other late congenital syphilis, symptomatic",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A506",
        name: "Late congenital syphilis, latent",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A507",
        name: "Late congenital syphilis, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A509",
        name: "Congenital syphilis, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A510",
        name: "Primary genital syphilis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A511",
        name: "Primary anal syphilis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A512",
        name: "Primary syphilis of other sites",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5131",
        name: "Condyloma latum",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5132",
        name: "Syphilitic alopecia",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5139",
        name: "Other secondary syphilis of skin",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5141",
        name: "Secondary syphilitic meningitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5142",
        name: "Secondary syphilitic female pelvic disease",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5143",
        name: "Secondary syphilitic oculopathy",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5144",
        name: "Secondary syphilitic nephritis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5145",
        name: "Secondary syphilitic hepatitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5146",
        name: "Secondary syphilitic osteopathy",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5149",
        name: "Other secondary syphilitic conditions",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A515",
        name: "Early syphilis, latent",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A519",
        name: "Early syphilis, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5200",
        name: "Cardiovascular syphilis, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5201",
        name: "Syphilitic aneurysm of aorta",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5202",
        name: "Syphilitic aortitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5203",
        name: "Syphilitic endocarditis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5204",
        name: "Syphilitic cerebral arteritis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5205",
        name: "Other cerebrovascular syphilis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5206",
        name: "Other syphilitic heart involvement",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5209",
        name: "Other cardiovascular syphilis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5210",
        name: "Symptomatic neurosyphilis, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5211",
        name: "Tabes dorsalis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5212",
        name: "Other cerebrospinal syphilis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5213",
        name: "Late syphilitic meningitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5214",
        name: "Late syphilitic encephalitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5215",
        name: "Late syphilitic neuropathy",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5216",
        name: "Charcot's arthropathy (tabetic)",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5217",
        name: "General paresis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5219",
        name: "Other symptomatic neurosyphilis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A522",
        name: "Asymptomatic neurosyphilis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A523",
        name: "Neurosyphilis, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5271",
        name: "Late syphilitic oculopathy",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5272",
        name: "Syphilis of lung and bronchus",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5273",
        name: "Symptomatic late syphilis of other respiratory organs",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5274",
        name: "Syphilis of liver and other viscera",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5275",
        name: "Syphilis of kidney and ureter",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5276",
        name: "Other genitourinary symptomatic late syphilis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5277",
        name: "Syphilis of bone and joint",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5278",
        name: "Syphilis of other musculoskeletal tissue",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5279",
        name: "Other symptomatic late syphilis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A528",
        name: "Late syphilis, latent",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A529",
        name: "Late syphilis, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A530",
        name: "Latent syphilis, unspecified as early or late",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A539",
        name: "Syphilis, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5400",
        name: "Gonococcal infection of lower genitourinary tract, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5401",
        name: "Gonococcal cystitis and urethritis, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5402",
        name: "Gonococcal vulvovaginitis, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5403",
        name: "Gonococcal cervicitis, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5409",
        name: "Other gonococcal infection of lower genitourinary tract",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A541",
        name:
          "Gonococcal infection of lower genitourinary tract with periurethral and accessory gland abscess",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5421",
        name: "Gonococcal infection of kidney and ureter",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5422",
        name: "Gonococcal prostatitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5423",
        name: "Gonococcal infection of other male genital organs",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5424",
        name: "Gonococcal female pelvic inflammatory disease",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5429",
        name: "Other gonococcal genitourinary infections",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5430",
        name: "Gonococcal infection of eye, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5431",
        name: "Gonococcal conjunctivitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5432",
        name: "Gonococcal iridocyclitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5433",
        name: "Gonococcal keratitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5439",
        name: "Other gonococcal eye infection",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5440",
        name: "Gonococcal infection of musculoskeletal system, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5441",
        name: "Gonococcal spondylopathy",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5442",
        name: "Gonococcal arthritis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5443",
        name: "Gonococcal osteomyelitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5449",
        name: "Gonococcal infection of other musculoskeletal tissue",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A545",
        name: "Gonococcal pharyngitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A546",
        name: "Gonococcal infection of anus and rectum",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5481",
        name: "Gonococcal meningitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5482",
        name: "Gonococcal brain abscess",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5483",
        name: "Gonococcal heart infection",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5484",
        name: "Gonococcal pneumonia",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5485",
        name: "Gonococcal peritonitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5486",
        name: "Gonococcal sepsis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5489",
        name: "Other gonococcal infections",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A549",
        name: "Gonococcal infection, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A55",
        name: "Chlamydial lymphogranuloma (venereum)",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5600",
        name: "Chlamydial infection of lower genitourinary tract, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5601",
        name: "Chlamydial cystitis and urethritis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5602",
        name: "Chlamydial vulvovaginitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5609",
        name: "Other chlamydial infection of lower genitourinary tract",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5611",
        name: "Chlamydial female pelvic inflammatory disease",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5619",
        name: "Other chlamydial genitourinary infection",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A562",
        name: "Chlamydial infection of genitourinary tract, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A563",
        name: "Chlamydial infection of anus and rectum",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A564",
        name: "Chlamydial infection of pharynx",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A568",
        name: "Sexually transmitted chlamydial infection of other sites",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A57",
        name: "Chancroid",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A58",
        name: "Granuloma inguinale",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5900",
        name: "Urogenital trichomoniasis, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5901",
        name: "Trichomonal vulvovaginitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5902",
        name: "Trichomonal prostatitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5903",
        name: "Trichomonal cystitis and urethritis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A5909",
        name: "Other urogenital trichomoniasis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A598",
        name: "Trichomoniasis of other sites",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A599",
        name: "Trichomoniasis, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A6000",
        name: "Herpesviral infection of urogenital system, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A6001",
        name: "Herpesviral infection of penis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A6002",
        name: "Herpesviral infection of other male genital organs",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A6003",
        name: "Herpesviral cervicitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A6004",
        name: "Herpesviral vulvovaginitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A6009",
        name: "Herpesviral infection of other urogenital tract",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A601",
        name: "Herpesviral infection of perianal skin and rectum",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A609",
        name: "Anogenital herpesviral infection, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A630",
        name: "Anogenital (venereal) warts",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A638",
        name: "Other specified predominantly sexually transmitted diseases",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A64",
        name: "Unspecified sexually transmitted disease",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A65",
        name: "Nonvenereal syphilis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A660",
        name: "Initial lesions of yaws",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A661",
        name: "Multiple papillomata and wet crab yaws",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A662",
        name: "Other early skin lesions of yaws",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A663",
        name: "Hyperkeratosis of yaws",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A664",
        name: "Gummata and ulcers of yaws",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A665",
        name: "Gangosa",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A666",
        name: "Bone and joint lesions of yaws",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A667",
        name: "Other manifestations of yaws",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A668",
        name: "Latent yaws",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A669",
        name: "Yaws, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A670",
        name: "Primary lesions of pinta",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A671",
        name: "Intermediate lesions of pinta",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A672",
        name: "Late lesions of pinta",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A673",
        name: "Mixed lesions of pinta",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A679",
        name: "Pinta, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A680",
        name: "Louse-borne relapsing fever",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A681",
        name: "Tick-borne relapsing fever",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A689",
        name: "Relapsing fever, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A690",
        name: "Necrotizing ulcerative stomatitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A691",
        name: "Other Vincent's infections",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A6920",
        name: "Lyme disease, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A6921",
        name: "Meningitis due to Lyme disease",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A6922",
        name: "Other neurologic disorders in Lyme disease",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A6923",
        name: "Arthritis due to Lyme disease",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A6929",
        name: "Other conditions associated with Lyme disease",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A698",
        name: "Other specified spirochetal infections",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A699",
        name: "Spirochetal infection, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A70",
        name: "Chlamydia psittaci infections",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A710",
        name: "Initial stage of trachoma",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A711",
        name: "Active stage of trachoma",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A719",
        name: "Trachoma, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A740",
        name: "Chlamydial conjunctivitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A7481",
        name: "Chlamydial peritonitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A7489",
        name: "Other chlamydial diseases",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A749",
        name: "Chlamydial infection, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A750",
        name: "Epidemic louse-borne typhus fever due to Rickettsia prowazekii",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A751",
        name: "Recrudescent typhus [Brill's disease]",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A752",
        name: "Typhus fever due to Rickettsia typhi",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A753",
        name: "Typhus fever due to Rickettsia tsutsugamushi",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A759",
        name: "Typhus fever, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A770",
        name: "Spotted fever due to Rickettsia rickettsii",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A771",
        name: "Spotted fever due to Rickettsia conorii",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A772",
        name: "Spotted fever due to Rickettsia siberica",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A773",
        name: "Spotted fever due to Rickettsia australis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A7740",
        name: "Ehrlichiosis, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A7741",
        name: "Ehrlichiosis chafeensis [E. chafeensis]",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A7749",
        name: "Other ehrlichiosis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A778",
        name: "Other spotted fevers",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A779",
        name: "Spotted fever, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A78",
        name: "Q fever",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A790",
        name: "Trench fever",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A791",
        name: "Rickettsialpox due to Rickettsia akari",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A7981",
        name: "Rickettsiosis due to Ehrlichia sennetsu",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A7989",
        name: "Other specified rickettsioses",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A799",
        name: "Rickettsiosis, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A800",
        name: "Acute paralytic poliomyelitis, vaccine-associated",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A801",
        name: "Acute paralytic poliomyelitis, wild virus, imported",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A802",
        name: "Acute paralytic poliomyelitis, wild virus, indigenous",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A8030",
        name: "Acute paralytic poliomyelitis, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A8039",
        name: "Other acute paralytic poliomyelitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A804",
        name: "Acute nonparalytic poliomyelitis",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A809",
        name: "Acute poliomyelitis, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A8100",
        name: "Creutzfeldt-Jakob disease, unspecified",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      },
      {
        code: "A8101",
        name: "Variant Creutzfeldt-Jakob disease",
        created_at: "2020-07-28 09:49:15",
        updated_at: "2020-07-28 09:49:15"
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(TABLE_NAME, null, {});
  }
};
