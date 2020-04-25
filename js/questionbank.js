define(['jquery'], function($) {
  var QuestionBank = {
    app: null,

    questions: {

      geography_easy_1: {
        type: "question",
        category: "geography",
        difficulty: "2",
        question: "What is the longest river in Africa?",
        choices: [
          "Nile", "Amazon", "Yangtze", "Mississippi"
        ],
        answer: "Nile",
        postAnswer: [
          { type: "image", src:"image/playlist/nile.png", usertype: "host" },
          { type: "html",  value:"<b>Fact:</b> The Nile river flows through 11 African countries and reaches more than 4,250 miles or 6,800 kilometers long. The river ends in Egypt where it flows into the Mediterranean Sea. The Amazon river is a very close second at 3,976 miles." }
        ]
      },
      geography_medium_1: {
        type: "question",
        category: "geography",
        difficulty: "4",
        question: "Which city has the largest population?",
        choices: [
          "New York", "Shanghai", "Tokyo", "Mexico City"
        ],
        answer: "Shanghai",
        postAnswer: [
          { type: "image", src:"image/playlist/shanghai.png", usertype: "host" },
          { type: "html",  value:"<b>Fact:</b> At 24 million people, Shanghai, China has almost three times as many people as New York City or Tokyo." }
        ]
      },
      geography_hard_1: {
        type: "question",
        category: "geography",
        difficulty: "6",
        question: "Which countries share the largest border?",
        choices: [
          "U.S.A. and Canada", "Russia and Kazakhstan", "Argentina and Chile", "Russia and Mongolia"
        ],
        answer: "U.S.A. and Canada",
        postAnswer: [
          { type: "image", src:"image/playlist/usa-canada.png", usertype: "host" },
          { type: "html",  value:"<b>Fact:</b> The United States of America and Canada share the longest border in the world. Including Alaska, 13 U.S. states and 8 Canadian provinces create a border of approximately 5,500 miles long or 8,800 kilometers." }
        ]
      },
      animals_easy_1: {
        type: "question",
        category: "animals",
        difficulty: "2",
        question: "What is the world’s fastest mammal",
        choices: [
          "Pronghorn Antelope", "Cheetah", "Jackrabbit", "Lion"
        ],
        answer: "Cheetah",
        postAnswer: [
          { type: "image", src:"image/playlist/cheetah.png", usertype: "host" },
          { type: "html",  value:"<b>Fact:</b> The Cheetah surpasses all other mammals in speed, running at an incredible maximum speed of 75 miles per hour or 121 kilometers per hour." }
        ]
      },
      animals_medium_1: {
        type: "question",
        category: "animals",
        difficulty: "4",
        question: "Which animal has the longest tail?",
        choices: [
          "Giraffe", "Spider Monkey", "Whiptail Ray", "Chihuahua"
        ],
        answer: "Giraffe",
        postAnswer: [
          { type: "image", src:"image/playlist/giraffe.png", usertype: "host" },
          { type: "html",  value:"<b>Fact:</b> While not disproportionately long in relation to its body, the giraffe's very long tail like its very long neck comes in at 8 feet or nearly 2.5 meters." }
        ]
      },
      animals_hard_1: {
        type: "question",
        category: "animals",
        difficulty: "6",
        question: "Which animal has ears shaped like the continent it lives on?",
        choices: [
          "African Elephant", "Fennec Fox", "Rattlesnake", "Asian Elephant"
        ],
        answer: "African Elephant",
        postAnswer: [
          { type: "image", src:"image/playlist/african-elephant.png", usertype: "host" },
          { type: "html",  value:"<b>Fact:</b> The African elephant has ears shaped like the continent of Africa." }
        ]
      },
      architecture_easy_1: {
        type: "question",
        category: "architecture",
        difficulty: "2",
        question: "In which city will you find the Tower of London?",
        choices: [
          "Newcastle", "Paris", "London", "Alcatraz"
        ],
        answer: "London",
        postAnswer: [
          { type: "image", src:"image/playlist/london.png", usertype: "host" },
          { type: "html",  value:"<b>Fact:</b> This not a trick question. The Tower of London, built in 1078, was notoriously used as a prison from 1100 to 1952 and sits next to the River Thames in London, England." }
        ]
      },
      architecture_hard_1: {
        type: "question",
        category: "architecture",
        difficulty: "6",
        question: "What is the tallest building in the world?",
        choices: [
          "Burj Khalifa", "Salesforce Tower", "Shanghai Tower", "Petronas Tower"
        ],
        answer: "Burj Khalifa",
        postAnswer: [
          { type: "image", src:"image/playlist/burj-khalifa.png", usertype: "host" },
          { type: "html",  value:"<b>Fact:</b> Built in 2008, the Burj Khalifa in Dubai, United Arab Emirates towers over nearby buildings. At over 2,716.5 feet or 828 metres, and more than 160 stories, it dwarfs the Shanghai Tower at 2073 feet and the World Trade center at 1776 feet." }
        ]
      },
      art_medium_1: {
        type: "question",
        category: "art",
        difficulty: "4",
        question: "Who painted the Mona Lisa?",
        choices: [
          "Leonardo da Vinci", "Picasso", "Rembrandt", "Michelangelo", "Master Splinter"
        ],
        answer: "Leonardo da Vinci",
        postAnswer: [
          { type: "image", src:"image/playlist/mona-lisa.png", usertype: "host" },
          { type: "html",  value:"<b>Fact:</b> The Mona Lisa is believed to have been painted between 1503 and 1506 and thought to be the portrait of a Florentine lady by the name of Lisa del Giocondo. It is housed in the Louvre in Paris and its value is estimated to be almost $1 billion dollars." }
        ]
      },
      art_medium_2: {
        type: "question",
        category: "art",
        difficulty: "4",
        question: "To which art movement does Andy Warhol’s Campbell’s Soup Cans Belong?",
        choices: [
          "Surrealism", "Cubism", "Art Nouveau", "Pop Art", "Op (Optical) Art"
        ],
        answer: "Pop Art",
        postAnswer: [
          { type: "image", src:"image/playlist/warhol.png", usertype: "host" },
          { type: "html",  value:"<b>Fact:</b> Pop art uses mass culture, advertising, and even comic books to form its art.  It emerged in Britain and the United States during the mid ‘50s to the early ‘60s with such artists as Andy Warhol and Roy Lichtenstein." }
        ]
      },
      art_hard_1: {
        type: "question",
        category: "art",
        difficulty: "9",
        preQuestion: [
          { type: "image", src:"image/playlist/tree.png", usertype: "normal", delay: 24000 },
          { type: "video", src:"image/playlist/video.mp4", usertype: "host" },
        ],
        question: "Which late-Renaissance artist painted this famous work?",
        choices: [
          "Michalangelo", "Donatello", "Raphael", "Leonardo", "An unknown genius"
        ],
        answer: "An unknown genius",
        postAnswer: [
          { type: "image", src:"image/playlist/tree.png", usertype: "host" }
        ]
      }
    },

    init: function (app) {
      // reference to Trivium app:
      this.app = app;

      return this;
    },

    getQuestions: function (options){
      return this.questions;
    }
    
  };
  return QuestionBank;
});