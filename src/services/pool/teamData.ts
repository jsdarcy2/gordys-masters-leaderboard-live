/**
 * Get base sample teams data for consistency
 */
export const getBaseSampleTeams = () => {
  // Include all teams from the participants list (confirmed teams)
  return {
    "Ben Applebaum": {
      picks: ["Rory McIlroy", "Xander Schauffele", "Shane Lowry", "Tommy Fleetwood", "Robert MacIntyre"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Elia Ayaz": {
      picks: ["Jon Rahm", "Bryson DeChambeau", "Cameron Smith", "Sergio Garcia", "Joaquín Niemann"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Mike Baker": {
      picks: ["Rory McIlroy", "Scottie Scheffler", "Sepp Straka", "Russell Henley", "Joaquín Niemann"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Louis Baker": {
      picks: ["Scottie Scheffler", "Collin Morikawa", "Shane Lowry", "Joaquín Niemann", "Min Woo Lee"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Ross Baker": {
      picks: ["Jon Rahm", "Rory McIlroy", "Brooks Koepka", "Justin Thomas", "Russell Henley"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Peter Bassett": {
      picks: ["Joaquín Niemann", "Bryson DeChambeau", "Sepp Straka", "Akshay Bhatia", "Rory McIlroy"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Ted Beckman": {
      picks: ["Scottie Scheffler", "Bryson DeChambeau", "Keegan Bradley", "Wyndham Clark", "Sahith Theegala"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Hilary Beckman": {
      picks: ["Rory McIlroy", "Collin Morikawa", "Justin Thomas", "Sepp Straka", "Will Zalatoris"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Oliver Beckman": {
      picks: ["Rory McIlroy", "Jon Rahm", "Min Woo Lee", "Justin Thomas", "Tony Finau"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Jimmy Beltz": {
      picks: ["Scottie Scheffler", "Rory McIlroy", "Hideki Matsuyama", "Cameron Smith", "Min Woo Lee"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Peter Beugg": {
      picks: ["Adam Scott", "Dustin Johnson", "Rory McIlroy", "Jon Rahm", "Tommy Fleetwood"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "James Carlson": {
      picks: ["Scottie Scheffler", "Bryson DeChambeau", "Tommy Fleetwood", "Hideki Matsuyama", "Shane Lowry"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Nate Carlson": {
      picks: ["Scottie Scheffler", "Collin Morikawa", "Tommy Fleetwood", "Cameron Smith", "Justin Thomas"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Annie Carlson": {
      picks: ["Rory McIlroy", "Xander Schauffele", "Brooks Koepka", "Patrick Cantlay", "Justin Thomas"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Hadley Carlson": {
      picks: ["Scottie Scheffler", "Rory McIlroy", "Tommy Fleetwood", "Cameron Smith", "Russell Henley"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Quinn Carlson": {
      picks: ["Rory McIlroy", "Ludvig Åberg", "Sepp Straka", "Robert MacIntyre", "Matthieu Pavon"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Ed Corbett": {
      picks: ["Scottie Scheffler", "Rory McIlroy", "Shane Lowry", "Will Zalatoris", "Sepp Straka"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Chuck Corbett Sr": {
      picks: ["Rory McIlroy", "Scottie Scheffler", "Will Zalatoris", "Joaquín Niemann", "Tommy Fleetwood"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Chris Crawford": {
      picks: ["Scottie Scheffler", "Rory McIlroy", "Justin Thomas", "Cameron Smith", "Tyrrell Hatton"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Justin Darcy": {
      picks: ["Rory McIlroy", "Collin Morikawa", "Shane Lowry", "Robert MacIntyre", "Sepp Straka"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Holland Darcy": {
      picks: ["Jordan Spieth", "Collin Morikawa", "Xander Schauffale", "Viktor Hovland", "Jose Luis Ballester (a)"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Audrey Darcy": {
      picks: ["Scottie Scheffler", "Rory McIlroy", "Cameron Smith", "Cameron Young", "Zach Johnson"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Ava Rose Darcy": {
      picks: ["Wyndham Clark", "Justin Rose", "Jon Rahm", "Scottie Scheffler", "Viktor Hovland"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Jay Despard": {
      picks: ["Scottie Scheffler", "Collin Morikawa", "Min Woo Lee", "Russell Henley", "Robert MacIntyre"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Pete Drago": {
      picks: ["Scottie Scheffler", "Collin Morikawa", "Patrick Cantlay", "Sergio Garcia", "Sepp Straka"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Alexa Drago": {
      picks: ["Xander Schauffele", "Scottie Scheffler", "Patrick Cantlay", "Jordan Spieth", "Hideki Matsuyama"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Ollie Drago": {
      picks: ["Scottie Scheffler", "Jon Rahm", "Patrick Cantlay", "Sergio Garcia", "Patrick Reed"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Charlie Drago": {
      picks: ["Jon Rahm", "Collin Morikawa", "Patrick Cantlay", "Patrick Reed", "Jordan Spieth"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Adam Duff": {
      picks: ["Scottie Scheffler", "Collin Morikawa", "Brooks Koepka", "Viktor Hovland", "Cameron Smith"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Tilly Duff": {
      picks: ["Rory McIlroy", "Bryson DeChambeau", "Shane Lowry", "Brooks Koepka", "Tommy Fleetwood"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Gretchen Duff": {
      picks: ["Ludvig Åberg", "Xander Schauffele", "Tommy Fleetwood", "Hideki Matsuyama", "Russell Henley"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Charles Elder": {
      picks: ["Scottie Scheffler", "Rory McIlroy", "Robert MacIntyre", "Joaquín Niemann", "Hideki Matsuyama"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Eric Fox": {
      picks: ["Bryson DeChambeau", "Rory McIlroy", "Wyndham Clark", "Viktor Hovland", "Sepp Straka"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Kyle Flippen": {
      picks: ["Scottie Scheffler", "Rory McIlroy", "Min Woo Lee", "Jordan Spieth", "Brian Harman"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "J.J. Furst": {
      picks: ["Scottie Scheffler", "Xander Schauffele", "Will Zalatoris", "Hideki Matsuyama", "Joaquín Niemann"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Brian Ginkel": {
      picks: ["Scottie Scheffler", "Ludvig Åberg", "Justin Thomas", "Min Woo Lee", "Brooks Koepka"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Grayson Ginkel": {
      picks: ["Scottie Scheffler", "Rory McIlroy", "Patrick Cantlay", "Hideki Matsuyama", "Jordan Spieth"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Mik Gusenius": {
      picks: ["Collin Morikawa", "Xander Schauffele", "Brooks Koepka", "Justin Thomas", "Jordan Spieth"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "John Gustafson": {
      picks: ["Rory McIlroy", "Ludvig Åberg", "Jordan Spieth", "Justin Thomas", "Hideki Matsuyama"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Andy Gustafson": {
      picks: ["Scottie Scheffler", "Rory McIlroy", "Justin Thomas", "Brooks Koepka", "Hideki Matsuyama"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Lily Gustafson": {
      picks: ["Collin Morikawa", "Bryson DeChambeau", "Cameron Smith", "Justin Thomas", "Russell Henley"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "David Hardt": {
      picks: ["Rory McIlroy", "Scottie Scheffler", "Will Zalatoris", "Joaquín Niemann", "Brooks Koepka"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Brack Herfurth": {
      picks: ["Jon Rahm", "Xander Schauffele", "Joaquín Niemann", "Tommy Fleetwood", "Sungjae Im"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Darby Herfurth": {
      picks: ["Rory McIlroy", "Ludvig Åberg", "Patrick Cantlay", "Corey Conners", "Sepp Straka"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Henry Herfurth": {
      picks: ["Collin Morikawa", "Hideki Matsuyama", "Wyndham Clark", "Cameron Smith", "Chris Kirk"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Jess Herfurth": {
      picks: ["Rory McIlroy", "Xander Schauffele", "Russell Henley", "Justin Thomas", "Tommy Fleetwood"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Decker Herfurth": {
      picks: ["Rory McIlroy", "Ludvig Åberg", "Russell Henley", "Sepp Straka", "Hideki Matsuyama"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Rachel Herfurth": {
      picks: ["Rory McIlroy", "Collin Morikawa", "Viktor Hovland", "Justin Thomas", "Tommy Fleetwood"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Amy Jones": {
      picks: ["Rory McIlroy", "Jon Rahm", "Justin Thomas", "Brooks Koepka", "Tommy Fleetwood"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Jim Jones": {
      picks: ["Scottie Scheffler", "Collin Morikawa", "Joaquín Niemann", "Jordan Spieth", "Will Zalatoris"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Carter Jones": {
      picks: ["Tony Finau", "Bryson DeChambeau", "Viktor Hovland", "Hideki Matsuyama", "Xander Schauffele"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Davis Jones": {
      picks: ["Scottie Scheffler", "Bryson DeChambeau", "Justin Thomas", "Patrick Cantlay", "Shane Lowry"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Sargent Johnson": {
      picks: ["Rory McIlroy", "Collin Morikawa", "Robert MacIntyre", "Cameron Smith", "Justin Thomas"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Sargent Johnson, Jr.": {
      picks: ["Scottie Scheffler", "Xander Schauffele", "Russell Henley", "Justin Thomas", "Jordan Spieth"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Chris Kelley": {
      picks: ["Scottie Scheffler", "Rory McIlroy", "Cameron Smith", "Sepp Straka", "Russell Henley"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Paul Kelley": {
      picks: ["Rory McIlroy", "Akshay Bhatia", "Tom Hoge", "Jordan Spieth", "Ludvig Åberg"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Peter Kepic Jr.": {
      picks: ["Rory McIlroy", "Bryson DeChambeau", "Shane Lowry", "Jordan Spieth", "Dustin Johnson"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Sarah Kepic": {
      picks: ["Brooks Koepka", "Tommy Fleetwood", "Will Zalatoris", "Cameron Smith", "Dustin Johnson"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Peter Kepic Sr.": {
      picks: ["Scottie Scheffler", "Rory McIlroy", "Justin Thomas", "Hideki Matsuyama", "Min Woo Lee"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Owen Kepic": {
      picks: ["Scottie Scheffler", "Min Woo Lee", "Will Zalatoris", "Ludvig Åberg", "Brooks Koepka"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Max Kepic": {
      picks: ["Scottie Scheffler", "Bryson DeChambeau", "Justin Thomas", "Viktor Hovland", "Hideki Matsuyama"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Greg Kevane": {
      picks: ["Rory McIlRoy", "Collin Morikawa", "Sepp Straka", "Corey Conners", "Russell Henley"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Rory Kevane": {
      picks: ["Collin Morikawa", "Rory McIlRoy", "Shane Lowry", "Viktor Hovland", "Min Woo Lee"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Andy Koch": {
      picks: ["Bryson DeChambeau", "Jon Rahm", "Patrick Cantlay", "Shane Lowry", "Brooks Koepka"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Chad Kollar": {
      picks: ["Collin Morikawa", "Justin Thomas", "Brooks Koepka", "Hideki Matsuyama", "Patrick Cantlay"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Pete Kostroski": {
      picks: ["Rory McIlroy", "Ludvig Åberg", "Joaquín Niemann", "Tommy Fleetwood", "Shane Lowry"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Dan Lenmark": {
      picks: ["Xander Schauffele", "Scottie Scheffler", "Cameron Smith", "Justin Thomas", "Will Zalatoris"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Jack Lenmark": {
      picks: ["Xander Schauffele", "Rory McIlroy", "Patrick Cantlay", "Shane Lowry", "Matt Fitzpatrick"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Jamie Lockhart": {
      picks: ["Scottie Scheffler", "Jon Rahm", "Will Zalatoris", "Brooks Koepka", "Joaquín Niemann"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Rollie Logan": {
      picks: ["Tony Finau", "Viktor Hovland", "Justin Thomas", "Scottie Scheffler", "Rory McIlroy"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Bo Massopust": {
      picks: ["Scottie Scheffler", "Rory McIlroy", "Brooks Koepka", "Justin Thomas", "Tom Kim"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Elle McClintock": {
      picks: ["Rory McIlroy", "Collin Morikawa", "Hideki Matsuyama", "Jordan Spieth", "Brooks Koepka"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Jenny McClintock": {
      picks: ["Collin Morikawa", "Rory McIlroy", "Justin Thomas", "Hideki Matsuyama", "Russell Henley"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Peggy McClintock": {
      picks: ["Scottie Scheffler", "Collin Morikawa", "Wyndham Clark", "Will Zalatoris", "Sepp Straka"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Kevin McClintock": {
      picks: ["Rory McIlroy", "Collin Morikawa", "Justin Thomas", "Will Zalatoris", "Russell Henley"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Rich McClintock": {
      picks: ["Rory McIlroy", "Scottie Scheffler", "Hideki Matsuyama", "Shane Lowry", "Billy Horschel"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Johnny McWhite": {
      picks: ["Scottie Scheffler", "Jon Rahm", "Jordan Spieth", "Hideki Matsuyama", "Justin Thomas"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Charles Meech Jr": {
      picks: ["Dustin Johnson", "Scottie Scheffler", "Viktor Hovland", "Brooks Koepka", "Bryson DeChambeau"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Jon Moseley": {
      picks: ["Rory McIlroy", "Collin Morikawa", "Robert MacIntyre", "Shane Lowry", "Russell Henley"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Chad Murphy": {
      picks: ["Joaquín Niemann", "Ludvig Åberg", "Min Woo Lee", "Justin Thomas", "Rory McIlroy"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "C.J. Nibbe": {
      picks: ["Rory McIlroy", "Jon Rahm", "Justin Thomas", "Robert MacIntyre", "Min Woo Lee"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Nash Nibbe": {
      picks: ["Rory McIlroy", "Scottie Scheffler", "Min Woo Lee", "Shane Lowry", "Viktor Hovland"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Knox Nibbe": {
      picks: ["Scottie Scheffler", "Jon Rahm", "Justin Thomas", "Patrick Cantlay", "Brooks Koepka"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Julie Nibbe": {
      picks: ["Rory McIlroy", "Collin Morikawa", "Justin Thomas", "Brooks Koepka", "Jordan Spieth"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Jay Perlmutter": {
      picks: ["Russell Henley", "Corey Conners", "Sepp Straka", "Rory McIlroy", "Collin Morikawa"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Les Perry": {
      picks: ["Bryson DeChambeau", "Rory McIlroy", "Sergio Garcia", "Brooks Koepka", "Viktor Hovland"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "James Petrikas Sr.": {
      picks: ["Scottie Scheffler", "Rory McIlroy", "Brooks Koepka", "Jordan Spieth", "Justin Thomas"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "James Petrikas Jr.": {
      picks: ["Scottie Scheffler", "Ludvig Åberg", "Will Zalatoris", "Brooks Koepka", "Shane Lowry"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Davey Phelps": {
      picks: ["Scottie Scheffler", "Rory McIlroy", "Akshay Bhatia", "Will Zalatoris", "Sepp Straka"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Will Phelps": {
      picks: ["Rory McIlroy", "Scottie Scheffler", "Justin Thomas", "Brooks Koepka", "Shane Lowry"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Phil Present Jr.": {
      picks: ["Scottie Scheffler", "Rory McIlroy", "Cameron Smith", "Russell Henley", "Joaquín Niemann"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Phil Present III": {
      picks: ["Scottie Scheffler", "Ludvig Åberg", "Brooks Koepka", "Tommy Fleetwood", "Justin Thomas"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Ravi Ramalingam": {
      picks: ["Xander Schauffele", "Rory McIlroy", "Sepp Straka", "Shane Lowry", "Will Zalatoris"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Charlotte Ramalingam": {
      picks: ["Scottie Scheffler", "Rory McIlroy", "Jordan Spieth", "Justin Thomas", "Justin Rose"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Matt Rogers": {
      picks: ["Scottie Scheffler", "Bryson DeChambeau", "Shane Lowry", "Jason Day", "Dustin Johnson"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Roth Sanner": {
      picks: ["Scottie Scheffler", "Collin Morikawa", "Patrick Cantlay", "Cameron Smith", "Akshay Bhatia"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "John Saunders": {
      picks: ["Scottie Scheffler", "Rory McIlroy", "Joaquín Niemann", "Tommy Fleetwood", "Sahith Theegala"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Jackson Saunders": {
      picks: ["Scottie Scheffler", "Xander Schauffele", "Will Zalatoris", "Cameron Smith", "Viktor Hovland"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Donny Schmitt": {
      picks: ["Rory McIlroy", "Tom Hoge", "Collin Morikawa", "Sepp Straka", "Justin Thomas"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Ryan Schmitt": {
      picks: ["Rory McIlroy", "Scottie Scheffler", "Justin Thomas", "Wyndham Clark", "Russell Henley"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Jon Schwingler": {
      picks: ["Rory McIlroy", "Scottie Scheffler", "Jordan Spieth", "Tommy Fleetwood", "Akshay Bhatia"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Toby Schwingler": {
      picks: ["Collin Morikawa", "Rory McIlroy", "Shane Lowry", "Viktor Hovland", "Russell Henley"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Jack Simmons": {
      picks: ["Jon Rahm", "Rory McIlroy", "Shane Lowry", "Sepp Straka", "Sergio Garcia"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Hayden Simmons": {
      picks: ["Scottie Scheffler", "Xander Schauffele", "Russell Henley", "Billy Horschel", "Justin Thomas"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Tommy Simmons": {
      picks: ["Shane Lowry", "Collin Morikawa", "Will Zalatoris", "J.J. Spaun", "Denny McCarthy"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Victoria Simmons": {
      picks: ["Russell Henley", "Brooks Koepka", "Robert MacIntyre", "Xander Schauffele", "Rory McIlroy"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Tyler Smith": {
      picks: ["Rory McIlroy", "Brooks Koepka", "Danny Willett", "Scottie Scheffler", "Hideki Matsuyama"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Stuie Snyder": {
      picks: ["Rory McIlroy", "Scottie Scheffler", "Cameron Smith", "Justin Thomas", "Denny McCarthy"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Steve Sorenson": {
      picks: ["Rory McIlroy", "Ludvig Åberg", "Keegan Bradley", "Tommy Fleetwood", "Justin Rose"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Katie Stephens": {
      picks: ["Ludvig Åberg", "Wyndham Clark", "Nick Dunlap", "Brooks Koepka", "Scottie Scheffler"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Reven Stephens": {
      picks: ["Rory McIlroy", "Collin Morikawa", "Joaquín Niemann", "Tommy Fleetwood", "Shane Lowry"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Winfield Stephens": {
      picks: ["Xander Schauffele", "Rory McIlroy", "Russell Henley", "Jordan Spieth", "Justin Thomas"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Caelin Stephens": {
      picks: ["Rory McIlroy", "Bryson DeChambeau", "Min Woo Lee", "Jordan Spieth", "Justin Thomas"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Bette Stephens": {
      picks: ["Viktor Hovland", "Scottie Scheffler", "Zach Johnson", "Rory McIlroy", "Denny McCarthy"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Debbie Stofer": {
      picks: ["Rory McIlroy", "Collin Morikawa", "Shane Lowry", "Russell Henley", "Joaquín Niemann"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Gordon Stofer Jr.": {
      picks: ["Scottie Scheffler", "Bryson DeChambeau", "Tony Finau", "Justin Thomas", "Min Woo Lee"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Jimmy Stofer": {
      picks: ["Collin Morikawa", "Rory McIlroy", "Justin Thomas", "Hideki Matsuyama", "Tommy Fleetwood"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Teddy Stofer": {
      picks: ["Rory McIlroy", "Collin Morikawa", "Hideki Matsuyama", "Shane Lowry", "Russell Henley"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Eileen Stofer": {
      picks: ["Bryson DeChambeau", "Ludvig Åberg", "Tommy Fleetwood", "Jordan Spieth", "Robert MacIntyre"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Cora Stofer": {
      picks: ["Bryson DeChambeau", "Jon Rahm", "Joaquín Niemann", "Brooks Koepka", "Tyrrell Hatton"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Gordon Stofer III": {
      picks: ["Rory McIlroy", "Ludvig Åberg", "Brooks Koepka", "Max Homa", "Jordan Spieth"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Addie Stofer": {
      picks: ["Scottie Scheffler", "Rory McIlroy", "Shane Lowry", "Cameron Smith", "Robert MacIntyre"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Ford Stofer": {
      picks: ["Rory McIlroy", "Collin Morikawa", "Jordan Spieth", "Joaquín Niemann", "Tom Kim"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Sylas Stofer": {
      picks: ["Scottie Scheffler", "Bryson DeChambeau", "Akshay Bhatia", "Jordan Spieth", "Russell Henley"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Robby Stofer": {
      picks: ["Rory McIlroy", "Ludvig Åberg", "Will Zalatoris", "Robert MacIntyre", "Russell Henley"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Jon Sturgis": {
      picks: ["Rory McIlroy", "Collin Morikawa", "Corey Conners", "Russell Henley", "Shane Lowry"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Avery Sturgis": {
      picks: ["Scottie Scheffler", "Rory McIlroy", "Hideki Matsuyama", "Sergio Garcia", "Jason Day"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Ethan Sturgis": {
      picks: ["Collin Morikawa", "Ludvig Åberg", "Tom Kim", "Will Zalatoris", "Phil Mickelson"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Sarah Sturgis": {
      picks: ["Bryson DeChambeau", "Scottie Scheffler", "Shane Lowry", "Brooks Koepka", "Jordan Spieth"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Scott Tande": {
      picks: ["Scottie Scheffler", "Collin Morikawa", "Russell Henley", "Justin Thomas", "Sepp Straka"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    },
    "Jess Troyak": {
      picks: ["Rory McIlroy", "Ludvig Åberg", "Hideki Matsuyama", "Will Zalatoris", "Akshay Bhatia"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [138, 280] as [number, number]
    },
    "Chris Willette": {
      picks: ["Collin Morikawa", "Ludvig Åberg", "Justin Thomas", "Joaquín Niemann", "Russell Henley"],
      roundScores: [0, 0, 0, 0, 0],
      tiebreakers: [140, 276] as [number, number]
    }
  };
};
