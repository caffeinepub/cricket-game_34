export type PlayerRole = "batsman" | "bowler" | "allrounder" | "wicketkeeper";

export interface CricketPlayer {
  name: string;
  role: PlayerRole;
  battingOrder: number; // 1-11
  isBowler: boolean;
  skinTone: string; // hex color
  photoUrl?: string; // real player photo
}

export interface IPLTeam {
  id: string;
  name: string;
  shortName: string;
  primaryColor: string;
  secondaryColor: string;
  jerseyColor: string;
  helmetColor: string;
  players: CricketPlayer[];
}

export interface InternationalTeam {
  id: string;
  name: string;
  shortName: string;
  flag: string;
  primaryColor: string;
  secondaryColor: string;
  jerseyColor: string;
  helmetColor: string;
  players: CricketPlayer[];
}

export const IPL_TEAMS: IPLTeam[] = [
  {
    id: "mi",
    name: "Mumbai Indians",
    shortName: "MI",
    primaryColor: "#004BA0",
    secondaryColor: "#D4AF37",
    jerseyColor: "#004BA0",
    helmetColor: "#004BA0",
    players: [
      {
        name: "Rohit Sharma",
        role: "batsman",
        battingOrder: 1,
        isBowler: false,
        skinTone: "#8B5E3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Rohit_Sharma_-_2018_%28cropped%29.jpg/200px-Rohit_Sharma_-_2018_%28cropped%29.jpg",
      },
      {
        name: "Ishan Kishan",
        role: "wicketkeeper",
        battingOrder: 2,
        isBowler: false,
        skinTone: "#7A4F2D",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Ishan_Kishan_%28cropped%29.jpg/200px-Ishan_Kishan_%28cropped%29.jpg",
      },
      {
        name: "Suryakumar Yadav",
        role: "batsman",
        battingOrder: 3,
        isBowler: false,
        skinTone: "#7D5A3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Surya_Kumar_Yadav.jpg/200px-Surya_Kumar_Yadav.jpg",
      },
      {
        name: "Tilak Varma",
        role: "batsman",
        battingOrder: 4,
        isBowler: false,
        skinTone: "#8A6040",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Tilak_Varma_%28cropped%29.jpg/200px-Tilak_Varma_%28cropped%29.jpg",
      },
      {
        name: "Tim David",
        role: "batsman",
        battingOrder: 5,
        isBowler: false,
        skinTone: "#C4885A",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Tim_David_2022.jpg/200px-Tim_David_2022.jpg",
      },
      {
        name: "Hardik Pandya",
        role: "allrounder",
        battingOrder: 6,
        isBowler: true,
        skinTone: "#8B5E3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Hardik_Pandya_2022_%28cropped%29.jpg/200px-Hardik_Pandya_2022_%28cropped%29.jpg",
      },
      {
        name: "Kieron Pollard",
        role: "allrounder",
        battingOrder: 7,
        isBowler: true,
        skinTone: "#3D2B1A",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Kieron_Pollard_%28cropped%29.jpg/200px-Kieron_Pollard_%28cropped%29.jpg",
      },
      {
        name: "Jasprit Bumrah",
        role: "bowler",
        battingOrder: 10,
        isBowler: true,
        skinTone: "#8A6040",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Jasprit_Bumrah_2022_%28cropped%29.jpg/200px-Jasprit_Bumrah_2022_%28cropped%29.jpg",
      },
      {
        name: "Lasith Malinga",
        role: "bowler",
        battingOrder: 11,
        isBowler: true,
        skinTone: "#5C3A1E",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Lasith_Malinga_2019_%28cropped%29.jpg/200px-Lasith_Malinga_2019_%28cropped%29.jpg",
      },
      {
        name: "Trent Boult",
        role: "bowler",
        battingOrder: 9,
        isBowler: true,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Trent_Boult_%28cropped%29.jpg/200px-Trent_Boult_%28cropped%29.jpg",
      },
      {
        name: "Piyush Chawla",
        role: "bowler",
        battingOrder: 8,
        isBowler: true,
        skinTone: "#8B5E3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Piyush_Chawla_%28cropped%29.jpg/200px-Piyush_Chawla_%28cropped%29.jpg",
      },
    ],
  },
  {
    id: "csk",
    name: "Chennai Super Kings",
    shortName: "CSK",
    primaryColor: "#FFC72C",
    secondaryColor: "#0081C9",
    jerseyColor: "#FFC72C",
    helmetColor: "#D4A000",
    players: [
      {
        name: "MS Dhoni",
        role: "wicketkeeper",
        battingOrder: 5,
        isBowler: false,
        skinTone: "#7A4F2D",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/MS_Dhoni_in_2019_%28cropped%29.jpg/200px-MS_Dhoni_in_2019_%28cropped%29.jpg",
      },
      {
        name: "Ruturaj Gaikwad",
        role: "batsman",
        battingOrder: 1,
        isBowler: false,
        skinTone: "#8B5E3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Ruturaj_Gaikwad_%28cropped%29.jpg/200px-Ruturaj_Gaikwad_%28cropped%29.jpg",
      },
      {
        name: "Devon Conway",
        role: "batsman",
        battingOrder: 2,
        isBowler: false,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Devon_Conway_%28cropped%29.jpg/200px-Devon_Conway_%28cropped%29.jpg",
      },
      {
        name: "Ambati Rayudu",
        role: "batsman",
        battingOrder: 4,
        isBowler: false,
        skinTone: "#7D5A3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Ambati_Rayudu_%28cropped%29.jpg/200px-Ambati_Rayudu_%28cropped%29.jpg",
      },
      {
        name: "Ravindra Jadeja",
        role: "allrounder",
        battingOrder: 6,
        isBowler: true,
        skinTone: "#8A6040",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Ravindra_Jadeja_2018_%28cropped%29.jpg/200px-Ravindra_Jadeja_2018_%28cropped%29.jpg",
      },
      {
        name: "Moeen Ali",
        role: "allrounder",
        battingOrder: 7,
        isBowler: true,
        skinTone: "#8B6B40",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Moeen_Ali_%28cropped%29.jpg/200px-Moeen_Ali_%28cropped%29.jpg",
      },
      {
        name: "Deepak Chahar",
        role: "bowler",
        battingOrder: 8,
        isBowler: true,
        skinTone: "#8B5E3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Deepak_Chahar_%28cropped%29.jpg/200px-Deepak_Chahar_%28cropped%29.jpg",
      },
      {
        name: "Tushar Deshpande",
        role: "bowler",
        battingOrder: 10,
        isBowler: true,
        skinTone: "#7A4F2D",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Tushar_Deshpande_%28cropped%29.jpg/200px-Tushar_Deshpande_%28cropped%29.jpg",
      },
      {
        name: "Matheesha Pathirana",
        role: "bowler",
        battingOrder: 11,
        isBowler: true,
        skinTone: "#6B4423",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Matheesha_Pathirana_%28cropped%29.jpg/200px-Matheesha_Pathirana_%28cropped%29.jpg",
      },
      {
        name: "Mitchell Santner",
        role: "allrounder",
        battingOrder: 9,
        isBowler: true,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Mitchell_Santner_%28cropped%29.jpg/200px-Mitchell_Santner_%28cropped%29.jpg",
      },
      {
        name: "Maheesh Theekshana",
        role: "bowler",
        battingOrder: 3,
        isBowler: true,
        skinTone: "#7D5A3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Maheesh_Theekshana_%28cropped%29.jpg/200px-Maheesh_Theekshana_%28cropped%29.jpg",
      },
    ],
  },
  {
    id: "rcb",
    name: "Royal Challengers Bangalore",
    shortName: "RCB",
    primaryColor: "#EC1C24",
    secondaryColor: "#000000",
    jerseyColor: "#EC1C24",
    helmetColor: "#8B0000",
    players: [
      {
        name: "Virat Kohli",
        role: "batsman",
        battingOrder: 1,
        isBowler: false,
        skinTone: "#8B5E3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Virat_Kohli_2019_%28cropped%29.jpg/200px-Virat_Kohli_2019_%28cropped%29.jpg",
      },
      {
        name: "Faf du Plessis",
        role: "batsman",
        battingOrder: 2,
        isBowler: false,
        skinTone: "#C4885A",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Faf_du_Plessis_%28cropped%29.jpg/200px-Faf_du_Plessis_%28cropped%29.jpg",
      },
      {
        name: "Glenn Maxwell",
        role: "allrounder",
        battingOrder: 3,
        isBowler: true,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Glenn_Maxwell_2022_%28cropped%29.jpg/200px-Glenn_Maxwell_2022_%28cropped%29.jpg",
      },
      {
        name: "AB de Villiers",
        role: "batsman",
        battingOrder: 4,
        isBowler: false,
        skinTone: "#C09060",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/AB_de_Villiers_%28cropped%29.jpg/200px-AB_de_Villiers_%28cropped%29.jpg",
      },
      {
        name: "Dinesh Karthik",
        role: "wicketkeeper",
        battingOrder: 5,
        isBowler: false,
        skinTone: "#5C3A1E",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Dinesh_Karthik_2019_%28cropped%29.jpg/200px-Dinesh_Karthik_2019_%28cropped%29.jpg",
      },
      {
        name: "Cameron Green",
        role: "allrounder",
        battingOrder: 6,
        isBowler: true,
        skinTone: "#E8C49A",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Cameron_Green_2022_%28cropped%29.jpg/200px-Cameron_Green_2022_%28cropped%29.jpg",
      },
      {
        name: "Harshal Patel",
        role: "bowler",
        battingOrder: 8,
        isBowler: true,
        skinTone: "#8B5E3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Harshal_Patel_%28cropped%29.jpg/200px-Harshal_Patel_%28cropped%29.jpg",
      },
      {
        name: "Mohammed Siraj",
        role: "bowler",
        battingOrder: 10,
        isBowler: true,
        skinTone: "#7A4F2D",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Mohammed_Siraj_%28cropped%29.jpg/200px-Mohammed_Siraj_%28cropped%29.jpg",
      },
      {
        name: "Josh Hazlewood",
        role: "bowler",
        battingOrder: 11,
        isBowler: true,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Josh_Hazlewood_2022_%28cropped%29.jpg/200px-Josh_Hazlewood_2022_%28cropped%29.jpg",
      },
      {
        name: "Wanindu Hasaranga",
        role: "allrounder",
        battingOrder: 7,
        isBowler: true,
        skinTone: "#7D5A3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Wanindu_Hasaranga_%28cropped%29.jpg/200px-Wanindu_Hasaranga_%28cropped%29.jpg",
      },
      {
        name: "Karn Sharma",
        role: "bowler",
        battingOrder: 9,
        isBowler: true,
        skinTone: "#8B5E3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Karn_Sharma_%28cropped%29.jpg/200px-Karn_Sharma_%28cropped%29.jpg",
      },
    ],
  },
  {
    id: "kkr",
    name: "Kolkata Knight Riders",
    shortName: "KKR",
    primaryColor: "#3A225D",
    secondaryColor: "#D4AF37",
    jerseyColor: "#3A225D",
    helmetColor: "#2A1545",
    players: [
      {
        name: "Shreyas Iyer",
        role: "batsman",
        battingOrder: 1,
        isBowler: false,
        skinTone: "#8B5E3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Shreyas_Iyer_%28cropped%29.jpg/200px-Shreyas_Iyer_%28cropped%29.jpg",
      },
      {
        name: "Jason Roy",
        role: "batsman",
        battingOrder: 2,
        isBowler: false,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Jason_Roy_%28cropped%29.jpg/200px-Jason_Roy_%28cropped%29.jpg",
      },
      {
        name: "Nitish Rana",
        role: "batsman",
        battingOrder: 3,
        isBowler: false,
        skinTone: "#8A6040",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Nitish_Rana_%28cropped%29.jpg/200px-Nitish_Rana_%28cropped%29.jpg",
      },
      {
        name: "Andre Russell",
        role: "allrounder",
        battingOrder: 5,
        isBowler: true,
        skinTone: "#2D1B0E",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Andre_Russell_%28cropped%29.jpg/200px-Andre_Russell_%28cropped%29.jpg",
      },
      {
        name: "Sunil Narine",
        role: "allrounder",
        battingOrder: 4,
        isBowler: true,
        skinTone: "#4A2C17",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Sunil_Narine_%28cropped%29.jpg/200px-Sunil_Narine_%28cropped%29.jpg",
      },
      {
        name: "Pat Cummins",
        role: "bowler",
        battingOrder: 6,
        isBowler: true,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Pat_Cummins_%28cropped%29.jpg/200px-Pat_Cummins_%28cropped%29.jpg",
      },
      {
        name: "Varun Chakravarthy",
        role: "bowler",
        battingOrder: 9,
        isBowler: true,
        skinTone: "#8B5E3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Varun_Chakravarthy_%28cropped%29.jpg/200px-Varun_Chakravarthy_%28cropped%29.jpg",
      },
      {
        name: "Shardul Thakur",
        role: "allrounder",
        battingOrder: 7,
        isBowler: true,
        skinTone: "#7A4F2D",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Shardul_Thakur_%28cropped%29.jpg/200px-Shardul_Thakur_%28cropped%29.jpg",
      },
      {
        name: "Umesh Yadav",
        role: "bowler",
        battingOrder: 10,
        isBowler: true,
        skinTone: "#7D5A3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Umesh_Yadav_%28cropped%29.jpg/200px-Umesh_Yadav_%28cropped%29.jpg",
      },
      {
        name: "Tim Southee",
        role: "bowler",
        battingOrder: 11,
        isBowler: true,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Tim_Southee_%28cropped%29.jpg/200px-Tim_Southee_%28cropped%29.jpg",
      },
      {
        name: "Rinku Singh",
        role: "batsman",
        battingOrder: 8,
        isBowler: false,
        skinTone: "#8A6040",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Rinku_Singh_%28cropped%29.jpg/200px-Rinku_Singh_%28cropped%29.jpg",
      },
    ],
  },
  {
    id: "dc",
    name: "Delhi Capitals",
    shortName: "DC",
    primaryColor: "#0078BC",
    secondaryColor: "#EF1C25",
    jerseyColor: "#0078BC",
    helmetColor: "#005A90",
    players: [
      {
        name: "Rishabh Pant",
        role: "wicketkeeper",
        battingOrder: 3,
        isBowler: false,
        skinTone: "#8B5E3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Rishabh_Pant_%282019%2C_cropped%29.jpg/200px-Rishabh_Pant_%282019%2C_cropped%29.jpg",
      },
      {
        name: "David Warner",
        role: "batsman",
        battingOrder: 1,
        isBowler: false,
        skinTone: "#C4885A",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/David_Warner_%28cricketer%2C_cropped%29.jpg/200px-David_Warner_%28cricketer%2C_cropped%29.jpg",
      },
      {
        name: "Mitchell Marsh",
        role: "allrounder",
        battingOrder: 4,
        isBowler: true,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Mitchell_Marsh_%28cropped%29.jpg/200px-Mitchell_Marsh_%28cropped%29.jpg",
      },
      {
        name: "Axar Patel",
        role: "allrounder",
        battingOrder: 6,
        isBowler: true,
        skinTone: "#7A4F2D",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Axar_Patel_%28cropped%29.jpg/200px-Axar_Patel_%28cropped%29.jpg",
      },
      {
        name: "Prithvi Shaw",
        role: "batsman",
        battingOrder: 2,
        isBowler: false,
        skinTone: "#8B5E3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Prithvi_Shaw_%28cropped%29.jpg/200px-Prithvi_Shaw_%28cropped%29.jpg",
      },
      {
        name: "Kuldeep Yadav",
        role: "bowler",
        battingOrder: 9,
        isBowler: true,
        skinTone: "#8A6040",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Kuldeep_Yadav_%28cropped%29.jpg/200px-Kuldeep_Yadav_%28cropped%29.jpg",
      },
      {
        name: "Anrich Nortje",
        role: "bowler",
        battingOrder: 10,
        isBowler: true,
        skinTone: "#C09060",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Anrich_Nortje_%28cropped%29.jpg/200px-Anrich_Nortje_%28cropped%29.jpg",
      },
      {
        name: "Ishant Sharma",
        role: "bowler",
        battingOrder: 11,
        isBowler: true,
        skinTone: "#7D5A3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Ishant_Sharma_%28cropped%29.jpg/200px-Ishant_Sharma_%28cropped%29.jpg",
      },
      {
        name: "Ricky Bhui",
        role: "batsman",
        battingOrder: 5,
        isBowler: false,
        skinTone: "#8B5E3C",
      },
      {
        name: "Sarfaraz Khan",
        role: "batsman",
        battingOrder: 7,
        isBowler: false,
        skinTone: "#8A6040",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Sarfaraz_Khan_%28cropped%29.jpg/200px-Sarfaraz_Khan_%28cropped%29.jpg",
      },
      {
        name: "Mukesh Kumar",
        role: "bowler",
        battingOrder: 8,
        isBowler: true,
        skinTone: "#7A4F2D",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Mukesh_Kumar_%28cricketer%2C_cropped%29.jpg/200px-Mukesh_Kumar_%28cricketer%2C_cropped%29.jpg",
      },
    ],
  },
  {
    id: "pbks",
    name: "Punjab Kings",
    shortName: "PBKS",
    primaryColor: "#ED1B24",
    secondaryColor: "#C0C0C0",
    jerseyColor: "#ED1B24",
    helmetColor: "#C00000",
    players: [
      {
        name: "Shikhar Dhawan",
        role: "batsman",
        battingOrder: 1,
        isBowler: false,
        skinTone: "#8B5E3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Shikhar_Dhawan_2019_%28cropped%29.jpg/200px-Shikhar_Dhawan_2019_%28cropped%29.jpg",
      },
      {
        name: "Liam Livingstone",
        role: "allrounder",
        battingOrder: 3,
        isBowler: true,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Liam_Livingstone_%28cropped%29.jpg/200px-Liam_Livingstone_%28cropped%29.jpg",
      },
      {
        name: "Jonny Bairstow",
        role: "wicketkeeper",
        battingOrder: 2,
        isBowler: false,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Jonny_Bairstow_%28cropped%29.jpg/200px-Jonny_Bairstow_%28cropped%29.jpg",
      },
      {
        name: "Shahrukh Khan",
        role: "batsman",
        battingOrder: 5,
        isBowler: false,
        skinTone: "#7D5A3C",
      },
      {
        name: "Sam Curran",
        role: "allrounder",
        battingOrder: 6,
        isBowler: true,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Sam_Curran_%28cropped%29.jpg/200px-Sam_Curran_%28cropped%29.jpg",
      },
      {
        name: "Kagiso Rabada",
        role: "bowler",
        battingOrder: 8,
        isBowler: true,
        skinTone: "#3D2B1A",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Kagiso_Rabada_%28cropped%29.jpg/200px-Kagiso_Rabada_%28cropped%29.jpg",
      },
      {
        name: "Arshdeep Singh",
        role: "bowler",
        battingOrder: 10,
        isBowler: true,
        skinTone: "#8B5E3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Arshdeep_Singh_%28cropped%29.jpg/200px-Arshdeep_Singh_%28cropped%29.jpg",
      },
      {
        name: "Rahul Chahar",
        role: "bowler",
        battingOrder: 9,
        isBowler: true,
        skinTone: "#7A4F2D",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Rahul_Chahar_%28cropped%29.jpg/200px-Rahul_Chahar_%28cropped%29.jpg",
      },
      {
        name: "Nathan Ellis",
        role: "bowler",
        battingOrder: 11,
        isBowler: true,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Nathan_Ellis_%28cropped%29.jpg/200px-Nathan_Ellis_%28cropped%29.jpg",
      },
      {
        name: "Bhanuka Rajapaksa",
        role: "batsman",
        battingOrder: 4,
        isBowler: false,
        skinTone: "#7D5A3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Bhanuka_Rajapaksa_%28cropped%29.jpg/200px-Bhanuka_Rajapaksa_%28cropped%29.jpg",
      },
      {
        name: "Rishi Dhawan",
        role: "allrounder",
        battingOrder: 7,
        isBowler: true,
        skinTone: "#8B5E3C",
      },
    ],
  },
  {
    id: "rr",
    name: "Rajasthan Royals",
    shortName: "RR",
    primaryColor: "#EA1A7F",
    secondaryColor: "#254AA5",
    jerseyColor: "#EA1A7F",
    helmetColor: "#C00070",
    players: [
      {
        name: "Sanju Samson",
        role: "wicketkeeper",
        battingOrder: 1,
        isBowler: false,
        skinTone: "#7A4F2D",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Sanju_Samson_%28cropped%29.jpg/200px-Sanju_Samson_%28cropped%29.jpg",
      },
      {
        name: "Jos Buttler",
        role: "batsman",
        battingOrder: 2,
        isBowler: false,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Jos_Buttler_%28cropped%29.jpg/200px-Jos_Buttler_%28cropped%29.jpg",
      },
      {
        name: "Shimron Hetmyer",
        role: "batsman",
        battingOrder: 5,
        isBowler: false,
        skinTone: "#3D2B1A",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Shimron_Hetmyer_%28cropped%29.jpg/200px-Shimron_Hetmyer_%28cropped%29.jpg",
      },
      {
        name: "Yashasvi Jaiswal",
        role: "batsman",
        battingOrder: 3,
        isBowler: false,
        skinTone: "#8B5E3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Yashasvi_Jaiswal_%28cropped%29.jpg/200px-Yashasvi_Jaiswal_%28cropped%29.jpg",
      },
      {
        name: "Devdutt Padikkal",
        role: "batsman",
        battingOrder: 4,
        isBowler: false,
        skinTone: "#8A6040",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Devdutt_Padikkal_%28cropped%29.jpg/200px-Devdutt_Padikkal_%28cropped%29.jpg",
      },
      {
        name: "Ravichandran Ashwin",
        role: "allrounder",
        battingOrder: 7,
        isBowler: true,
        skinTone: "#5C3A1E",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Ravichandran_Ashwin_2018_%28cropped%29.jpg/200px-Ravichandran_Ashwin_2018_%28cropped%29.jpg",
      },
      {
        name: "Trent Boult",
        role: "bowler",
        battingOrder: 9,
        isBowler: true,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Trent_Boult_%28cropped%29.jpg/200px-Trent_Boult_%28cropped%29.jpg",
      },
      {
        name: "Prasidh Krishna",
        role: "bowler",
        battingOrder: 10,
        isBowler: true,
        skinTone: "#7D5A3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Prasidh_Krishna_%28cropped%29.jpg/200px-Prasidh_Krishna_%28cropped%29.jpg",
      },
      {
        name: "Yuzvendra Chahal",
        role: "bowler",
        battingOrder: 11,
        isBowler: true,
        skinTone: "#8B5E3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Yuzvendra_Chahal_%28cropped%29.jpg/200px-Yuzvendra_Chahal_%28cropped%29.jpg",
      },
      {
        name: "Jason Holder",
        role: "allrounder",
        battingOrder: 8,
        isBowler: true,
        skinTone: "#2D1B0E",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Jason_Holder_%28cropped%29.jpg/200px-Jason_Holder_%28cropped%29.jpg",
      },
      {
        name: "Riyan Parag",
        role: "allrounder",
        battingOrder: 6,
        isBowler: true,
        skinTone: "#8A6040",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Riyan_Parag_%28cropped%29.jpg/200px-Riyan_Parag_%28cropped%29.jpg",
      },
    ],
  },
  {
    id: "srh",
    name: "Sunrisers Hyderabad",
    shortName: "SRH",
    primaryColor: "#F7A721",
    secondaryColor: "#1B1B1B",
    jerseyColor: "#F7A721",
    helmetColor: "#D4860A",
    players: [
      {
        name: "Kane Williamson",
        role: "batsman",
        battingOrder: 1,
        isBowler: false,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Kane_Williamson_%28cropped%29.jpg/200px-Kane_Williamson_%28cropped%29.jpg",
      },
      {
        name: "David Warner",
        role: "batsman",
        battingOrder: 2,
        isBowler: false,
        skinTone: "#C4885A",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/David_Warner_%28cricketer%2C_cropped%29.jpg/200px-David_Warner_%28cricketer%2C_cropped%29.jpg",
      },
      {
        name: "Abhishek Sharma",
        role: "batsman",
        battingOrder: 3,
        isBowler: false,
        skinTone: "#8B5E3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Abhishek_Sharma_%28cricketer%2C_cropped%29.jpg/200px-Abhishek_Sharma_%28cricketer%2C_cropped%29.jpg",
      },
      {
        name: "Aiden Markram",
        role: "batsman",
        battingOrder: 4,
        isBowler: false,
        skinTone: "#C09060",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Aiden_Markram_%28cropped%29.jpg/200px-Aiden_Markram_%28cropped%29.jpg",
      },
      {
        name: "Heinrich Klaasen",
        role: "wicketkeeper",
        battingOrder: 5,
        isBowler: false,
        skinTone: "#C4885A",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Heinrich_Klaasen_%28cropped%29.jpg/200px-Heinrich_Klaasen_%28cropped%29.jpg",
      },
      {
        name: "Washington Sundar",
        role: "allrounder",
        battingOrder: 6,
        isBowler: true,
        skinTone: "#7A4F2D",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Washington_Sundar_%28cropped%29.jpg/200px-Washington_Sundar_%28cropped%29.jpg",
      },
      {
        name: "Bhuvneshwar Kumar",
        role: "bowler",
        battingOrder: 7,
        isBowler: true,
        skinTone: "#8B5E3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Bhuvneshwar_Kumar_%28cropped%29.jpg/200px-Bhuvneshwar_Kumar_%28cropped%29.jpg",
      },
      {
        name: "T Natarajan",
        role: "bowler",
        battingOrder: 9,
        isBowler: true,
        skinTone: "#5C3A1E",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/T._Natarajan_%28cropped%29.jpg/200px-T._Natarajan_%28cropped%29.jpg",
      },
      {
        name: "Marco Jansen",
        role: "allrounder",
        battingOrder: 8,
        isBowler: true,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Marco_Jansen_%28cropped%29.jpg/200px-Marco_Jansen_%28cropped%29.jpg",
      },
      {
        name: "Umran Malik",
        role: "bowler",
        battingOrder: 10,
        isBowler: true,
        skinTone: "#8A6040",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Umran_Malik_%28cropped%29.jpg/200px-Umran_Malik_%28cropped%29.jpg",
      },
      {
        name: "Mayank Markande",
        role: "bowler",
        battingOrder: 11,
        isBowler: true,
        skinTone: "#8B5E3C",
      },
    ],
  },
  {
    id: "gt",
    name: "Gujarat Titans",
    shortName: "GT",
    primaryColor: "#1D3461",
    secondaryColor: "#D4AF37",
    jerseyColor: "#1D3461",
    helmetColor: "#152548",
    players: [
      {
        name: "Hardik Pandya",
        role: "allrounder",
        battingOrder: 4,
        isBowler: true,
        skinTone: "#8B5E3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Hardik_Pandya_2022_%28cropped%29.jpg/200px-Hardik_Pandya_2022_%28cropped%29.jpg",
      },
      {
        name: "Shubman Gill",
        role: "batsman",
        battingOrder: 1,
        isBowler: false,
        skinTone: "#C4885A",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Shubman_Gill_%28cropped%29.jpg/200px-Shubman_Gill_%28cropped%29.jpg",
      },
      {
        name: "David Miller",
        role: "batsman",
        battingOrder: 5,
        isBowler: false,
        skinTone: "#C09060",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/David_Miller_%28cricketer%2C_cropped%29.jpg/200px-David_Miller_%28cricketer%2C_cropped%29.jpg",
      },
      {
        name: "Wriddhiman Saha",
        role: "wicketkeeper",
        battingOrder: 2,
        isBowler: false,
        skinTone: "#7A4F2D",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Wriddhiman_Saha_%28cropped%29.jpg/200px-Wriddhiman_Saha_%28cropped%29.jpg",
      },
      {
        name: "Rashid Khan",
        role: "allrounder",
        battingOrder: 7,
        isBowler: true,
        skinTone: "#8A6040",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Rashid_Khan_%28cropped%29.jpg/200px-Rashid_Khan_%28cropped%29.jpg",
      },
      {
        name: "Mohammed Shami",
        role: "bowler",
        battingOrder: 9,
        isBowler: true,
        skinTone: "#8B5E3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Mohammed_Shami_2022_%28cropped%29.jpg/200px-Mohammed_Shami_2022_%28cropped%29.jpg",
      },
      {
        name: "Lockie Ferguson",
        role: "bowler",
        battingOrder: 10,
        isBowler: true,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Lockie_Ferguson_%28cropped%29.jpg/200px-Lockie_Ferguson_%28cropped%29.jpg",
      },
      {
        name: "Alzarri Joseph",
        role: "bowler",
        battingOrder: 11,
        isBowler: true,
        skinTone: "#3D2B1A",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Alzarri_Joseph_%28cropped%29.jpg/200px-Alzarri_Joseph_%28cropped%29.jpg",
      },
      {
        name: "Abhinav Manohar",
        role: "batsman",
        battingOrder: 3,
        isBowler: false,
        skinTone: "#8B5E3C",
      },
      {
        name: "Vijay Shankar",
        role: "allrounder",
        battingOrder: 6,
        isBowler: true,
        skinTone: "#7D5A3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Vijay_Shankar_%28cropped%29.jpg/200px-Vijay_Shankar_%28cropped%29.jpg",
      },
      {
        name: "Rahul Tewatia",
        role: "allrounder",
        battingOrder: 8,
        isBowler: true,
        skinTone: "#8A6040",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Rahul_Tewatia_%28cropped%29.jpg/200px-Rahul_Tewatia_%28cropped%29.jpg",
      },
    ],
  },
  {
    id: "lsg",
    name: "Lucknow Super Giants",
    shortName: "LSG",
    primaryColor: "#A72B2A",
    secondaryColor: "#FFCC00",
    jerseyColor: "#A72B2A",
    helmetColor: "#7A1E1E",
    players: [
      {
        name: "KL Rahul",
        role: "wicketkeeper",
        battingOrder: 1,
        isBowler: false,
        skinTone: "#8B5E3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/KL_Rahul_%28cropped%29.jpg/200px-KL_Rahul_%28cropped%29.jpg",
      },
      {
        name: "Quinton de Kock",
        role: "batsman",
        battingOrder: 2,
        isBowler: false,
        skinTone: "#C4885A",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Quinton_de_Kock_%28cropped%29.jpg/200px-Quinton_de_Kock_%28cropped%29.jpg",
      },
      {
        name: "Marcus Stoinis",
        role: "allrounder",
        battingOrder: 3,
        isBowler: true,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Marcus_Stoinis_%28cropped%29.jpg/200px-Marcus_Stoinis_%28cropped%29.jpg",
      },
      {
        name: "Deepak Hooda",
        role: "batsman",
        battingOrder: 4,
        isBowler: false,
        skinTone: "#8A6040",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Deepak_Hooda_%28cropped%29.jpg/200px-Deepak_Hooda_%28cropped%29.jpg",
      },
      {
        name: "Ayush Badoni",
        role: "batsman",
        battingOrder: 5,
        isBowler: false,
        skinTone: "#8B5E3C",
      },
      {
        name: "Krunal Pandya",
        role: "allrounder",
        battingOrder: 6,
        isBowler: true,
        skinTone: "#7D5A3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Krunal_Pandya_%28cropped%29.jpg/200px-Krunal_Pandya_%28cropped%29.jpg",
      },
      {
        name: "Ravi Bishnoi",
        role: "bowler",
        battingOrder: 8,
        isBowler: true,
        skinTone: "#8B5E3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Ravi_Bishnoi_%28cropped%29.jpg/200px-Ravi_Bishnoi_%28cropped%29.jpg",
      },
      {
        name: "Avesh Khan",
        role: "bowler",
        battingOrder: 9,
        isBowler: true,
        skinTone: "#8A6040",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Avesh_Khan_%28cropped%29.jpg/200px-Avesh_Khan_%28cropped%29.jpg",
      },
      {
        name: "Jason Holder",
        role: "allrounder",
        battingOrder: 7,
        isBowler: true,
        skinTone: "#2D1B0E",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Jason_Holder_%28cropped%29.jpg/200px-Jason_Holder_%28cropped%29.jpg",
      },
      {
        name: "Mohsin Khan",
        role: "bowler",
        battingOrder: 10,
        isBowler: true,
        skinTone: "#7A4F2D",
      },
      {
        name: "Mark Wood",
        role: "bowler",
        battingOrder: 11,
        isBowler: true,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Mark_Wood_%28cricketer%2C_cropped%29.jpg/200px-Mark_Wood_%28cricketer%2C_cropped%29.jpg",
      },
    ],
  },
];

export const INTERNATIONAL_TEAMS: InternationalTeam[] = [
  {
    id: "india",
    name: "India",
    shortName: "IND",
    flag: "🇮🇳",
    primaryColor: "#003087",
    secondaryColor: "#FF8800",
    jerseyColor: "#003087",
    helmetColor: "#002060",
    players: [
      {
        name: "Virat Kohli",
        role: "batsman",
        battingOrder: 3,
        isBowler: false,
        skinTone: "#8B5E3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Virat_Kohli_2019_%28cropped%29.jpg/200px-Virat_Kohli_2019_%28cropped%29.jpg",
      },
      {
        name: "Rohit Sharma",
        role: "batsman",
        battingOrder: 1,
        isBowler: false,
        skinTone: "#8B5E3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Rohit_Sharma_-_2018_%28cropped%29.jpg/200px-Rohit_Sharma_-_2018_%28cropped%29.jpg",
      },
      {
        name: "Shubman Gill",
        role: "batsman",
        battingOrder: 2,
        isBowler: false,
        skinTone: "#C4885A",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Shubman_Gill_%28cropped%29.jpg/200px-Shubman_Gill_%28cropped%29.jpg",
      },
      {
        name: "Suryakumar Yadav",
        role: "batsman",
        battingOrder: 4,
        isBowler: false,
        skinTone: "#7D5A3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Surya_Kumar_Yadav.jpg/200px-Surya_Kumar_Yadav.jpg",
      },
      {
        name: "KL Rahul",
        role: "wicketkeeper",
        battingOrder: 5,
        isBowler: false,
        skinTone: "#8B5E3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/KL_Rahul_%28cropped%29.jpg/200px-KL_Rahul_%28cropped%29.jpg",
      },
      {
        name: "Hardik Pandya",
        role: "allrounder",
        battingOrder: 6,
        isBowler: true,
        skinTone: "#8B5E3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Hardik_Pandya_2022_%28cropped%29.jpg/200px-Hardik_Pandya_2022_%28cropped%29.jpg",
      },
      {
        name: "Ravindra Jadeja",
        role: "allrounder",
        battingOrder: 7,
        isBowler: true,
        skinTone: "#8A6040",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Ravindra_Jadeja_2018_%28cropped%29.jpg/200px-Ravindra_Jadeja_2018_%28cropped%29.jpg",
      },
      {
        name: "Jasprit Bumrah",
        role: "bowler",
        battingOrder: 10,
        isBowler: true,
        skinTone: "#8A6040",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Jasprit_Bumrah_2022_%28cropped%29.jpg/200px-Jasprit_Bumrah_2022_%28cropped%29.jpg",
      },
      {
        name: "Mohammed Siraj",
        role: "bowler",
        battingOrder: 11,
        isBowler: true,
        skinTone: "#7A4F2D",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Mohammed_Siraj_%28cropped%29.jpg/200px-Mohammed_Siraj_%28cropped%29.jpg",
      },
      {
        name: "Kuldeep Yadav",
        role: "bowler",
        battingOrder: 9,
        isBowler: true,
        skinTone: "#8A6040",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Kuldeep_Yadav_%28cropped%29.jpg/200px-Kuldeep_Yadav_%28cropped%29.jpg",
      },
      {
        name: "Mohammed Shami",
        role: "bowler",
        battingOrder: 8,
        isBowler: true,
        skinTone: "#8B5E3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Mohammed_Shami_2022_%28cropped%29.jpg/200px-Mohammed_Shami_2022_%28cropped%29.jpg",
      },
    ],
  },
  {
    id: "australia",
    name: "Australia",
    shortName: "AUS",
    flag: "🇦🇺",
    primaryColor: "#FFCD00",
    secondaryColor: "#00843D",
    jerseyColor: "#FFCD00",
    helmetColor: "#CC9900",
    players: [
      {
        name: "David Warner",
        role: "batsman",
        battingOrder: 1,
        isBowler: false,
        skinTone: "#C4885A",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/David_Warner_%28cricketer%2C_cropped%29.jpg/200px-David_Warner_%28cricketer%2C_cropped%29.jpg",
      },
      {
        name: "Travis Head",
        role: "batsman",
        battingOrder: 2,
        isBowler: false,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Travis_Head_%28cropped%29.jpg/200px-Travis_Head_%28cropped%29.jpg",
      },
      {
        name: "Steve Smith",
        role: "batsman",
        battingOrder: 3,
        isBowler: false,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Steve_Smith_%28cricketer%29_%28cropped%29.jpg/200px-Steve_Smith_%28cricketer%29_%28cropped%29.jpg",
      },
      {
        name: "Marnus Labuschagne",
        role: "batsman",
        battingOrder: 4,
        isBowler: false,
        skinTone: "#C4885A",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Marnus_Labuschagne_%28cropped%29.jpg/200px-Marnus_Labuschagne_%28cropped%29.jpg",
      },
      {
        name: "Glenn Maxwell",
        role: "allrounder",
        battingOrder: 5,
        isBowler: true,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Glenn_Maxwell_2022_%28cropped%29.jpg/200px-Glenn_Maxwell_2022_%28cropped%29.jpg",
      },
      {
        name: "Matthew Wade",
        role: "wicketkeeper",
        battingOrder: 6,
        isBowler: false,
        skinTone: "#C4885A",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Matthew_Wade_%28cropped%29.jpg/200px-Matthew_Wade_%28cropped%29.jpg",
      },
      {
        name: "Pat Cummins",
        role: "bowler",
        battingOrder: 7,
        isBowler: true,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Pat_Cummins_%28cropped%29.jpg/200px-Pat_Cummins_%28cropped%29.jpg",
      },
      {
        name: "Mitchell Starc",
        role: "bowler",
        battingOrder: 9,
        isBowler: true,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Mitchell_Starc_%28cropped%29.jpg/200px-Mitchell_Starc_%28cropped%29.jpg",
      },
      {
        name: "Josh Hazlewood",
        role: "bowler",
        battingOrder: 10,
        isBowler: true,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Josh_Hazlewood_2022_%28cropped%29.jpg/200px-Josh_Hazlewood_2022_%28cropped%29.jpg",
      },
      {
        name: "Adam Zampa",
        role: "bowler",
        battingOrder: 11,
        isBowler: true,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Adam_Zampa_%28cropped%29.jpg/200px-Adam_Zampa_%28cropped%29.jpg",
      },
      {
        name: "Marcus Stoinis",
        role: "allrounder",
        battingOrder: 8,
        isBowler: true,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Marcus_Stoinis_%28cropped%29.jpg/200px-Marcus_Stoinis_%28cropped%29.jpg",
      },
    ],
  },
  {
    id: "england",
    name: "England",
    shortName: "ENG",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    primaryColor: "#003087",
    secondaryColor: "#CF0A2C",
    jerseyColor: "#003087",
    helmetColor: "#001C5C",
    players: [
      {
        name: "Jos Buttler",
        role: "wicketkeeper",
        battingOrder: 1,
        isBowler: false,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Jos_Buttler_%28cropped%29.jpg/200px-Jos_Buttler_%28cropped%29.jpg",
      },
      {
        name: "Jonny Bairstow",
        role: "batsman",
        battingOrder: 2,
        isBowler: false,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Jonny_Bairstow_%28cropped%29.jpg/200px-Jonny_Bairstow_%28cropped%29.jpg",
      },
      {
        name: "Ben Stokes",
        role: "allrounder",
        battingOrder: 3,
        isBowler: true,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Ben_Stokes_%28cropped%29.jpg/200px-Ben_Stokes_%28cropped%29.jpg",
      },
      {
        name: "Joe Root",
        role: "batsman",
        battingOrder: 4,
        isBowler: false,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Joe_Root_%28cropped%29.jpg/200px-Joe_Root_%28cropped%29.jpg",
      },
      {
        name: "Liam Livingstone",
        role: "allrounder",
        battingOrder: 5,
        isBowler: true,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Liam_Livingstone_%28cropped%29.jpg/200px-Liam_Livingstone_%28cropped%29.jpg",
      },
      {
        name: "Moeen Ali",
        role: "allrounder",
        battingOrder: 6,
        isBowler: true,
        skinTone: "#8B6B40",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Moeen_Ali_%28cropped%29.jpg/200px-Moeen_Ali_%28cropped%29.jpg",
      },
      {
        name: "Sam Curran",
        role: "allrounder",
        battingOrder: 7,
        isBowler: true,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Sam_Curran_%28cropped%29.jpg/200px-Sam_Curran_%28cropped%29.jpg",
      },
      {
        name: "Mark Wood",
        role: "bowler",
        battingOrder: 8,
        isBowler: true,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Mark_Wood_%28cricketer%2C_cropped%29.jpg/200px-Mark_Wood_%28cricketer%2C_cropped%29.jpg",
      },
      {
        name: "Jofra Archer",
        role: "bowler",
        battingOrder: 9,
        isBowler: true,
        skinTone: "#6B4423",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Jofra_Archer_%28cropped%29.jpg/200px-Jofra_Archer_%28cropped%29.jpg",
      },
      {
        name: "Adil Rashid",
        role: "bowler",
        battingOrder: 10,
        isBowler: true,
        skinTone: "#8B6B40",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Adil_Rashid_%28cropped%29.jpg/200px-Adil_Rashid_%28cropped%29.jpg",
      },
      {
        name: "Chris Woakes",
        role: "allrounder",
        battingOrder: 11,
        isBowler: true,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Chris_Woakes_%28cropped%29.jpg/200px-Chris_Woakes_%28cropped%29.jpg",
      },
    ],
  },
  {
    id: "pakistan",
    name: "Pakistan",
    shortName: "PAK",
    flag: "🇵🇰",
    primaryColor: "#01411C",
    secondaryColor: "#FFFFFF",
    jerseyColor: "#01411C",
    helmetColor: "#012D14",
    players: [
      {
        name: "Babar Azam",
        role: "batsman",
        battingOrder: 1,
        isBowler: false,
        skinTone: "#8B5E3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Babar_Azam_2022_%28cropped%29.jpg/200px-Babar_Azam_2022_%28cropped%29.jpg",
      },
      {
        name: "Mohammad Rizwan",
        role: "wicketkeeper",
        battingOrder: 2,
        isBowler: false,
        skinTone: "#8A6040",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Mohammad_Rizwan_%28cropped%29.jpg/200px-Mohammad_Rizwan_%28cropped%29.jpg",
      },
      {
        name: "Fakhar Zaman",
        role: "batsman",
        battingOrder: 3,
        isBowler: false,
        skinTone: "#8B5E3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Fakhar_Zaman_%28cropped%29.jpg/200px-Fakhar_Zaman_%28cropped%29.jpg",
      },
      {
        name: "Iftikhar Ahmed",
        role: "allrounder",
        battingOrder: 4,
        isBowler: true,
        skinTone: "#7D5A3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Iftikhar_Ahmed_%28cropped%29.jpg/200px-Iftikhar_Ahmed_%28cropped%29.jpg",
      },
      {
        name: "Shadab Khan",
        role: "allrounder",
        battingOrder: 6,
        isBowler: true,
        skinTone: "#8B5E3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Shadab_Khan_%28cropped%29.jpg/200px-Shadab_Khan_%28cropped%29.jpg",
      },
      {
        name: "Imad Wasim",
        role: "allrounder",
        battingOrder: 5,
        isBowler: true,
        skinTone: "#8A6040",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Imad_Wasim_%28cropped%29.jpg/200px-Imad_Wasim_%28cropped%29.jpg",
      },
      {
        name: "Shaheen Afridi",
        role: "bowler",
        battingOrder: 9,
        isBowler: true,
        skinTone: "#8B5E3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Shaheen_Shah_Afridi_%28cropped%29.jpg/200px-Shaheen_Shah_Afridi_%28cropped%29.jpg",
      },
      {
        name: "Haris Rauf",
        role: "bowler",
        battingOrder: 10,
        isBowler: true,
        skinTone: "#8A6040",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Haris_Rauf_%28cropped%29.jpg/200px-Haris_Rauf_%28cropped%29.jpg",
      },
      {
        name: "Naseem Shah",
        role: "bowler",
        battingOrder: 11,
        isBowler: true,
        skinTone: "#7D5A3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Naseem_Shah_%28cropped%29.jpg/200px-Naseem_Shah_%28cropped%29.jpg",
      },
      {
        name: "Mohammad Nawaz",
        role: "allrounder",
        battingOrder: 7,
        isBowler: true,
        skinTone: "#8B5E3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Mohammad_Nawaz_%28cricketer%2C_cropped%29.jpg/200px-Mohammad_Nawaz_%28cricketer%2C_cropped%29.jpg",
      },
      {
        name: "Asif Ali",
        role: "batsman",
        battingOrder: 8,
        isBowler: false,
        skinTone: "#7A4F2D",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Asif_Ali_%28cricketer%2C_cropped%29.jpg/200px-Asif_Ali_%28cricketer%2C_cropped%29.jpg",
      },
    ],
  },
  {
    id: "southafrica",
    name: "South Africa",
    shortName: "SA",
    flag: "🇿🇦",
    primaryColor: "#007A4D",
    secondaryColor: "#FFB81C",
    jerseyColor: "#007A4D",
    helmetColor: "#005A38",
    players: [
      {
        name: "Temba Bavuma",
        role: "batsman",
        battingOrder: 1,
        isBowler: false,
        skinTone: "#4A2C17",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Temba_Bavuma_%28cropped%29.jpg/200px-Temba_Bavuma_%28cropped%29.jpg",
      },
      {
        name: "Quinton de Kock",
        role: "wicketkeeper",
        battingOrder: 2,
        isBowler: false,
        skinTone: "#C4885A",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Quinton_de_Kock_%28cropped%29.jpg/200px-Quinton_de_Kock_%28cropped%29.jpg",
      },
      {
        name: "Rassie van der Dussen",
        role: "batsman",
        battingOrder: 3,
        isBowler: false,
        skinTone: "#C4885A",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Rassie_van_der_Dussen_%28cropped%29.jpg/200px-Rassie_van_der_Dussen_%28cropped%29.jpg",
      },
      {
        name: "David Miller",
        role: "batsman",
        battingOrder: 5,
        isBowler: false,
        skinTone: "#C09060",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/David_Miller_%28cricketer%2C_cropped%29.jpg/200px-David_Miller_%28cricketer%2C_cropped%29.jpg",
      },
      {
        name: "Heinrich Klaasen",
        role: "batsman",
        battingOrder: 4,
        isBowler: false,
        skinTone: "#C4885A",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Heinrich_Klaasen_%28cropped%29.jpg/200px-Heinrich_Klaasen_%28cropped%29.jpg",
      },
      {
        name: "Marco Jansen",
        role: "allrounder",
        battingOrder: 6,
        isBowler: true,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Marco_Jansen_%28cropped%29.jpg/200px-Marco_Jansen_%28cropped%29.jpg",
      },
      {
        name: "Kagiso Rabada",
        role: "bowler",
        battingOrder: 8,
        isBowler: true,
        skinTone: "#3D2B1A",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Kagiso_Rabada_%28cropped%29.jpg/200px-Kagiso_Rabada_%28cropped%29.jpg",
      },
      {
        name: "Anrich Nortje",
        role: "bowler",
        battingOrder: 9,
        isBowler: true,
        skinTone: "#C09060",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Anrich_Nortje_%28cropped%29.jpg/200px-Anrich_Nortje_%28cropped%29.jpg",
      },
      {
        name: "Tabraiz Shamsi",
        role: "bowler",
        battingOrder: 11,
        isBowler: true,
        skinTone: "#8B6B40",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Tabraiz_Shamsi_%28cropped%29.jpg/200px-Tabraiz_Shamsi_%28cropped%29.jpg",
      },
      {
        name: "Wayne Parnell",
        role: "bowler",
        battingOrder: 10,
        isBowler: true,
        skinTone: "#7D5A3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Wayne_Parnell_%28cropped%29.jpg/200px-Wayne_Parnell_%28cropped%29.jpg",
      },
      {
        name: "Aiden Markram",
        role: "allrounder",
        battingOrder: 7,
        isBowler: true,
        skinTone: "#C09060",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Aiden_Markram_%28cropped%29.jpg/200px-Aiden_Markram_%28cropped%29.jpg",
      },
    ],
  },
  {
    id: "newzealand",
    name: "New Zealand",
    shortName: "NZ",
    flag: "🇳🇿",
    primaryColor: "#000000",
    secondaryColor: "#FFFFFF",
    jerseyColor: "#1A1A1A",
    helmetColor: "#0D0D0D",
    players: [
      {
        name: "Kane Williamson",
        role: "batsman",
        battingOrder: 1,
        isBowler: false,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Kane_Williamson_%28cropped%29.jpg/200px-Kane_Williamson_%28cropped%29.jpg",
      },
      {
        name: "Devon Conway",
        role: "wicketkeeper",
        battingOrder: 2,
        isBowler: false,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Devon_Conway_%28cropped%29.jpg/200px-Devon_Conway_%28cropped%29.jpg",
      },
      {
        name: "Martin Guptill",
        role: "batsman",
        battingOrder: 3,
        isBowler: false,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Martin_Guptill_%28cropped%29.jpg/200px-Martin_Guptill_%28cropped%29.jpg",
      },
      {
        name: "Daryl Mitchell",
        role: "allrounder",
        battingOrder: 4,
        isBowler: true,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Daryl_Mitchell_%28cricketer%2C_cropped%29.jpg/200px-Daryl_Mitchell_%28cricketer%2C_cropped%29.jpg",
      },
      {
        name: "Glenn Phillips",
        role: "batsman",
        battingOrder: 5,
        isBowler: false,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Glenn_Phillips_%28cropped%29.jpg/200px-Glenn_Phillips_%28cropped%29.jpg",
      },
      {
        name: "Mitchell Santner",
        role: "allrounder",
        battingOrder: 6,
        isBowler: true,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Mitchell_Santner_%28cropped%29.jpg/200px-Mitchell_Santner_%28cropped%29.jpg",
      },
      {
        name: "Trent Boult",
        role: "bowler",
        battingOrder: 9,
        isBowler: true,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Trent_Boult_%28cropped%29.jpg/200px-Trent_Boult_%28cropped%29.jpg",
      },
      {
        name: "Tim Southee",
        role: "bowler",
        battingOrder: 8,
        isBowler: true,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Tim_Southee_%28cropped%29.jpg/200px-Tim_Southee_%28cropped%29.jpg",
      },
      {
        name: "Ish Sodhi",
        role: "bowler",
        battingOrder: 11,
        isBowler: true,
        skinTone: "#8B6B40",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Ish_Sodhi_%28cropped%29.jpg/200px-Ish_Sodhi_%28cropped%29.jpg",
      },
      {
        name: "Lockie Ferguson",
        role: "bowler",
        battingOrder: 10,
        isBowler: true,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Lockie_Ferguson_%28cropped%29.jpg/200px-Lockie_Ferguson_%28cropped%29.jpg",
      },
      {
        name: "James Neesham",
        role: "allrounder",
        battingOrder: 7,
        isBowler: true,
        skinTone: "#D4A574",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Jimmy_Neesham_%28cropped%29.jpg/200px-Jimmy_Neesham_%28cropped%29.jpg",
      },
    ],
  },
  {
    id: "westindies",
    name: "West Indies",
    shortName: "WI",
    flag: "🏝️",
    primaryColor: "#7B0041",
    secondaryColor: "#FFC61E",
    jerseyColor: "#7B0041",
    helmetColor: "#5A0030",
    players: [
      {
        name: "Kieron Pollard",
        role: "allrounder",
        battingOrder: 5,
        isBowler: true,
        skinTone: "#2D1B0E",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Kieron_Pollard_%28cropped%29.jpg/200px-Kieron_Pollard_%28cropped%29.jpg",
      },
      {
        name: "Chris Gayle",
        role: "batsman",
        battingOrder: 1,
        isBowler: false,
        skinTone: "#2D1B0E",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Chris_Gayle_%28cropped%29.jpg/200px-Chris_Gayle_%28cropped%29.jpg",
      },
      {
        name: "Andre Russell",
        role: "allrounder",
        battingOrder: 4,
        isBowler: true,
        skinTone: "#2D1B0E",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Andre_Russell_%28cropped%29.jpg/200px-Andre_Russell_%28cropped%29.jpg",
      },
      {
        name: "Shimron Hetmyer",
        role: "batsman",
        battingOrder: 3,
        isBowler: false,
        skinTone: "#3D2B1A",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Shimron_Hetmyer_%28cropped%29.jpg/200px-Shimron_Hetmyer_%28cropped%29.jpg",
      },
      {
        name: "Nicholas Pooran",
        role: "wicketkeeper",
        battingOrder: 2,
        isBowler: false,
        skinTone: "#4A2C17",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Nicholas_Pooran_%28cropped%29.jpg/200px-Nicholas_Pooran_%28cropped%29.jpg",
      },
      {
        name: "Jason Holder",
        role: "allrounder",
        battingOrder: 6,
        isBowler: true,
        skinTone: "#2D1B0E",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Jason_Holder_%28cropped%29.jpg/200px-Jason_Holder_%28cropped%29.jpg",
      },
      {
        name: "Dwayne Bravo",
        role: "allrounder",
        battingOrder: 7,
        isBowler: true,
        skinTone: "#3D2B1A",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Dwayne_Bravo_%28cropped%29.jpg/200px-Dwayne_Bravo_%28cropped%29.jpg",
      },
      {
        name: "Fabian Allen",
        role: "allrounder",
        battingOrder: 8,
        isBowler: true,
        skinTone: "#3D2B1A",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Fabian_Allen_%28cropped%29.jpg/200px-Fabian_Allen_%28cropped%29.jpg",
      },
      {
        name: "Alzarri Joseph",
        role: "bowler",
        battingOrder: 10,
        isBowler: true,
        skinTone: "#4A2C17",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Alzarri_Joseph_%28cropped%29.jpg/200px-Alzarri_Joseph_%28cropped%29.jpg",
      },
      {
        name: "Sheldon Cottrell",
        role: "bowler",
        battingOrder: 11,
        isBowler: true,
        skinTone: "#2D1B0E",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Sheldon_Cottrell_%28cropped%29.jpg/200px-Sheldon_Cottrell_%28cropped%29.jpg",
      },
      {
        name: "Obed McCoy",
        role: "bowler",
        battingOrder: 9,
        isBowler: true,
        skinTone: "#3D2B1A",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Obed_McCoy_%28cropped%29.jpg/200px-Obed_McCoy_%28cropped%29.jpg",
      },
    ],
  },
  {
    id: "srilanka",
    name: "Sri Lanka",
    shortName: "SL",
    flag: "🇱🇰",
    primaryColor: "#003F87",
    secondaryColor: "#FFD700",
    jerseyColor: "#003F87",
    helmetColor: "#002D63",
    players: [
      {
        name: "Dasun Shanaka",
        role: "allrounder",
        battingOrder: 5,
        isBowler: true,
        skinTone: "#7D5A3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Dasun_Shanaka_%28cropped%29.jpg/200px-Dasun_Shanaka_%28cropped%29.jpg",
      },
      {
        name: "Pathum Nissanka",
        role: "batsman",
        battingOrder: 1,
        isBowler: false,
        skinTone: "#8B5E3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Pathum_Nissanka_%28cropped%29.jpg/200px-Pathum_Nissanka_%28cropped%29.jpg",
      },
      {
        name: "Kusal Mendis",
        role: "wicketkeeper",
        battingOrder: 2,
        isBowler: false,
        skinTone: "#7A4F2D",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Kusal_Mendis_%28cropped%29.jpg/200px-Kusal_Mendis_%28cropped%29.jpg",
      },
      {
        name: "Charith Asalanka",
        role: "batsman",
        battingOrder: 3,
        isBowler: false,
        skinTone: "#8A6040",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Charith_Asalanka_%28cropped%29.jpg/200px-Charith_Asalanka_%28cropped%29.jpg",
      },
      {
        name: "Dhananjaya de Silva",
        role: "allrounder",
        battingOrder: 4,
        isBowler: true,
        skinTone: "#7D5A3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Dhananjaya_de_Silva_%28cropped%29.jpg/200px-Dhananjaya_de_Silva_%28cropped%29.jpg",
      },
      {
        name: "Wanindu Hasaranga",
        role: "allrounder",
        battingOrder: 6,
        isBowler: true,
        skinTone: "#8B5E3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Wanindu_Hasaranga_%28cropped%29.jpg/200px-Wanindu_Hasaranga_%28cropped%29.jpg",
      },
      {
        name: "Maheesh Theekshana",
        role: "bowler",
        battingOrder: 8,
        isBowler: true,
        skinTone: "#7D5A3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Maheesh_Theekshana_%28cropped%29.jpg/200px-Maheesh_Theekshana_%28cropped%29.jpg",
      },
      {
        name: "Lahiru Kumara",
        role: "bowler",
        battingOrder: 10,
        isBowler: true,
        skinTone: "#8A6040",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Lahiru_Kumara_%28cropped%29.jpg/200px-Lahiru_Kumara_%28cropped%29.jpg",
      },
      {
        name: "Dushmantha Chameera",
        role: "bowler",
        battingOrder: 9,
        isBowler: true,
        skinTone: "#7A4F2D",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Dushmantha_Chameera_%28cropped%29.jpg/200px-Dushmantha_Chameera_%28cropped%29.jpg",
      },
      {
        name: "Chamika Karunaratne",
        role: "allrounder",
        battingOrder: 7,
        isBowler: true,
        skinTone: "#8B5E3C",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Chamika_Karunaratne_%28cropped%29.jpg/200px-Chamika_Karunaratne_%28cropped%29.jpg",
      },
      {
        name: "Bhanuka Rajapaksa",
        role: "batsman",
        battingOrder: 11,
        isBowler: false,
        skinTone: "#8A6040",
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Bhanuka_Rajapaksa_%28cropped%29.jpg/200px-Bhanuka_Rajapaksa_%28cropped%29.jpg",
      },
    ],
  },
];

export type DeliveryType =
  | "spin"
  | "swing"
  | "bouncer"
  | "inswing"
  | "outswing";

export const DELIVERY_LABELS: Record<DeliveryType, string> = {
  spin: "🔄 Spin",
  swing: "💨 Swing",
  bouncer: "⚡ Bouncer",
  inswing: "↙ Inswing",
  outswing: "↗ Outswing",
};

export const DELIVERY_COLORS: Record<DeliveryType, string> = {
  spin: "#8B5CF6",
  swing: "#3B82F6",
  bouncer: "#EF4444",
  inswing: "#10B981",
  outswing: "#F59E0B",
};
