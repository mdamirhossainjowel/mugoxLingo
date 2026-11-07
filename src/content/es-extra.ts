import type { Unit } from "@/types/course";

export const esExtraUnits: Unit[] = [
  {
    id: "es-u2", title: "Numbers and food",
    lessons: [
      {
        id: "es-numbers-1", title: "Numbers 1 to 5", objective: "Count from one to five.",
        vocab: [{ term: "Uno", meaning: "One" }, { term: "Dos", meaning: "Two" }, { term: "Tres", meaning: "Three" }, { term: "Cuatro", meaning: "Four" }, { term: "Cinco", meaning: "Five" }],
        exercises: [
          { id: "n1-1", type: "mcq", prompt: "What does “tres” mean?", choices: ["Three", "Two", "Four", "Five"], answer: 0 },
          { id: "n1-2", type: "mcq", prompt: "How do you say “Four”?", choices: ["Cinco", "Cuatro", "Dos", "Uno"], answer: 1 },
          { id: "n1-3", type: "match", prompt: "Match each number", pairs: [{ left: "Uno", right: "One" }, { left: "Dos", right: "Two" }, { left: "Tres", right: "Three" }, { left: "Cinco", right: "Five" }] },
          { id: "n1-4", type: "fill", prompt: "One, two, three", before: "Uno, dos,", after: ".", choices: ["tres", "cuatro", "cinco"], answer: 0 },
          { id: "n1-5", type: "build", prompt: "Translate: I have two cats", tiles: ["Tengo", "dos", "gatos", "tres", "perros"], answer: ["Tengo", "dos", "gatos"] },
          { id: "n1-6", type: "translate", prompt: "Translate: Five", accepted: ["Cinco"] },
          { id: "n1-7", type: "translate", prompt: "Translate: Two", accepted: ["Dos"] },
        ],
      },
      {
        id: "es-food-1", title: "Food and drink", objective: "Name common foods and ask for something.",
        vocab: [{ term: "Agua", meaning: "Water" }, { term: "Pan", meaning: "Bread" }, { term: "Leche", meaning: "Milk" }, { term: "Manzana", meaning: "Apple" }, { term: "Café", meaning: "Coffee" }],
        exercises: [
          { id: "f1-1", type: "mcq", prompt: "What does “agua” mean?", choices: ["Water", "Milk", "Bread", "Apple"], answer: 0 },
          { id: "f1-2", type: "mcq", prompt: "How do you say “Bread”?", choices: ["Leche", "Pan", "Café", "Agua"], answer: 1 },
          { id: "f1-3", type: "match", prompt: "Match each food or drink", pairs: [{ left: "Agua", right: "Water" }, { left: "Leche", right: "Milk" }, { left: "Manzana", right: "Apple" }, { left: "Café", right: "Coffee" }] },
          { id: "f1-4", type: "fill", prompt: "I want milk", before: "Quiero", after: ".", choices: ["leche", "pan", "agua"], answer: 0, explain: "“Quiero” means “I want”." },
          { id: "f1-5", type: "build", prompt: "Translate: I want water", tiles: ["Quiero", "agua", "pan", "tengo"], answer: ["Quiero", "agua"] },
          { id: "f1-6", type: "translate", prompt: "Translate: Bread", accepted: ["Pan"] },
          { id: "f1-7", type: "translate", prompt: "Translate: The apple", accepted: ["La manzana"] },
        ],
      },
    ],
  },
  {
    id: "es-u3", title: "Family",
    lessons: [{
      id: "es-family-1", title: "My family", objective: "Talk about your family.",
      vocab: [{ term: "Madre", meaning: "Mother" }, { term: "Padre", meaning: "Father" }, { term: "Hermano", meaning: "Brother" }, { term: "Hermana", meaning: "Sister" }, { term: "Familia", meaning: "Family" }],
      exercises: [
        { id: "m1-1", type: "mcq", prompt: "What does “hermana” mean?", choices: ["Sister", "Brother", "Mother", "Father"], answer: 0 },
        { id: "m1-2", type: "mcq", prompt: "How do you say “Father”?", choices: ["Madre", "Padre", "Hermano", "Familia"], answer: 1 },
        { id: "m1-3", type: "match", prompt: "Match each family word", pairs: [{ left: "Madre", right: "Mother" }, { left: "Padre", right: "Father" }, { left: "Hermano", right: "Brother" }, { left: "Familia", right: "Family" }] },
        { id: "m1-4", type: "fill", prompt: "I have a sister", before: "Tengo una", after: ".", choices: ["hermana", "hermano", "padre"], answer: 0, explain: "“Una” goes with feminine words like “hermana”." },
        { id: "m1-5", type: "build", prompt: "Translate: I have a brother", tiles: ["Tengo", "un", "hermano", "una", "hermana"], answer: ["Tengo", "un", "hermano"] },
        { id: "m1-6", type: "translate", prompt: "Translate: Mother", accepted: ["Madre", "Mamá"] },
        { id: "m1-7", type: "translate", prompt: "Translate: Family", accepted: ["Familia"] },
      ],
    }],
  },
  {
    id: "es-u4", title: "Colors and animals",
    lessons: [
      {
        id: "es-colors-1", title: "Colors", objective: "Name the basic colors.",
        vocab: [{ term: "Rojo", meaning: "Red" }, { term: "Azul", meaning: "Blue" }, { term: "Verde", meaning: "Green" }, { term: "Amarillo", meaning: "Yellow" }, { term: "Negro", meaning: "Black" }],
        exercises: [
          { id: "c1-1", type: "mcq", prompt: "What does “rojo” mean?", choices: ["Red", "Blue", "Green", "Black"], answer: 0 },
          { id: "c1-2", type: "mcq", prompt: "How do you say “Blue”?", choices: ["Verde", "Azul", "Rojo", "Negro"], answer: 1 },
          { id: "c1-3", type: "match", prompt: "Match each color", pairs: [{ left: "Rojo", right: "Red" }, { left: "Azul", right: "Blue" }, { left: "Verde", right: "Green" }, { left: "Negro", right: "Black" }] },
          { id: "c1-4", type: "fill", prompt: "The sky is blue", before: "El cielo es", after: ".", choices: ["azul", "rojo", "negro"], answer: 0 },
          { id: "c1-5", type: "build", prompt: "Translate: The apple is red", tiles: ["La", "manzana", "es", "roja", "verde", "el"], answer: ["La", "manzana", "es", "roja"], explain: "“Roja” ends in -a to match the feminine word “manzana”." },
          { id: "c1-6", type: "translate", prompt: "Translate: Yellow", accepted: ["Amarillo"] },
          { id: "c1-7", type: "translate", prompt: "Translate: Green", accepted: ["Verde"] },
        ],
      },
      {
        id: "es-animals-1", title: "Animals", objective: "Name common animals.",
        vocab: [{ term: "Perro", meaning: "Dog" }, { term: "Gato", meaning: "Cat" }, { term: "Pájaro", meaning: "Bird" }, { term: "Pez", meaning: "Fish" }, { term: "Caballo", meaning: "Horse" }],
        exercises: [
          { id: "a1-1", type: "mcq", prompt: "What does “gato” mean?", choices: ["Cat", "Dog", "Bird", "Fish"], answer: 0 },
          { id: "a1-2", type: "mcq", prompt: "How do you say “Dog”?", choices: ["Gato", "Perro", "Pez", "Caballo"], answer: 1 },
          { id: "a1-3", type: "match", prompt: "Match each animal", pairs: [{ left: "Perro", right: "Dog" }, { left: "Gato", right: "Cat" }, { left: "Pájaro", right: "Bird" }, { left: "Pez", right: "Fish" }] },
          { id: "a1-4", type: "fill", prompt: "I have a dog", before: "Tengo un", after: ".", choices: ["perro", "manzana", "leche"], answer: 0 },
          { id: "a1-5", type: "build", prompt: "Translate: The cat drinks milk", tiles: ["El", "gato", "bebe", "leche", "perro", "agua"], answer: ["El", "gato", "bebe", "leche"], explain: "“Bebe” means “drinks”." },
          { id: "a1-6", type: "translate", prompt: "Translate: Bird", accepted: ["Pájaro"] },
          { id: "a1-7", type: "translate", prompt: "Translate: Fish", accepted: ["Pez"] },
        ],
      },
    ],
  },
  {
    id: "es-u5", title: "Days of the week",
    lessons: [{
      id: "es-days-1", title: "Monday to Friday", objective: "Name the working days of the week.",
      vocab: [{ term: "Lunes", meaning: "Monday" }, { term: "Martes", meaning: "Tuesday" }, { term: "Miércoles", meaning: "Wednesday" }, { term: "Jueves", meaning: "Thursday" }, { term: "Viernes", meaning: "Friday" }],
      exercises: [
        { id: "d1-1", type: "mcq", prompt: "What does “lunes” mean?", choices: ["Monday", "Tuesday", "Friday", "Sunday"], answer: 0, explain: "Days of the week are not capitalized in Spanish." },
        { id: "d1-2", type: "mcq", prompt: "How do you say “Friday”?", choices: ["Jueves", "Viernes", "Martes", "Lunes"], answer: 1 },
        { id: "d1-3", type: "match", prompt: "Match each day", pairs: [{ left: "Lunes", right: "Monday" }, { left: "Martes", right: "Tuesday" }, { left: "Jueves", right: "Thursday" }, { left: "Viernes", right: "Friday" }] },
        { id: "d1-4", type: "fill", prompt: "Monday, Tuesday", before: "Lunes,", after: ".", choices: ["martes", "jueves", "viernes"], answer: 0 },
        { id: "d1-5", type: "build", prompt: "Translate: Today is Monday", tiles: ["Hoy", "es", "lunes", "martes", "soy"], answer: ["Hoy", "es", "lunes"] },
        { id: "d1-6", type: "translate", prompt: "Translate: Wednesday", accepted: ["Miércoles"] },
        { id: "d1-7", type: "translate", prompt: "Translate: Thursday", accepted: ["Jueves"] },
      ],
    }],
  },
  {
    id: "es-u6", title: "Places and phrases",
    lessons: [
      {
        id: "es-places-1", title: "Places", objective: "Name places around town.",
        vocab: [{ term: "Casa", meaning: "House" }, { term: "Escuela", meaning: "School" }, { term: "Tienda", meaning: "Store" }, { term: "Calle", meaning: "Street" }, { term: "Ciudad", meaning: "City" }],
        exercises: [
          { id: "pl1-1", type: "mcq", prompt: "What does “casa” mean?", choices: ["House", "School", "Street", "City"], answer: 0 },
          { id: "pl1-2", type: "mcq", prompt: "How do you say “School”?", choices: ["Tienda", "Escuela", "Calle", "Casa"], answer: 1 },
          { id: "pl1-3", type: "match", prompt: "Match each place", pairs: [{ left: "Casa", right: "House" }, { left: "Escuela", right: "School" }, { left: "Tienda", right: "Store" }, { left: "Ciudad", right: "City" }] },
          { id: "pl1-4", type: "fill", prompt: "I am at home", before: "Estoy en", after: ".", choices: ["casa", "tienda", "calle"], answer: 0, explain: "“En casa” means “at home”." },
          { id: "pl1-5", type: "build", prompt: "Translate: The school is big", tiles: ["La", "escuela", "es", "grande", "casa", "pequeña"], answer: ["La", "escuela", "es", "grande"] },
          { id: "pl1-6", type: "translate", prompt: "Translate: Street", accepted: ["Calle"] },
          { id: "pl1-7", type: "translate", prompt: "Translate: City", accepted: ["Ciudad"] },
        ],
      },
      {
        id: "es-phrases-1", title: "Useful phrases", objective: "Ask a name, ask where something is and ask for help.",
        vocab: [{ term: "¿Cómo te llamas?", meaning: "What is your name?" }, { term: "Me llamo", meaning: "My name is" }, { term: "¿Dónde está?", meaning: "Where is it?" }, { term: "No entiendo", meaning: "I do not understand" }, { term: "Más despacio", meaning: "Slower" }],
        exercises: [
          { id: "ph1-1", type: "mcq", prompt: "What does “¿Cómo te llamas?” mean?", choices: ["What is your name?", "How are you?", "Where are you?", "Who is she?"], answer: 0 },
          { id: "ph1-2", type: "mcq", prompt: "How do you say “I do not understand”?", choices: ["No entiendo", "No tengo", "No quiero", "No sé"], answer: 0 },
          { id: "ph1-3", type: "match", prompt: "Match each phrase", pairs: [{ left: "¿Dónde está?", right: "Where is it?" }, { left: "No entiendo", right: "I do not understand" }, { left: "Me llamo", right: "My name is" }, { left: "Más despacio", right: "Slower" }] },
          { id: "ph1-4", type: "fill", prompt: "My name is Ana", before: "Me", after: "Ana.", choices: ["llamo", "llamas", "llama"], answer: 0, explain: "“Llamo” goes with “yo” (I)." },
          { id: "ph1-5", type: "build", prompt: "Translate: Where is the house?", tiles: ["Dónde", "está", "la", "casa", "el", "soy"], answer: ["Dónde", "está", "la", "casa"] },
          { id: "ph1-6", type: "translate", prompt: "Translate: Slower, please", accepted: ["Más despacio, por favor", "Más despacio"] },
          { id: "ph1-7", type: "translate", prompt: "Translate: I do not understand", accepted: ["No entiendo"] },
        ],
      },
    ],
  },
];
